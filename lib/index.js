import StyleDictionary from 'style-dictionary';

const removeDollarSign = (obj) => {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(removeDollarSign);
    }
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let newKey = key;
            if (key.startsWith("$") &&
                ["value", "type", "description", "extensions"].includes(key.slice(1))) {
                newKey = key.slice(1);
            }
            result[newKey] = removeDollarSign(obj[key]);
        }
    }
    return result;
};

const transformObjectValues = (obj, argTypes) => {
    const transformedGrids = {};
    const transform = (obj, parentKeys = []) => {
        for (const key in obj) {
            if (typeof obj[key] === "object") {
                const currentKeys = [...parentKeys, key];
                transform(obj[key], currentKeys);
            }
            else if (key === "type" && argTypes.includes(obj[key])) {
                const valuePath = parentKeys.join("-");
                const gridValue = obj["value"];
                for (const prop in gridValue) {
                    const newKey = `${valuePath}-${prop}`;
                    transformedGrids[newKey] = {
                        type: obj[key],
                        value: gridValue[prop]
                    };
                }
            }
        }
    };
    transform(obj);
    return transformedGrids;
};

const removeObjectValues = (obj, argTypes) => {
    for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            if ("value" in obj[key] &&
                typeof obj[key]["value"] === "object" &&
                argTypes.includes(obj[key]["type"])) {
                delete obj[key];
            }
            else {
                removeObjectValues(obj[key], argTypes);
            }
        }
    }
    return obj;
};

const config = {
    dictionaryName: "tokens-bruecke",
    transforms: {
        typographyCSS: "typography-css",
        typographyCSSShorthand: "typography-css-shorthand",
        typographySCSS: "typography-scss",
        shadowCSS: "shadow-css",
        blurCSS: "blur-css"
    }
};

const compositeParser = (argTypes = ["typography", "grid", "shadow", "blur"]) => ({
    name: `${config.dictionaryName}/composite-parser`,
    pattern: /\.json$|\.tokens\.json$|\.tokens$/,
    parse: ({ contents }) => {
        const json = JSON.parse(contents);
        delete json.$meta;
        const jsonWithoutDollarSign = removeDollarSign(json);
        const transformedValues = transformObjectValues(jsonWithoutDollarSign, argTypes);
        Object.assign(jsonWithoutDollarSign, transformedValues);
        const jsonWithoutPropertiesWithObjects = removeObjectValues(jsonWithoutDollarSign, argTypes);
        return jsonWithoutPropertiesWithObjects;
    }
});

const DTCGParser = () => ({
    name: `${config.dictionaryName}/dtcg-parser`,
    pattern: /\.json$|\.tokens\.json$|\.tokens$/,
    parse: ({ contents }) => {
        const json = JSON.parse(contents);
        delete json.$meta;
        return removeDollarSign(json);
    }
});

const shadowCSSTransform = () => {
    return {
        name: `${config.dictionaryName}/${config.transforms.shadowCSS}`,
        transitive: true,
        type: "value",
        matcher: ({ type }) => {
            return ["shadow"].includes(type);
        },
        transformer: ({ value }) => {
            const { inset, offsetX, offsetY, blur, spread, color } = value;
            const insetValue = inset ? "inset " : "";
            return `${insetValue}${offsetX || 0} ${offsetY || 0} ${blur || 0} ${spread || 0} ${color}`;
        }
    };
};

const blurCSSTransform = () => {
    return {
        name: `${config.dictionaryName}/${config.transforms.blurCSS}`,
        transitive: true,
        type: "value",
        matcher: ({ type }) => {
            return ["blur"].includes(type);
        },
        transformer: ({ value }) => {
            const { blur } = value;
            return `blur(${blur || 0})`;
        }
    };
};

const typographyCSSTransform = () => {
    return {
        name: `${config.dictionaryName}/${config.transforms.typographyCSS}`,
        type: "value",
        transitive: true,
        matcher: ({ type }) => {
            return ["typography"].includes(type);
        },
        transformer: ({ value, name }) => {
            const { fontFamily, fontSize, fontWeight, lineHeight } = value;
            const shorthandFontProperty = `${fontWeight} ${fontSize}/${lineHeight} "${fontFamily}"`;
            const flattendedValue = {
                [`--${name}-fontFamily`]: `"${fontFamily}"`,
                [`--${name}-fontSize`]: fontSize,
                [`--${name}-fontWeight`]: fontWeight,
                [`--${name}-lineHeight`]: lineHeight
            };
            const cssString = Object.entries(flattendedValue)
                .map(([key, value]) => {
                return `${key}: ${value};`;
            })
                .join("\n  ");
            return `${shorthandFontProperty};\n  ${cssString}`;
        }
    };
};

const typographyCSSShorthandTransform = () => {
    return {
        name: `${config.dictionaryName}/${config.transforms.typographyCSSShorthand}`,
        type: "value",
        transitive: true,
        matcher: ({ type }) => {
            return ["typography"].includes(type);
        },
        transformer: ({ value }) => {
            const { fontFamily, fontSize, fontWeight, lineHeight } = value;
            const shorthandFontProperty = `${fontWeight} ${fontSize}/${lineHeight} "${fontFamily}"`;
            return shorthandFontProperty;
        }
    };
};

const typographySCSSTransform = () => {
    return {
        name: `${config.dictionaryName}/${config.transforms.typographySCSS}`,
        type: "value",
        transitive: true,
        matcher: ({ type }) => {
            return ["typography"].includes(type);
        },
        transformer: ({ value, name }) => {
            const { fontFamily, fontSize, fontWeight, lineHeight } = value;
            const shorthandFontProperty = `${fontWeight} ${fontSize}/${lineHeight} "${fontFamily}"`;
            const flattendedValue = {
                [`$${name}-fontFamily`]: `"${fontFamily}"`,
                [`$${name}-fontSize`]: fontSize,
                [`$${name}-fontWeight`]: fontWeight,
                [`$${name}-lineHeight`]: lineHeight
            };
            const cssString = Object.entries(flattendedValue)
                .map(([key, value]) => {
                return `${key}: ${value};`;
            })
                .join("\n");
            return `${shorthandFontProperty};\n${cssString}`;
        }
    };
};

const transformNames = {
    typographyCSS: `${config.dictionaryName}/${config.transforms.typographyCSS}`,
    typographyCSSShorthand: `${config.dictionaryName}/${config.transforms.typographyCSSShorthand}`,
    typographySCSS: `${config.dictionaryName}/${config.transforms.typographySCSS}`,
    shadowCSS: `${config.dictionaryName}/${config.transforms.shadowCSS}`,
    blurCSS: `${config.dictionaryName}/${config.transforms.blurCSS}`
};
const registerTransform = (transformsArg) => {
    const transformTypes = Array.isArray(transformsArg)
        ? transformsArg
        : [transformsArg];
    transformTypes.forEach((transformType) => {
        const transformMap = {
            [transformNames.typographyCSS]: typographyCSSTransform,
            [transformNames.typographyCSSShorthand]: typographyCSSShorthandTransform,
            [transformNames.typographySCSS]: typographySCSSTransform,
            [transformNames.shadowCSS]: shadowCSSTransform,
            [transformNames.blurCSS]: blurCSSTransform
        };
        const transform = transformMap[transformType];
        if (!transform) {
            throw new Error(`Unknown transform type: ${transformType}`);
        }
        StyleDictionary.registerTransform(transform());
    });
    const selectedCSSTransforms = transformTypes.filter((transformType) => transformType.includes("-css"));
    const selectedSCSSTransforms = transformTypes.filter((transformType) => transformType.includes("-scss") ||
        transformType.includes(config.transforms.typographyCSSShorthand) ||
        transformType.includes(config.transforms.blurCSS) ||
        transformType.includes(config.transforms.shadowCSS));
    console.log("CSS transforms", selectedCSSTransforms);
    console.log("SCSS transforms", selectedSCSSTransforms);
    if (selectedCSSTransforms.length > 0) {
        StyleDictionary.registerTransformGroup({
            name: `${config.dictionaryName}/css`,
            transforms: ["name/cti/kebab", ...selectedCSSTransforms]
        });
    }
    if (selectedSCSSTransforms.length > 0) {
        StyleDictionary.registerTransformGroup({
            name: `${config.dictionaryName}/scss`,
            transforms: ["name/cti/kebab", ...selectedSCSSTransforms]
        });
    }
};

export { DTCGParser, compositeParser, config, registerTransform, removeDollarSign, removeObjectValues, transformObjectValues };
//# sourceMappingURL=index.js.map

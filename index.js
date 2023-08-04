'use strict';

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

const transformObjectValues = (obj, parentKeys = []) => {
    const transformedGrids = {};
    for (const key in obj) {
        if (typeof obj[key] === "object") {
            const currentKeys = [...parentKeys, key];
            const nestedTransformed = transformObjectValues(obj[key], currentKeys);
            Object.assign(transformedGrids, nestedTransformed);
        }
        else if ((key === "type" && obj[key] === "grid") ||
            (key === "type" && obj[key] === "typography") ||
            (key === "type" && obj[key] === "shadow") ||
            (key === "type" && obj[key] === "blur")) {
            const valuePath = parentKeys.join("-");
            const gridValue = obj["value"];
            for (const prop in gridValue) {
                const newKey = `${valuePath}-${prop}`;
                transformedGrids[newKey] = {
                    type: "grid",
                    value: gridValue[prop]
                };
            }
        }
    }
    return transformedGrids;
};

const removeObjectValues = (obj) => {
    for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            if ("value" in obj[key] && typeof obj[key]["value"] === "object") {
                delete obj[key];
            }
            else {
                removeObjectValues(obj[key]);
            }
        }
    }
    return obj;
};

const BrueckeParser = {
    name: "custom/tokensBruecke",
    pattern: /\.json$|\.tokens\.json$|\.tokens$/,
    parse: ({ contents }) => {
        // Remove $meta from the JSON
        const json = JSON.parse(contents);
        delete json.$meta;
        // Remove $ from the JSON
        const jsonWithoutDollarSign = removeDollarSign(json);
        const transformedValues = transformObjectValues(jsonWithoutDollarSign);
        Object.assign(jsonWithoutDollarSign, transformedValues);
        // Remove properties with objects
        const jsonWithoutPropertiesWithObjects = removeObjectValues(jsonWithoutDollarSign);
        return jsonWithoutPropertiesWithObjects;
    }
};

const DTCGParser = {
    name: "custom/dtcg",
    pattern: /\.json$|\.tokens\.json$|\.tokens$/,
    parse: ({ contents }) => {
        // Remove $meta from the JSON
        const json = JSON.parse(contents);
        delete json.$meta;
        return removeDollarSign(json);
    }
};

exports.BrueckeParser = BrueckeParser;
exports.DTCGParser = DTCGParser;
exports.removeDollarSign = removeDollarSign;
exports.removeObjectValues = removeObjectValues;
exports.transformObjectValues = transformObjectValues;
//# sourceMappingURL=index.js.map

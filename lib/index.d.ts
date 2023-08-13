interface AnyObject {
  [key: string]: any;
}

type compositeType = "grid" | "typography" | "shadow" | "blur";

declare const removeDollarSign: (obj: AnyObject) => AnyObject;

declare const transformObjectValues: (obj: any, argTypes: compositeType[]) => Record<string, AnyObject>;

declare const removeObjectValues: (obj: AnyObject, argTypes: compositeType[]) => AnyObject;

declare const config: {
    dictionaryName: string;
    transforms: {
        typographyCSS: string;
        typographyCSSShorthand: string;
        typographySCSS: string;
        shadowCSS: string;
        blurCSS: string;
    };
};

interface ParserResult$1 {
    name: string;
    pattern: RegExp;
    parse: (options: {
        contents: string;
    }) => Record<string, any>;
}
declare const compositeParser: (argTypes?: compositeType[]) => ParserResult$1;

interface ParserResult {
    name: string;
    pattern: RegExp;
    parse: (options: {
        contents: string;
    }) => Record<string, any>;
}
declare const DTCGParser: () => ParserResult;

declare const transformNames: {
    typographyCSS: string;
    typographyCSSShorthand: string;
    typographySCSS: string;
    shadowCSS: string;
    blurCSS: string;
};
type transformType = (typeof transformNames)[keyof typeof transformNames];
declare const registerTransform: (transformsArg: transformType | transformType[]) => void;

export { DTCGParser, compositeParser, config, registerTransform, removeDollarSign, removeObjectValues, transformObjectValues };

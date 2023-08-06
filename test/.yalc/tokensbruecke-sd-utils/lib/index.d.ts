interface AnyObject {
  [key: string]: any;
}

declare const removeDollarSign: (obj: AnyObject) => AnyObject;

declare const transformObjectValues: (obj: any, parentKeys?: string[]) => Record<string, AnyObject>;

declare const removeObjectValues: (obj: AnyObject) => AnyObject;

interface ParserResult$1 {
    name: string;
    pattern: RegExp;
    parse: (options: {
        contents: string;
    }) => Record<string, any>;
}
declare const BrueckeParser: ParserResult$1;

interface ParserResult {
    name: string;
    pattern: RegExp;
    parse: (options: {
        contents: string;
    }) => Record<string, any>;
}
declare const DTCGParser: ParserResult;

declare const registerTransform: (transformType: "tokensBruecke/shadow-css") => void;

export { BrueckeParser, DTCGParser, registerTransform, removeDollarSign, removeObjectValues, transformObjectValues };

import {
  removeDollarSign,
  transformObjectValues,
  removeObjectValues
} from "../helpers";

interface ParserResult {
  name: string;
  pattern: RegExp;
  parse: (options: { contents: string }) => Record<string, any>;
}

export const BrueckeParser = {
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
    const jsonWithoutPropertiesWithObjects = removeObjectValues(
      jsonWithoutDollarSign
    );

    return jsonWithoutPropertiesWithObjects;
  }
} as ParserResult;

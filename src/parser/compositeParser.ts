import { config } from "../helpers";
import { compositeType } from "../../types";
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

export const compositeParser = (
  argTypes: compositeType[] = ["typography", "grid", "shadow", "blur"]
) =>
  ({
    name: `${config.dictionaryName}/composite-parser`,
    pattern: /\.json$|\.tokens\.json$|\.tokens$/,
    parse: ({ contents }) => {
      // Remove $meta from the JSON
      const json = JSON.parse(contents);
      delete json.$meta;

      // Remove $ from the JSON
      const jsonWithoutDollarSign = removeDollarSign(json);
      const transformedValues = transformObjectValues(
        jsonWithoutDollarSign,
        argTypes
      );

      Object.assign(jsonWithoutDollarSign, transformedValues);

      // Remove properties with objects
      const jsonWithoutPropertiesWithObjects = removeObjectValues(
        jsonWithoutDollarSign,
        argTypes
      );

      return jsonWithoutPropertiesWithObjects;
    }
  } as ParserResult);

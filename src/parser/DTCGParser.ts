import { config } from "../helpers";
import { removeDollarSign } from "../helpers";

interface ParserResult {
  name: string;
  pattern: RegExp;
  parse: (options: { contents: string }) => Record<string, any>;
}

export const DTCGParser = () =>
  ({
    name: `${config.dictionaryName}/dtcg-parser`,
    pattern: /\.json$|\.tokens\.json$|\.tokens$/,
    parse: ({ contents }) => {
      // Remove $meta from the JSON
      const json = JSON.parse(contents);
      delete json.$meta;

      return removeDollarSign(json);
    }
  } as ParserResult);

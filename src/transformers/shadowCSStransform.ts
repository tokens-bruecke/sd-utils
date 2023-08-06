import StyleDictionary from "style-dictionary";
import { ShadowTokenValueType } from "tokens-bruecke/token-types";

export const shadowCSStransform = () => {
  StyleDictionary.registerTransform({
    name: "tokensBruecke/shadow-css",
    type: "value",
    matcher: ({ type }) => {
      return ["shadow"].includes(type);
    },
    transformer: ({ value }) => {
      const { inset, offsetX, offsetY, blur, spread, color } =
        value as ShadowTokenValueType;

      const insetValue = inset ? "inset " : "";

      return `${insetValue}${offsetX || 0} ${offsetY || 0} ${blur || 0} ${
        spread || 0
      } ${color}`;
    }
  });

  StyleDictionary.registerTransformGroup({
    name: "tokensBruecke/shadow-css",
    transforms: ["tokensBruecke/shadow-css", "attribute/cti", "name/cti/kebab"]
  });
};

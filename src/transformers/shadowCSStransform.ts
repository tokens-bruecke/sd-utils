import { config } from "../helpers";
// import global from "@tokens-bruecke/token-types";

export const shadowCSSTransform = () => {
  return {
    name: `${config.dictionaryName}/${config.transforms.shadowCSS}`,
    transitive: true,
    type: "value",
    matcher: ({ type }) => {
      return ["shadow"].includes(type);
    },
    transformer: ({ value }: { value: ShadowTokenValueType }) => {
      const { inset, offsetX, offsetY, blur, spread, color } = value;

      const insetValue = inset ? "inset " : "";

      return `${insetValue}${offsetX || 0} ${offsetY || 0} ${blur || 0} ${
        spread || 0
      } ${color}`;
    }
  } as any;
};

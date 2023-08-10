import { config } from "../helpers";

export const typographyCSSShorthandTransform = () => {
  return {
    name: `${config.dictionaryName}/${config.transforms.typographyCSSShorthand}`,
    type: "value",
    transitive: true,
    matcher: ({ type }) => {
      return ["typography"].includes(type);
    },
    transformer: ({ value }) => {
      const { fontFamily, fontSize, fontWeight, lineHeight } =
        value as TypographyTokenValueType;

      const shorthandFontProperty = `${fontWeight} ${fontSize}/${lineHeight} "${fontFamily}"`;

      return shorthandFontProperty;
    }
  } as any;
};

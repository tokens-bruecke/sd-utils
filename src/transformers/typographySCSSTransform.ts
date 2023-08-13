import { config } from "../helpers";

export const typographySCSSTransform = () => {
  return {
    name: `${config.dictionaryName}/${config.transforms.typographyCSS}`,
    type: "value",
    transitive: true,
    matcher: ({ type }) => {
      return ["typography"].includes(type);
    },
    transformer: ({ value, name }) => {
      const { fontFamily, fontSize, fontWeight, lineHeight } =
        value as TypographyTokenValueType;

      const shorthandFontProperty = `${fontWeight} ${fontSize}/${lineHeight} "${fontFamily}"`;

      const flattendedValue = {
        [`$${name}-fontFamily`]: `"${fontFamily}"`,
        [`$${name}-fontSize`]: fontSize,
        [`$${name}-fontWeight`]: fontWeight,
        [`$${name}-lineHeight`]: lineHeight
      };

      // convert into string
      const cssString = Object.entries(flattendedValue)
        .map(([key, value]) => {
          return `${key}: ${value};`;
        })
        .join("\n  ");

      return `${shorthandFontProperty};\n  ${cssString}`;
    }
  } as any;
};

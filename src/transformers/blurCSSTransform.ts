import { config } from "../helpers";

export const blurCSSTransform = () => {
  return {
    name: `${config.dictionaryName}/${config.transforms.blurCSS}`,
    transitive: true,
    type: "value",
    matcher: ({ type }) => {
      return ["blur"].includes(type);
    },
    transformer: ({ value }: { value: BlurTokenValueType }) => {
      const { blur } = value;

      return `blur(${blur || 0})`;
    }
  } as any;
};

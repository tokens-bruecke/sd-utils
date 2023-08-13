import StyleDictionary from "style-dictionary";
import { config } from "../helpers";
import { shadowCSSTransform } from "./shadowCSSTransform";
import { blurCSSTransform } from "./blurCSSTransform";
import { typographyCSSTransform } from "./typographyCSSTransform";
import { typographyCSSShorthandTransform } from "./typographyCSSShorthandTransform";
import { typographySCSSTransform } from "./typographySCSSTransform";

const transformNames = {
  typographyCSS: `${config.dictionaryName}/${config.transforms.typographyCSS}`,
  typographyCSSShorthand: `${config.dictionaryName}/${config.transforms.typographyCSSShorthand}`,
  typographySCSSTransform: `${config.dictionaryName}/${config.transforms.typographySCSS}`,
  shadowCSS: `${config.dictionaryName}/${config.transforms.shadowCSS}`,
  blurCSS: `${config.dictionaryName}/${config.transforms.blurCSS}`
};

type transformType = (typeof transformNames)[keyof typeof transformNames];

export const registerTransform = (
  transformsArg: transformType | transformType[]
) => {
  const transformTypes = Array.isArray(transformsArg)
    ? transformsArg
    : [transformsArg];

  transformTypes.forEach((transformType) => {
    const transformMap = {
      [transformNames.typographyCSS]: typographyCSSTransform,
      [transformNames.typographyCSSShorthand]: typographyCSSShorthandTransform,
      [transformNames.typographySCSSTransform]: typographySCSSTransform,
      [transformNames.shadowCSS]: shadowCSSTransform,
      [transformNames.blurCSS]: blurCSSTransform
    };

    const transform = transformMap[transformType];

    if (!transform) {
      throw new Error(`Unknown transform type: ${transformType}`);
    }

    StyleDictionary.registerTransform(transform());
  });

  console.log("transformTypes", transformTypes);

  StyleDictionary.registerTransformGroup({
    name: `${config.dictionaryName}/custom`,
    transforms: ["name/cti/kebab", ...transformTypes]
  });
};

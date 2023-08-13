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
  typographySCSS: `${config.dictionaryName}/${config.transforms.typographySCSS}`,
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
      [transformNames.typographySCSS]: typographySCSSTransform,
      [transformNames.shadowCSS]: shadowCSSTransform,
      [transformNames.blurCSS]: blurCSSTransform
    };

    const transform = transformMap[transformType];

    if (!transform) {
      throw new Error(`Unknown transform type: ${transformType}`);
    }

    StyleDictionary.registerTransform(transform());
  });

  const selectedCSSTransforms = transformTypes.filter((transformType) =>
    transformType.includes("-css")
  );
  const selectedSCSSTransforms = transformTypes.filter(
    (transformType) =>
      transformType.includes("-scss") ||
      transformType.includes(config.transforms.typographyCSSShorthand) ||
      transformType.includes(config.transforms.blurCSS) ||
      transformType.includes(config.transforms.shadowCSS)
  );

  console.log("CSS transforms", selectedCSSTransforms);
  console.log("SCSS transforms", selectedSCSSTransforms);

  if (selectedCSSTransforms.length > 0) {
    StyleDictionary.registerTransformGroup({
      name: `${config.dictionaryName}/css`,
      transforms: ["name/cti/kebab", ...selectedCSSTransforms]
    });
  }

  if (selectedSCSSTransforms.length > 0) {
    StyleDictionary.registerTransformGroup({
      name: `${config.dictionaryName}/scss`,
      transforms: ["name/cti/kebab", ...selectedSCSSTransforms]
    });
  }
};

import { transformType } from "../../types";
import { shadowCSStransform } from "./shadowCSStransform";

export const registerTransform = (transformType: transformType) => {
  switch (transformType) {
    case "tokensBruecke/shadow-css":
      return shadowCSStransform();
    default:
      return;
  }
};

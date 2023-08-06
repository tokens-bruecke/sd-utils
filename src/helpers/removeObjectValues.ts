import { AnyObject, compositeType } from "../../types";

export const removeObjectValues = (
  obj: AnyObject,
  argTypes: compositeType[]
): AnyObject => {
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (
        "value" in obj[key] &&
        typeof obj[key]["value"] === "object" &&
        argTypes.includes(obj[key]["type"])
      ) {
        delete obj[key];
      } else {
        removeObjectValues(obj[key], argTypes);
      }
    }
  }

  return obj;
};

import { AnyObject } from "../../types";

export const removeObjectValues = (obj: AnyObject): AnyObject => {
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if ("value" in obj[key] && typeof obj[key]["value"] === "object") {
        delete obj[key];
      } else {
        removeObjectValues(obj[key]);
      }
    }
  }

  return obj;
};

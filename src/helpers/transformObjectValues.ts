import { AnyObject, compositeType } from "../../types";

export const transformObjectValues = (
  obj: any,
  argTypes: compositeType[]
): Record<string, AnyObject> => {
  const transformedGrids: Record<string, AnyObject> = {};

  const transform = (obj: any, parentKeys: string[] = []) => {
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        const currentKeys: string[] = [...parentKeys, key];
        transform(obj[key], currentKeys);
      } else if (key === "type" && argTypes.includes(obj[key])) {
        const valuePath = parentKeys.join("-");
        const gridValue = obj["value"];
        for (const prop in gridValue) {
          const newKey = `${valuePath}-${prop}`;
          transformedGrids[newKey] = {
            type: obj[key],
            value: gridValue[prop]
          };
        }
      }
    }
  };

  transform(obj);

  return transformedGrids;
};

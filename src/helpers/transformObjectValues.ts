export const transformObjectValues = (
  obj: any,
  parentKeys: string[] = []
): Record<string, AnyObject> => {
  const transformedGrids: Record<string, AnyObject> = {};

  for (const key in obj) {
    if (typeof obj[key] === "object") {
      const currentKeys: string[] = [...parentKeys, key];
      const nestedTransformed = transformObjectValues(obj[key], currentKeys);
      Object.assign(transformedGrids, nestedTransformed);
    } else if (
      (key === "type" && obj[key] === "grid") ||
      (key === "type" && obj[key] === "typography") ||
      (key === "type" && obj[key] === "shadow") ||
      (key === "type" && obj[key] === "blur")
    ) {
      const valuePath = parentKeys.join("-");
      const gridValue = obj["value"];
      for (const prop in gridValue) {
        const newKey = `${valuePath}-${prop}`;
        transformedGrids[newKey] = {
          type: "grid",
          value: gridValue[prop]
        };
      }
    }
  }

  return transformedGrids;
};

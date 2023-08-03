export const removeDollarSign = (obj: AnyObject): AnyObject => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeDollarSign);
  }

  const result: AnyObject = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let newKey = key;

      if (
        key.startsWith("$") &&
        ["value", "type", "description", "extensions"].includes(key.slice(1))
      ) {
        newKey = key.slice(1);
      }

      result[newKey] = removeDollarSign(obj[key]);
    }
  }

  return result;
};

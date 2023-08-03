import {
  removeDollarSign,
  transformObjectValues,
  removeObjectValues
} from "./../helpers";

export const DTCGParser = () => {
  return {
    name: "custom/json",
    pattern: /\.json$|\.tokens\.json$|\.tokens$/,
    parse: ({ contents }) => {
      // Remove $meta from the JSON
      const json = JSON.parse(contents);
      delete json.$meta;

      // Remove $ from the JSON
      const jsonWithoutDollarSign = removeDollarSign(json);
      const transformedGrids = transformObjectValues(jsonWithoutDollarSign);

      Object.assign(jsonWithoutDollarSign, transformedGrids);

      // Remove properties with objects
      const jsonWithoutPropertiesWithObjects = removeObjectValues(
        jsonWithoutDollarSign
      );

      return jsonWithoutPropertiesWithObjects;
    }
  };
};

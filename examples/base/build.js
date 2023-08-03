const StyleDictionary = require("style-dictionary");

/* -------------------- */
/* UTILITIES ---------- */
/* -------------------- */

const removeDollarSign = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeDollarSign);
  }

  const result = {};

  for (const key in obj) {
    const keyProperty = Object.prototype.hasOwnProperty.call(obj, key);
    if (keyProperty) {
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

function transformDeepGrids(obj, parentKeys = []) {
  const transformedGrids = {};

  for (const key in obj) {
    if (typeof obj[key] === "object") {
      const currentKeys = [...parentKeys, key];
      const nestedTransformed = transformDeepGrids(obj[key], currentKeys);
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
}

function removeObjectsWithValueObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if ("value" in obj[key] && typeof obj[key]["value"] === "object") {
        delete obj[key];
      } else {
        removeObjectsWithValueObject(obj[key]);
      }
    }
  }

  return obj;
}

/* -------------------- */
/* CONFIGURATIONS ----- */
/* -------------------- */

console.log("Build started...");
console.log("\n==============================================");

StyleDictionary.registerParser({
  name: "custom/json",
  pattern: /\.json$|\.tokens\.json$|\.tokens$/,
  parse: ({ contents }) => {
    // Remove $meta from the JSON
    const json = JSON.parse(contents);
    delete json.$meta;

    // Remove $ from the JSON
    const jsonWithoutDollarSign = removeDollarSign(json);
    const transformedGrids = transformDeepGrids(jsonWithoutDollarSign);

    Object.assign(jsonWithoutDollarSign, transformedGrids);

    // Remove properties with objects
    const jsonWithoutPropertiesWithObjects = removeObjectsWithValueObject(
      jsonWithoutDollarSign
    );

    return jsonWithoutPropertiesWithObjects;
  }
});

// APPLY THE CONFIGURATION
const StyleDictionaryExtended = StyleDictionary.extend({
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/",
      files: [
        {
          destination: "_variables.css",
          format: "css/variables"
        }
      ]
    }
  }
});

// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms();

console.log("\n==============================================");
console.log("\nBuild completed!");

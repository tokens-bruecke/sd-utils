const StyleDictionary = require("style-dictionary");

/* -------------------- */
/* PARSER UTILS ------- */
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

const transformObjectValues = (obj, parentKeys = []) => {
  const transformedGrids = {};
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      const currentKeys = [...parentKeys, key];
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

const removeObjectValues = (obj) => {
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

/* -------------------- */
/* CUSTOM PARSER ------ */
/* -------------------- */

const BrueckeParser = {
  name: "parser/tokensBruecke",
  pattern: /\.json$|\.tokens\.json$|\.tokens$/,
  parse: ({ contents }) => {
    /* Remove $meta data from the JSON
    /* in order to avoid collision errors */
    const json = JSON.parse(contents);
    delete json.$meta;

    /* Remove $ sign from property names
    /* if they are in DTCG format */
    const jsonWithoutDollarSign = removeDollarSign(json);
    const transformedValues = transformObjectValues(jsonWithoutDollarSign);
    Object.assign(jsonWithoutDollarSign, transformedValues);

    /* Remove properties with values 
    /* that are objects */
    const jsonWithoutPropertiesWithObjects = removeObjectValues(
      jsonWithoutDollarSign
    );
    return jsonWithoutPropertiesWithObjects;
  }
};

/* -------------------- */
/* CONFIGURATIONS ----- */
/* -------------------- */

console.log("Build started...");
console.log("\n==============================================");

/* Register the custom parser */
StyleDictionary.registerParser(BrueckeParser);

/* Extend the Style Dictionary configuration */
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
    },
    scss: {
      transformGroup: "scss",
      buildPath: "build/",
      files: [
        {
          destination: "_variables.scss",
          format: "scss/variables"
        }
      ]
    }
  }
});

/* Build all platforms */
StyleDictionaryExtended.buildAllPlatforms();

console.log("\n==============================================");
console.log("\nBuild completed!");

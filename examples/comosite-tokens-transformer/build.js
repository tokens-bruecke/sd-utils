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
    return removeDollarSign(json);
  }
};

/* -------------------- */
/* CUSTOM TRANSFORMER - */
/* -------------------- */

StyleDictionary.registerTransform({
  name: "tokensBruecke/css",
  type: "value",
  matcher: ({ type }) => {
    return ["typography", "grid", "shadow", "blur"].includes(type);
  },
  transformer: ({ value, name, type }) => {
    const entries = Object.entries(value);

    // const transformedPath = StyleDictionary.transform["name/cti/kebab"].transformer({ path: [key] });

    const flattendedValues = entries.reduce(
      (acc, [key, v], index) =>
        `${acc ? `${acc}\n  ` : ""}${name}-${StyleDictionary.transform[
          "name/cti/kebab"
        ].transformer({ path: [key] }, { prefix: "" })}: ${v}${
          index + 1 === entries.length ? "" : ";"
        }`,
      `${name.includes(type) ? "" : `${type}-`}${name}-group;`
    );

    console.log(flattendedValues);

    return flattendedValues;
  }
});

/* -------------------- */
/* CONFIGURATIONS ----- */
/* -------------------- */

console.log("Build started...");
console.log("\n==============================================");

/* Register the custom parser */
StyleDictionary.registerParser(BrueckeParser);

/* Register the custom transformer */
StyleDictionary.registerTransformGroup({
  name: "custom/css",
  transforms: ["tokensBruecke/css"]
});

/* Extend the Style Dictionary configuration */
const StyleDictionaryExtended = StyleDictionary.extend({
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "custom/css",
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

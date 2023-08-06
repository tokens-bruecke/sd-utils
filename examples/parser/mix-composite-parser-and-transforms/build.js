const StyleDictionary = require("style-dictionary");
const tokensbrueckeSDUtils = require("@tokens-bruecke/sd-utils");

/* -------------------- */
/* CONFIGURATIONS ----- */
/* -------------------- */

console.log("Build started...");
console.log("\n==============================================");

// PARSE COMPOSITE TOKENS
StyleDictionary.registerParser(tokensbrueckeSDUtils.compositeParser(["grid"]));

// TRANSFORM COMPOSITE TOKENS
tokensbrueckeSDUtils.registerTransform([
  "tokens-bruecke/shadow-css",
  "tokens-bruecke/blur-css",
  "tokens-bruecke/typography-css"
]);

// APPLY THE CONFIGURATION
const StyleDictionaryExtended = StyleDictionary.extend({
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "tokens-bruecke/custom",
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

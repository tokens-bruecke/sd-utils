const StyleDictionary = require("style-dictionary");
const tokensbrueckeSDUtils = require("@tokens-bruecke/sd-utils");

/* -------------------- */
/* CONFIGURATIONS ----- */
/* -------------------- */

console.log("Build started...");
console.log("\n==============================================");

// PARSE ALL COMPOSITE TOKENS
StyleDictionary.registerParser(tokensbrueckeSDUtils.compositeParser());

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

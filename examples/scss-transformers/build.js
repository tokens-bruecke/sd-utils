const StyleDictionary = require("style-dictionary");
const tokensbrueckeSDUtils = require("@tokens-bruecke/sd-utils");

/* -------------------- */
/* CONFIGURATIONS ----- */
/* -------------------- */

console.log("Build started...");
console.log("\n==============================================");

// REGISTER THE BASIC PARSER
StyleDictionary.registerParser(tokensbrueckeSDUtils.DTCGParser());

// APPLY MULIPLE TRANSFORMS
tokensbrueckeSDUtils.registerTransform("tokens-bruecke/typography-scss");

// APPLY THE CONFIGURATION
const StyleDictionaryExtended = StyleDictionary.extend({
  source: ["tokens/**/*.json"],
  platforms: {
    scss: {
      transformGroup: "tokens-bruecke/custom",
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

// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms();

console.log("\n==============================================");
console.log("\nBuild completed!");

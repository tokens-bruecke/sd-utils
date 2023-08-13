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
tokensbrueckeSDUtils.registerTransform([
  "tokens-bruecke/typography-css",
  "tokens-bruecke/shadow-css",
  "tokens-bruecke/blur-css",
  "tokens-bruecke/typography-scss"
]);

// APPLY THE CONFIGURATION
const StyleDictionaryExtended = StyleDictionary.extend({
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "tokens-bruecke/css",
      buildPath: "build/",
      files: [
        {
          destination: "_variables.css",
          format: "css/variables"
        }
      ]
    },
    scss: {
      transformGroup: "tokens-bruecke/scss",
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

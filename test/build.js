const StyleDictionary = require("style-dictionary");
const tokensbrueckeSDUtils = require("tokensbruecke-sd-utils");

/* -------------------- */
/* CONFIGURATIONS ----- */
/* -------------------- */

console.log("Build started...");
console.log("\n==============================================");

StyleDictionary.registerParser(tokensbrueckeSDUtils.DTCGParser);

tokensbrueckeSDUtils.registerTransform("tokensBruecke/shadow-css");

// APPLY THE CONFIGURATION
const StyleDictionaryExtended = StyleDictionary.extend({
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "tokensBruecke/shadow-css",
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

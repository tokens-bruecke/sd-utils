const StyleDictionary = require("style-dictionary");
const tokensbrueckeSDUtils = require("@tokens-bruecke/sd-utils");

/* -------------------- */
/* CONFIGURATIONS ----- */
/* -------------------- */

console.log("Build started...");
console.log("\n==============================================");

// REGISTER THE BASIC PARSER
StyleDictionary.registerParser(tokensbrueckeSDUtils.DTCGParser());

/* --------------------------------------------------- */
/* TRANSFORMS ---------------------------------------- */
/* transforms should be registered as a one time thing */
/* but you can register multiple transforms at once -- */
/* just wrap transforms in an array ------------------ */
/* --------------------------------------------------- */

// REGISTER BLUR CSS TRANSFORM
// tokensbrueckeSDUtils.registerTransform("tokens-bruecke/blur-css");

// REGISTER SHADOW CSS TRANSFORM
// tokensbrueckeSDUtils.registerTransform("tokens-bruecke/shadow-css");

// REGISTER TYPOGRAPHY CSS TRANSFORM
// tokensbrueckeSDUtils.registerTransform("tokens-bruecke/typography-css");

// REGISTER TYPOGRAPHY CSS SHORTHAND TRANSFORM
// tokensbrueckeSDUtils.registerTransform(
//   "tokens-bruecke/typography-css-shorthand"
// );

// APPLY MULIPLE TRANSFORMS
tokensbrueckeSDUtils.registerTransform([
  "tokens-bruecke/blur-css",
  "tokens-bruecke/shadow-css",
  "tokens-bruecke/typography-css"
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
    }
  }
});

// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms();

console.log("\n==============================================");
console.log("\nBuild completed!");

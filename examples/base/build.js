const StyleDictionary = require("style-dictionary");

console.log("Build started...");
console.log("\n==============================================");

// REGISTER THE CUSTOM TRANSFORMS

StyleDictionary.registerTransform({
  name: "dtcg/typography",
  type: "value",
  matcher: ({ type }) => {
    console.log(type);
    return type === "typography";
  },
  transformer: function (prop) {
    return `font-family: ${prop.value};`;
  }
});

StyleDictionary.registerTransformGroup({
  name: "custom-css",
  transforms: ["attribute/cti", "name/cti/kebab", "dtcg/typography"]
});

// APPLY THE CONFIGURATION
const StyleDictionaryExtended = StyleDictionary.extend({
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "custom-css",
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

# TokensBrücke utils for Style Dictionary

This is the repo/package with utils for [Style Dictionary](https://amzn.github.io/style-dictionary). Utils were made for the [TokensBrücke](https://www.figma.com/community/plugin/1254538877056388290) Figma plugin.

<!-- This is the repo with the [Style Dictionary](https://amzn.github.io/style-dictionary) examples for the [TokensBrücke](https://www.figma.com/community/plugin/1254538877056388290) Figma plugin. -->

## Table of contents

- [TokensBrücke utils for Style Dictionary](#tokensbrücke-utils-for-style-dictionary)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Parsers](#parsers)
    - [DTCGParser](#dtcgparser)
    - [compositeParser](#compositeparser)
  - [Transforms](#transforms)
    - [Shadow CSS Transform](#shadow-css-transform)
    - [Blur CSS Transform](#blur-css-transform)
    - [Typography CSS Transform](#typography-css-transform)
    - [Shorthand Typography CSS Transform](#shorthand-typography-css-transform)
  - [Examples](#examples)
    - [Parsers](#parsers-1)
    - [Transforms](#transforms-1)
  - [How to tests in development](#how-to-tests-in-development)
  - [Feedback and requests](#feedback-and-requests)

---

## Installation

```bash
yarn add git+https://github.com/tokens-bruecke/sd-utils.git#package-tag
```

Then you can import the package in your Style Dictionary config:

```js
const tokensbrueckeSDUtils = require("@tokens-bruecke/sd-utils");
```

---

## Parsers

In order to correctly parse the tokens, you need to register the parser first.

### DTCGParser

This parser will transform DTCG tokens into Style Dictionary tokens. It will remove the `$` sign from the token name and remove the metadata.

```js
const StyleDictionary = require("style-dictionary");
const tokensbrueckeSDUtils = require("@tokens-bruecke/sd-utils");

StyleDictionary.registerParser(tokensbrueckeSDUtils.DTCGParser);
```

Then you can use custom transforms to generate values for your platforms.

### compositeParser

This parser will break down tokens with composite values into multiple tokens.
You can use this parser in combination with the other transforms if you don't need to convert your composite tokens into a single-line property (eg. `shadow-css`)

Here is an example for the `typography` token:

```json
"XLarge Desktop": {
  "value": {
    "fontFamily": "Gza",
    "fontWeight": 700,
    "fontSize": "66px",
    "lineHeight": "114%",
    "letterSpacing": "0px"
  },
  "type": "typography",
  "description": "",
  "extensions": {
    "styleId": "S:9990a34fcca6a42f145f80dd9b79ccc7522c27f2,"
  }
}
```

The parser will break it down into multiple tokens:

```css
--typography-x-large-desktop-font-family: Gza;
--typography-x-large-desktop-font-weight: 700;
--typography-x-large-desktop-font-size: 66px;
--typography-x-large-desktop-line-height: 114%;
--typography-x-large-desktop-letter-spacing: 0px;
```

---

You can register the parser with all composite tokens:

```js
const StyleDictionary = require("style-dictionary");
const tokensbrueckeSDUtils = require("@tokens-bruecke/sd-utils");

StyleDictionary.registerParser(tokensbrueckeSDUtils.compositeParser());
```

Or you can register the parser with a specific tokens only:

```js
const StyleDictionary = require("style-dictionary");
const tokensbrueckeSDUtils = require("@tokens-bruecke/sd-utils");

StyleDictionary.registerParser(
  tokensbrueckeSDUtils.compositeParser(["typography", "grid"])
);
```

The parser accepts an array of token types `typography`, `grid`, `shadow` and `blur`.

---

## Transforms

You need first to register the parser and then register the transform group. Then you can use the transform group in the Style Dictionary config.
Find out more examples in the `examples` folder.

In order to use the transforms, you need to register them first with the `registerTransform` function.
The `registerTransform` function could accept a string or an array of strings. The string is the name of the transform:

- `tokens-bruecke/shadow-css`
- `tokens-bruecke/blur-css`
- `tokens-bruecke/typography-css`
- `tokens-bruecke/grid-css`

```js
// REGISTER ONE TRANSFORM
tokensbrueckeSDUtils.registerTransform("tokens-bruecke/blur-css");

// REGISTER MULTIPLE TRANSFORMS
tokensbrueckeSDUtils.registerTransform([
  "tokens-bruecke/blur-css",
  "tokens-bruecke/shadow-css"
]);
```

```js
// IMPORT
const StyleDictionary = require("style-dictionary");
const tokensbrueckeSDUtils = require("@tokens-bruecke/sd-utils");

// REGISTER THE BASIC PARSER
StyleDictionary.registerParser(tokensbrueckeSDUtils.DTCGParser);

// REGISTER A TRANSFORM
tokensbrueckeSDUtils.registerTransform("tokens-bruecke/blur-css");

// APPLY THE TRABSFORM
const StyleDictionaryExtended = StyleDictionary.extend({
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "tokens-bruecke/blur-css", // <-- TRANSFORM GROUP
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
```

### Shadow CSS Transform

```js
tokensbrueckeSDUtils.registerTransform("tokens-bruecke/shadow-css");
```

The `shadow` transform is used to generate [CSS box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) property

```css
/* default */
--effects-shadow-md: 0px 4px 14px 0px #00000040;
/* or with `inset` */
--effects-shadow-sm: inset 0px 4px 4px 0px #00000040;
```

### Blur CSS Transform

```js
tokensbrueckeSDUtils.registerTransform("tokens-bruecke/blur-css");
```

Could be used in [CSS filter](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) property or [backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) property.
The `role` property is skipped in the output, because it's not used in CSS.

```css
--effects-blur-lg: blur(24px);
```

### Typography CSS Transform

This transform will convert the `typography` tokens into CSS variables including its [shorthand property](https://css-tricks.com/snippets/css/font-shorthand/).

```js
tokensbrueckeSDUtils.registerTransform("tokens-bruecke/typography-css");
```

```css
--typography-x-large-desktop: 700 66px/114% "Gza";
--typography-x-large-desktop-font-family: "Gza";
--typography-x-large-desktop-font-weight: 700;
--typography-x-large-desktop-font-size: 66px;
--typography-x-large-desktop-line-height: 114%;
--typography-x-large-desktop-letter-spacing: 0px;
```

### Shorthand Typography CSS Transform

This transform will convert the `typography` tokens into a shorthand CSS variable without other properties.

```js
tokensbrueckeSDUtils.registerTransform(
  "tokens-bruecke/typography-css-shorthand"
);
```

```css
--typography-x-large-desktop: 700 66px/114% "Gza";
```

---

## Examples

You can find examples in the `examples` folder.
In order to run the examples, you need to install the dependencies first:

```bash
yarn
```

then you can run the build command:

```bash
yarn build
```

### Parsers

- [compositeParser](https://github.com/tokens-bruecke/sd-utils/tree/main/examples/parser/composite-parser)
- [DTCGParser](https://github.com/tokens-bruecke/sd-utils/tree/main/examples/parser/dtcg-parser)
- [DTCGParser mixed with custom tranforms](https://github.com/tokens-bruecke/sd-utils/tree/main/examples/parser/mix-composite-parser-and-transforms)

### Transforms

- [all transforms](https://github.com/tokens-bruecke/sd-utils/tree/main/examples/transformers) - all transforms in one example. Just uncomment the transform you want to test.

---

## How to tests in development

The `examples` folder is using yalc to link the local version of the plugin to the examples folder.

1. Install `yalc` package globally: `npm i -g yalc`
2. In the root folder run `yalc publish` to publish the local version of the package
3. Go to a test folder, e.g. `examples/compositeParser`
4. Install the local version of the package: `yalc update`
5. Install other dependencies: `yarn`
6. Run style dictionary build: `yarn build`

You can also replace local version of the package with the published version from npm.

---

## Feedback and requests

If you have any feedback or requests, please [create an issue](https://github.com/tokens-bruecke/sd-utils/issues) in this repo.

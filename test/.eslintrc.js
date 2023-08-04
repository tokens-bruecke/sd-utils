module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: "eslint:recommended",
  overrides: [
    {
      env: {
        node: true
      },
      files: [".eslintrc.{js,cjs}"]
    }
  ],
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true
  },
  rules: {}
};

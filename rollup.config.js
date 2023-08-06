import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import path from "node:path";
import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf-8"));

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id)
});

export default [
  bundle({
    input: "src/index.ts",
    output: {
      format: "cjs",
      file: pkg.main,
      sourcemap: true
    },
    plugins: [typescript({ tsconfig: "./tsconfig.json" })]
  }),
  bundle({
    input: "src/index.ts",
    output: {
      format: "esm",
      file: pkg.module,
      sourcemap: true
    },
    plugins: [typescript({ tsconfig: "./tsconfig.json" })]
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: pkg.types,
      format: "es"
    }
  })
];

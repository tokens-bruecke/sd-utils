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
      file: "./index.d.ts",
      format: "es"
    }
  })
];

// import dts from "rollup-plugin-dts";
// import esbuild from "rollup-plugin-esbuild";

// import packageJson from "./package.json" assert { type: "json" };

// const name = packageJson.main.replace(/\.js$/, "");

// const bundle = (config) => ({
//   ...config,
//   input: "src/index.ts",
//   external: (id) => !/^[./]/.test(id)
// });

// export default [
//   bundle({
//     plugins: [esbuild()],
//     output: [
//       {
//         file: `${name}.js`,
//         format: "cjs",
//         sourcemap: true
//       },
//       {
//         file: `${name}.mjs`,
//         format: "es",
//         sourcemap: true
//       }
//     ]
//   }),
//   bundle({
//     plugins: [dts()],
//     output: {
//       file: `${name}.d.ts`,
//       format: "es"
//     }
//   })
// ];

// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import typescript from "@rollup/plugin-typescript";
// import pkg from "./package.json";

// export default [
//   // browser-friendly UMD build
//   {
//     input: "src/index.ts",
//     output: {
//       name: "myLib",
//       file: pkg.browser,
//       format: "umd"
//     },
//     plugins: [
//       resolve(),
//       commonjs(),
//       typescript({ tsconfig: "./tsconfig.json" })
//     ]
//   },

//   // CommonJS (for Node) and ES module (for bundlers) build.
//   // (We could have three entries in the configuration array
//   // instead of two, but it's quicker to generate multiple
//   // builds from a single configuration where possible, using
//   // an array for the `output` option, where we can specify
//   // `file` and `format` for each target)
//   {
//     input: "src/index.ts",
//     output: [
//       { file: pkg.main, format: "cjs" },
//       { file: pkg.module, format: "es" }
//     ],
//     plugins: [typescript({ tsconfig: "./tsconfig.json" })]
//   }
// ];

import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
// import pkg from "./package.json";

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id)
});

export default [
  bundle({
    input: "src/index.ts",
    output: {
      format: "esm",
      file: "./lib/index.esm.js",
      sourcemap: true
    },
    plugins: [typescript({ tsconfig: "./tsconfig.json" })]
  }),
  bundle({
    input: "src/index.ts",
    output: {
      format: "cjs",
      file: "./lib/index.cjs.js",
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

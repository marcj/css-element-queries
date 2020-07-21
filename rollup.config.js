import commonjs from "@rollup/plugin-commonjs";

/**
 * @typedef { import('rollup').RollupOptions } RollupOptions
 */

/**
 * @type { RollupOptions[] }
 */
const configs = [
  {
    input: "src/ElementQueries.js",
    output: {
      file: "lib/ElementQueries.js",
      format: "esm",
    },
    external: /ResizeSensor/g,
    plugins: [commonjs()],
  },
  {
    input: "src/ResizeSensor.js",
    output: {
      file: "lib/ResizeSensor.js",
      format: "esm",
    },
    plugins: [commonjs()],
  },
];

export default configs;

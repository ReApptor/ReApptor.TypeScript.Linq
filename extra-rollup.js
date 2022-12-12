"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const original = require("@nrwl/react/plugins/bundle-rollup");
//const typescript = require("rollup-plugin-typescript2");
//const tsNameOf = require("ts-nameof");
const postcss = require("rollup-plugin-postcss");

// const tsNameOfTransformer = () => ({
//   before: [tsNameOf],
//   after: []
// });
//const tsNameOfRollupOptions = [() => ({ before: [ tsNameOf ], after: [  ] })];

function getRollupOptions(options) {

  // console.log("--- extra-rollup.js ---");
  // //console.log("--- options: ", options);
  //
  // //options.plugins.push(typescript({ transformers: [nameOfTransformer] }));
  //
  // const typescriptPluginIndex = options.plugins.findIndex(plugin => plugin.name === "rpt2");
  //
  // //plugins[typescriptPluginIndex] = typescriptPlugin;
  //
  // let typescriptPlugin = options.plugins[typescriptPluginIndex];
  //
  // typescriptPlugin.transfomers = [tsNameOfTransformer];
  //
  // typescriptPlugin = typescript(typescriptPlugin);
  //
  // options.plugins[typescriptPluginIndex] = typescriptPlugin;
  //
  // console.log("--- typescriptPlugin: ", typescriptPlugin);
  // //console.log("--- plugins: ", plugins);
  
  const processed = original(options);
  
  const plugins = processed.plugins;

  const postCssPlugin = postcss({
    autoModules: true,
    extract: false,
    modules: {
      generateScopedName: function (name, filename) {
        const path = require("path");
        const file = path.basename(filename);
        const isModule = file.endsWith(".module.scss");

        if (!isModule)
          throw new Error("SCSS module generation failed (postcss.generateScopedName). Supported only *.module.scss files. Check \"rollup.config.js\" file.");

        const className = file.split(".module.scss")[0];

        const kebabCaseClassName = className
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/[\s_]+/g, "-")
            .toLowerCase();

        // The styles prefix is "athenaeum"
        return `athenaeum-${kebabCaseClassName}-${name}`;
      },
    },
  });

  const postcssPluginIndex = plugins.findIndex(plugin => plugin.name === "postcss");

  plugins[postcssPluginIndex] = postCssPlugin;
  
  // tsNameOff:

  //const typescriptPlugin = typescript({ transformers: tsNameOfRollupOptions });

  return processed;
}

module.exports = getRollupOptions;
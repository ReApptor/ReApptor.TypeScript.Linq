"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const original = require("@nrwl/react/plugins/bundle-rollup");
const postcss = require("rollup-plugin-postcss");

function getRollupOptions(options) {
  
  console.log("--- extra-rollup.js ---");
  
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

  return processed;
}

module.exports = getRollupOptions;
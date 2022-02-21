"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const original = require("@nrwl/react/plugins/bundle-rollup");
const postcss = require("rollup-plugin-postcss");

function getRollupOptions(options) {
  let originalProcessed = original(options);

  const postcssPlugin = postcss({
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

  const postcssPluginOldIndex = originalProcessed.plugins.findIndex(x => x.name === 'postcss');

  originalProcessed.plugins[postcssPluginOldIndex] = postcssPlugin;

  return originalProcessed;
}

module.exports = getRollupOptions;

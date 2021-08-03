"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const original = require("@nrwl/react/plugins/bundle-rollup");
const postcss = require("rollup-plugin-postcss");

function getRollupOptions(options) {
  let originalProcessed = original(options);
  console.log(originalProcessed);

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

        return `athenaeum-${kebabCaseClassName}-${name}`;
      },
    },
  });

  const postcssPluginOldIndex = originalProcessed.plugins.findIndex(x => x.name === 'postcss');

  originalProcessed.plugins[postcssPluginOldIndex] = postcssPlugin;

  console.log(originalProcessed);

  return originalProcessed;

  // const extraGlobals = {
  //     react: 'React',
  //     'react-dom': 'ReactDOM',
  //     'styled-components': 'styled',
  //     '@emotion/react': 'emotionReact',
  //     '@emotion/styled': 'emotionStyled',
  // };
  // if (Array.isArray(options.output)) {
  //     options.output.forEach((o) => {
  //         o.globals = Object.assign(Object.assign({}, o.globals), extraGlobals);
  //     });
  // }
  // else {
  //     options.output = Object.assign(Object.assign({}, options.output), { globals: Object.assign(Object.assign({}, options.output.globals), extraGlobals) });
  // }
  // return options;
}
module.exports = getRollupOptions;
//# sourceMappingURL=bundle-rollup.js.map

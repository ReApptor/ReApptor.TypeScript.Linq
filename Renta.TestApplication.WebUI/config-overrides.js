// /* config-overrides.js */
//
// module.exports = function override(config, env) {
//     //do stuff with the webpack config...
//     return config;
// };

/* global require, module, __dirname */
const { override, addWebpackAlias, addBabelPlugins } = require("customize-cra");
const path = require("path");

// module.exports = {
//     // The Webpack config to use when compiling your react app for development or production.
//     webpack: function(config, env) {
//         // ...add your webpack config
//         //
//         for (var i = 0; i < config.module.loaders; i++) {
//             var loader = config.module.loaders[i];
//             if (loader.loader === "babel-loader") {
//                 var plugins = loader.query.plugins;
//                 plugins.push(
//                     "@babel/plugin-proposal-class-properties"
//                 );
//             }
//         }
//         //
//         return config;
//     },
//     // The paths config to use when compiling your react app for development or production.
//     paths: function(paths, env) {
//         // ...add your paths config
//         return paths;
//     }
// };

module.exports = override(
    addWebpackAlias({ ["@weare/athenaeum-react-components"]: path.resolve(__dirname, "src/@weare/athenaeum-react-components/index.ts")}),
    addWebpackAlias({ ["@"]: path.resolve(__dirname, "src")}),
    ...addBabelPlugins("babel-plugin-ts-nameof"),
);

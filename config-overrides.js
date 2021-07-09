const path = require("path");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin").default;
const { override, addBabelPlugins, removeModuleScopePlugin } = require("customize-cra");

const PROJ_DIR = path.resolve(__dirname, process.env.DIR);
console.log("__dirname: ", __dirname);
console.log("DIR: ", process.env.DIR);
console.log("PROJ_DIR: ", PROJ_DIR);
module.exports = {
  webpack: (config) => {
    override(removeModuleScopePlugin(), ...addBabelPlugins("babel-plugin-ts-nameof"))(config);

    // Add support for importing workspace projects.
    config.resolve.plugins.push(
      new TsConfigPathsPlugin({
        configFile: path.resolve(PROJ_DIR, "tsconfig.json"),
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        mainFields: ["module", "main"],
      })
    );

    // Replace include option for babel loader with exclude
    // so babel will handle workspace projects as well.
    config.module.rules.forEach((r) => {
      if (r.oneOf) {
        const babelLoader = r.oneOf.find((rr) => rr.loader.indexOf("babel-loader") !== -1);
        babelLoader.exclude = /node_modules/;
        delete babelLoader.include;
        console.log("babelLoader updated");
      }
    });

    return config;
  },
  paths: (paths, env) => {
    const excludeList = ["dotenv", "appNodeModules", "ownPath", "ownNodeModules", "ownTypeDeclarations", "moduleFileExtensions"];
    Object.keys(paths).forEach((key) => {
      if (excludeList.includes(key)) {
        return;
      }
      if (paths[key].replace) {
        paths[key] = paths[key].replace(__dirname, PROJ_DIR);
      } else {
        console.log(`${key} doesn't have replace function. failed to replace project directory`);
        console.log(paths[key]);
      }
    });

    paths.appIndexJs = path.resolve(PROJ_DIR, "src/index.tsx");
    console.log(paths);
    return paths;
  },
};

const baseConfig = require("../babel.config");

module.exports = {
  ...baseConfig,
  presets: [
    "@babel/preset-react",
    ["@babel/preset-env", { loose: true }],
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    "babel-plugin-ts-nameof",
  ],
};

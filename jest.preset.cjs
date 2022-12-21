const nxPreset = require("@nrwl/jest/preset").default;

module.exports = {
    ...nxPreset,
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    transform: {
        "^.+\\.[tj]sx?$": ["babel-jest", {presets: ["@nrwl/react/babel"]}],
    }
};
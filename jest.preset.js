const nxPreset = require('@nrwl/jest/preset').default;

console.log("--- jest.preset.js ---");

module.exports = { 
    ...nxPreset,
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    transform: {
        "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nrwl/react/babel"] }],
    },
    globals: {
        "ts-jest": {
            astTransformers: ["ts-nameof"]
        },
        "babel-jest": {
            astTransformers: ["ts-nameof"]
        }
    }
};
const nxPreset = require('@nrwl/jest/preset').default;

console.log("--- jest.preset.js ---");

module.exports = { 
    ...nxPreset,
    // transform: {
    //     "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nrwl/react/babel"] }],
    //     "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nrwl/react/plugins/jest",
    // },
    globals: {
        "ts-jest": {
            astTransformers: ["ts-nameof"]
        }
    }
};
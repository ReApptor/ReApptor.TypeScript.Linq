const nxPreset = require('@nrwl/jest/preset').default;

console.log("--- jest.preset.js ---");

module.exports = { 
    ...nxPreset,
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    globals: {
        "ts-jest": {
            astTransformers: ["ts-nameof"]
        }
    }
};
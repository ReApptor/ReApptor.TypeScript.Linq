const nxPreset = require('@nrwl/jest/preset').default;

console.log("--- jest.preset.js ---");

module.exports = { 
    ...nxPreset,
    globals: {
        "ts-jest": {
            astTransformers: ["ts-nameof"]
        }
    }
};
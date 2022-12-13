/* eslint-disable */

console.log("--- jest.config.ts ---");

export default {
  displayName: "WeAre.ReApptor.React.Toolkit",
  preset: "../jest.preset.js",
  coverageDirectory: "../coverage/libs/WeAre.ReApptor.React.Toolkit",
  // TS only (without REACT):
  transform: {
      "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nrwl/react/babel"] }],
  }
};

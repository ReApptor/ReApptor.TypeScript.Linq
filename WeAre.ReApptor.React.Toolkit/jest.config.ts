/* eslint-disable */

console.log("--- jest.config.ts ---");

export default {
  displayName: "WeAre.ReApptor.React.Toolkit",
  preset: "../jest.preset.js",
  // transform: {
  //   "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nrwl/react/babel"] }],
  // },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../coverage/libs/WeAre.ReApptor.React.Toolkit",
};

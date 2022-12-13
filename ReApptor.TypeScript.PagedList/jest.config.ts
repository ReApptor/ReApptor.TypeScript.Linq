/* eslint-disable */

console.log("--- jest.config.ts ---");

export default {
  displayName: "ReApptor.TypeScript.PagedList",
  preset: "../jest.preset.js",
  coverageDirectory: "../coverage/libs/ReApptor.TypeScript.PagedList",
  // TS only (without REACT):
  transform: {
    "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nrwl/react/babel"] }],
  }
};

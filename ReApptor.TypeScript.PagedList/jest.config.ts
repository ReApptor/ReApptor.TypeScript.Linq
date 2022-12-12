/* eslint-disable */
export default {
  displayName: "ReApptor.TypeScript.PagedList",
  preset: "../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../coverage/libs/ReApptor.TypeScript.PagedList",
};

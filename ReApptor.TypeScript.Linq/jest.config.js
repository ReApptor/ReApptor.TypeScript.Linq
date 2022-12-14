module.exports = {
  displayName: "ReApptor.TypeScript.Linq",
  preset: "../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../coverage/libs/ReApptor.TypeScript.Linq"
};

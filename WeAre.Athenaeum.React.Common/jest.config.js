module.exports = {
  globals: {
    "ts-jest": {
      astTransformers: {
        before: ["ts-nameof"],
      },
    },
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test))\\.tsx?$",
  testPathIgnorePatterns: [],
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  projects: ["<rootDir>/src"],
  moduleNameMapper: {
    "@weare/athenaeum-toolkit": "<rootDir>/../WeAre.Athenaeum.React.Toolkit/src/index.ts",
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|less|scss)$": "identity-obj-proxy",
  },
};

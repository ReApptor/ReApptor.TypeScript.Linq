module.exports = {
    globals: {
        "ts-jest": {
            "astTransformers": {
                before: ["ts-nameof"]
            }
        }
    },
    roots: [
        '<rootDir>/WeAre.Athenaeum.React.Components/src',
        '<rootDir>/WeAre.Athenaeum.React.Common/src',
        '<rootDir>/WeAre.Athenaeum.React.Toolkit/src'
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    moduleNameMapper: {
        "@weare/athenaeum-toolkit": "<rootDir>/WeAre.Athenaeum.React.Toolkit/src/index.ts",
        "@weare/athenaeum-react-common": "<rootDir>/WeAre.Athenaeum.React.Common/src/index.ts",
    }
}
module.exports = {
    globals: {
        "ts-jest": {
            "astTransformers": {
                before: ["ts-nameof"]
            }
        }
    },
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
}
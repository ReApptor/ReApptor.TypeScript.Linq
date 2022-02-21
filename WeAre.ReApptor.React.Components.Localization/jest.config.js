module.exports = {
    displayName: 'WeAre.ReApptor.React.Components',
    preset: '../jest.preset.js',
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../coverage/libs/WeAre.ReApptor.React.Components.Localization'
};

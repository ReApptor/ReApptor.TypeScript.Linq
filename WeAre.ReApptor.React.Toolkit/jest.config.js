module.exports = {
  displayName: 'WeAre.ReApptor.React.Toolkit',
  preset: '../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../coverage/libs/WeAre.ReApptor.React.Toolkit',
};

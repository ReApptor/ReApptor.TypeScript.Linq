module.exports = {
  displayName: 'WeAre.Athenaeum.React.Toolkit',
  preset: '../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../coverage/libs/WeAre.Athenaeum.React.Toolkit',
};

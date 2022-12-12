/* eslint-disable */
export default {
  displayName: 'WeAre.ReApptor.React.Common',
  preset: '../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../coverage/libs/WeAre.ReApptor.React.Common',
};

const { join } = require('path');

module.exports = {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
    '^.+\\.css$': join(__dirname, 'jest-css-transform.js'),
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/frontend',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(@ionic/react|@ionic/react-router|@ionic/core|@stencil/core|ionicons)/)',
  ],
  moduleNameMapper: {
    '^@ionic/react$': '<rootDir>/../../node_modules/@ionic/react/dist/index.js',
  },
};
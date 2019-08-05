module.exports = {
  displayName: '@yarks/cli',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [
          // TODO(#51): remove when ts-jest correctly picks up @types modules
          2304,
          2307,
          2593,
          2688,
        ],
      },
      packageJson: '<rootDir>/package.json',
      tsConfig: '<rootDir>/tsconfig.jest.json',
    },
  },
};

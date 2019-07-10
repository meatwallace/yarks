module.exports = {
  // ...require('@meatwallace/jest-config-typescript'),
  transform: {
    '.ts': require.resolve('ts-jest/dist'),
  },
  moduleFileExtensions: ['js', 'ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
};

module.exports = {
  // ...require('@meatwallace/jest-config-typescript'),
  collectCoverageFrom: ['packages/**/*.ts'],
  moduleFileExtensions: ['js', 'ts'],
  projects: ['packages/*'],
  testMatch: [],
  // testMatch: ['<rootDir>/packages/**/*.test.ts'],
  transform: {
    '.ts': require.resolve('ts-jest/dist'),
  },
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
};

module.exports = {
  // ...require('@meatwallace/jest-config-typescript'),
  collectCoverageFrom: ['packages/**/*.ts'],
  moduleFileExtensions: ['js', 'ts'],
  projects: ['packages/*'],
  testMatch: [],
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
};

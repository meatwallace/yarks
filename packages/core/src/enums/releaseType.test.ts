import { RELEASE_TYPE } from './releaseType';

test('it contains the expected values', () => {
  expect.assertions(1);

  expect(RELEASE_TYPE).toMatchInlineSnapshot(`
    Object {
      "MAJOR": "major",
      "MINOR": "minor",
      "PATCH": "patch",
      "PREMAJOR": "premajor",
      "PREMINOR": "preminor",
      "PREPATCH": "prepatch",
      "PRERELEASE": "prerelease",
    }
  `);
});

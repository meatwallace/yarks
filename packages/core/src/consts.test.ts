import * as consts from './consts';

test('they represent the expected values', () => {
  expect.assertions(1);

  expect(consts).toMatchInlineSnapshot(`
    Object {
      "HIGHEST_RELEASE_TYPE": "major",
      "RELEASE_TYPES": Array [
        "major",
        "minor",
        "patch",
        "premajor",
        "preminor",
        "prepatch",
        "prerelease",
      ],
    }
  `);
});

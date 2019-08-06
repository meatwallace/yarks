import { RELEASE_TYPE } from './enums/releaseType';
import { isGreaterReleaseType } from './isGreaterReleaseType';

test('it returns a boolean indicating if the proposed type is greater than the current', () => {
  expect.assertions(18);

  type TestCase = [RELEASE_TYPE, RELEASE_TYPE, boolean];

  let iterations: Array<TestCase> = [
    // standard releases
    [RELEASE_TYPE.MAJOR, RELEASE_TYPE.MAJOR, false],
    [RELEASE_TYPE.MAJOR, RELEASE_TYPE.MINOR, false],
    [RELEASE_TYPE.MAJOR, RELEASE_TYPE.PATCH, false],
    [RELEASE_TYPE.MINOR, RELEASE_TYPE.MAJOR, true],
    [RELEASE_TYPE.MINOR, RELEASE_TYPE.MINOR, false],
    [RELEASE_TYPE.MINOR, RELEASE_TYPE.PATCH, false],
    [RELEASE_TYPE.PATCH, RELEASE_TYPE.MAJOR, true],
    [RELEASE_TYPE.PATCH, RELEASE_TYPE.MINOR, true],
    [RELEASE_TYPE.PATCH, RELEASE_TYPE.PATCH, false],

    // pre-releases
    [RELEASE_TYPE.PREMAJOR, RELEASE_TYPE.PREMAJOR, false],
    [RELEASE_TYPE.PREMAJOR, RELEASE_TYPE.PREMINOR, false],
    [RELEASE_TYPE.PREMAJOR, RELEASE_TYPE.PREPATCH, false],
    [RELEASE_TYPE.PREMINOR, RELEASE_TYPE.PREMAJOR, true],
    [RELEASE_TYPE.PREMINOR, RELEASE_TYPE.PREMINOR, false],
    [RELEASE_TYPE.PREMINOR, RELEASE_TYPE.PREPATCH, false],
    [RELEASE_TYPE.PREPATCH, RELEASE_TYPE.PREMAJOR, true],
    [RELEASE_TYPE.PREPATCH, RELEASE_TYPE.PREMINOR, true],
    [RELEASE_TYPE.PREPATCH, RELEASE_TYPE.PREPATCH, false],
  ];

  iterations.forEach(([current, proposed, expected]) => {
    expect(isGreaterReleaseType(current, proposed)).toBe(expected);
  });
});

test('it returns true if the current release type is null', () => {
  expect.assertions(1);

  let result = isGreaterReleaseType(null, RELEASE_TYPE.MAJOR);

  expect(result).toBe(true);
});

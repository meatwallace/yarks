import { RELEASE_TYPE } from './enums/releaseType';
import { getNextVersion } from './getNextVersion';

const version = '1.0.0';

test('it increments the given version correctly given a valid semver release type', () => {
  expect(getNextVersion(version, RELEASE_TYPE.MAJOR)).toBe('2.0.0');
  expect(getNextVersion(version, RELEASE_TYPE.MINOR)).toBe('1.1.0');
  expect(getNextVersion(version, RELEASE_TYPE.PATCH)).toBe('1.0.1');
  expect(getNextVersion(version, RELEASE_TYPE.PREMAJOR)).toBe('2.0.0-0');
  expect(getNextVersion(version, RELEASE_TYPE.PREMINOR)).toBe('1.1.0-0');
  expect(getNextVersion(version, RELEASE_TYPE.PREPATCH)).toBe('1.0.1-0');
  expect(getNextVersion(version, RELEASE_TYPE.PRERELEASE)).toBe('1.0.1-0');
});

test('it returns null if not provided a release type', () => {
  expect(getNextVersion(version, null)).toBe(null);
});

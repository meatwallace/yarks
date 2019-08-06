import { RELEASE_TYPE } from './enums/releaseType';
import { createMockCommit } from './test-helpers/createMockCommit';
import { getNextReleaseType } from './getNextReleaseType';

test('it returns the greatest release type a series of commits should trigger', () => {
  expect.assertions(1);

  let commits = [
    createMockCommit({ type: 'fix', notes: [{ title: 'BREAKING CHANGE' }] }),
    createMockCommit({ type: 'refactor' }),
    createMockCommit({ type: 'feat' }),
    createMockCommit({ type: 'fix' }),
  ];

  let result = getNextReleaseType(commits);

  expect(result).toBe(RELEASE_TYPE.MAJOR);
});

test('it returns the correct result regardless of the order of the commits', () => {
  expect.assertions(1);

  let commits = [
    createMockCommit({ type: 'feat' }),
    createMockCommit({ type: 'fix', notes: [{ title: 'BREAKING CHANGE' }] }),
    createMockCommit({ type: 'fix' }),
    createMockCommit({ type: 'refactor' }),
  ];

  let result = getNextReleaseType(commits);

  expect(result).toBe(RELEASE_TYPE.MAJOR);
});

test('it returns null if no commits should trigger a release', () => {
  expect.assertions(1);

  let commits = [
    createMockCommit({ type: 'refactor' }),
    createMockCommit({ type: 'chore' }),
  ];

  let result = getNextReleaseType(commits);

  expect(result).toBeNull();
});

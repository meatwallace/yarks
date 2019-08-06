import { createMockCommit } from './test-helpers/createMockCommit';
import { RELEASE_TYPE } from './enums/releaseType';
import { getCommitReleaseType } from './getCommitReleaseType';

test('it returns a major release if the commit contains a breaking change', () => {
  expect.assertions(1);

  let commit = createMockCommit({ notes: [{ title: 'BREAKING CHANGE' }] });

  let result = getCommitReleaseType(commit);

  expect(result).toBe(RELEASE_TYPE.MAJOR);
});

test('it returns a patch release if the commit contains a revert', () => {
  expect.assertions(1);

  let commit = createMockCommit({
    revert: [{ hash: 'xxxxxxx', message: 'reverted' }],
  });

  let result = getCommitReleaseType(commit);

  expect(result).toBe(RELEASE_TYPE.PATCH);
});

test('it returns a minor release if the commit adds features', () => {
  expect.assertions(1);

  let commit = createMockCommit({ type: 'feat' });

  let result = getCommitReleaseType(commit);

  expect(result).toBe(RELEASE_TYPE.MINOR);
});

test('it returns a patch release if the commit fixes a bug or effects performance', () => {
  expect.assertions(2);

  let commits = [
    createMockCommit({ type: 'perf' }),
    createMockCommit({ type: 'fix' }),
  ];

  commits.forEach((commit) => {
    let result = getCommitReleaseType(commit);

    expect(result).toBe(RELEASE_TYPE.PATCH);
  });
});

test('it returns null if the commit is of any other type', () => {
  expect.assertions(1);

  let commit = createMockCommit({ type: 'refactor' });

  let result = getCommitReleaseType(commit);

  expect(result).toBeNull();
});

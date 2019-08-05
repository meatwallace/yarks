import { isBreakingChange } from './isBreakingChange';
import { createMockCommit } from './test-helpers/createMockCommit';

test('it returns true if the commit includes a BREAKING note', () => {
  let commit = createMockCommit({ notes: [{ title: 'BREAKING CHANGE' }] });
  let result = isBreakingChange(commit);

  expect(result).toBe(true);
});

test('it returns false if the commit does not include a BREAKING note', () => {
  let commit = createMockCommit();
  let result = isBreakingChange(commit);

  expect(result).toBe(false);
});

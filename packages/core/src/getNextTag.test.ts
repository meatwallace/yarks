import { getNextTag } from './getNextTag';

test('it appends the version to the workspace name in the expected format', () => {
  expect.assertions(1);
  let tag = getNextTag('example', '1.0.0');

  expect(tag).toBe('example@v1.0.0');
});

test('it returns null if not passed a version string', () => {
  expect.assertions(1);

  let tag = getNextTag('example', null);

  expect(tag).toBeNull();
});

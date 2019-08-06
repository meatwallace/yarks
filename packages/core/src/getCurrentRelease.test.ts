import { getCurrentRelease } from './getCurrentRelease';

let tags = [
  '@example/foo@v1.0.0',
  '@example/bar@v1.0.0',
  '@example/foo@v1.1.0',
  '@example/bar@v1.0.1',
  '@example/bar@v1.0.2',
  '@example/foo@v1.1.1',
  '@example/foo@v2.0.0',
  '@example/bar@v1.1.0',
];

test('it returns the last provided tag for the given workspace', () => {
  expect.assertions(2);

  expect(getCurrentRelease('@example/foo', tags)).toBe('@example/foo@v2.0.0');
  expect(getCurrentRelease('@example/bar', tags)).toBe('@example/bar@v1.1.0');
});

test('it returns null if no tag matches the given workspace', () => {
  expect.assertions(1);

  expect(getCurrentRelease('@example/baz', tags)).toBeNull();
});

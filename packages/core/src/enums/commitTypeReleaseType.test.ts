import { COMMIT_TYPE_RELEASE_TYPE } from './commitTypeReleaseType';

test('it contains the expected values', () => {
  expect.assertions(1);

  expect(COMMIT_TYPE_RELEASE_TYPE).toMatchInlineSnapshot(`
    Object {
      "FEAT": "feat",
      "FIX": "fix",
      "PERF": "perf",
    }
  `);
});

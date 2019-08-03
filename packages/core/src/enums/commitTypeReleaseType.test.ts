import { COMMIT_TYPE_RELEASE_TYPE } from './commitTypeReleaseType';

test('it contains the expected values', () => {
  expect(COMMIT_TYPE_RELEASE_TYPE).toMatchInlineSnapshot(`
    Object {
      "feat": "minor",
      "fix": "patch",
      "perf": "patch",
    }
  `);
});

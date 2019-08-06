import { getAuthToken } from './getAuthToken';
import { writeYamlFile } from './writeYamlFile';

jest.mock('fs', () => new (require('metro-memory-fs'))());

function setupTest() {
  require('fs').reset();
}

const path = '/.yarnrc.yml';
const registry = 'https://example.registry';
const token = 'super-secret-token';

test('it returns the token for the provided registry if found in the yarn config', async () => {
  expect.assertions(1);
  setupTest();

  let data = {
    npmRegistries: {
      [registry]: {
        npmAuthToken: token,
      },
    },
  };

  await writeYamlFile(path, data);

  let result = await getAuthToken(path, registry);

  expect(result).toBe(token);
});

test('it returns null if no token is set for the provided registry', async () => {
  expect.assertions(1);
  setupTest();

  await writeYamlFile(path, {});

  let result = await getAuthToken(path, registry);

  expect(result).toBeNull();
});

import { oc } from 'ts-optchain';
import { addAuthToken } from './addAuthToken';
import { parseYamlFile } from './parseYamlFile';
import { writeYamlFile } from './writeYamlFile';
import { YarnConfig } from './types';

jest.mock('fs', () => new (require('metro-memory-fs'))());

function setupTest() {
  require('fs').reset();
}

const configPath = '/.yarnrc.yml';
const registry = 'https://mock.registry.com';
const token = 'super-secret-token';

test(`it adds the given auth token to the yarn npm registries' config for the expected registry`, async () => {
  expect.assertions(1);
  setupTest();

  await addAuthToken(configPath, registry, token);

  let config = await parseYamlFile<Partial<YarnConfig>>(configPath);

  expect(oc(config).npmRegistries[registry].npmAuthToken()).toBe(token);
});

test('it overwrites the existing token if the registry is already configured', async () => {
  expect.assertions(1);
  setupTest();

  const newToken = 'another-super-secret-token';

  await addAuthToken(configPath, registry, token);
  await addAuthToken(configPath, registry, newToken);

  let config = await parseYamlFile<Partial<YarnConfig>>(configPath);

  expect(oc(config).npmRegistries[registry].npmAuthToken()).toBe(newToken);
});

test('it retains existing configuration', async () => {
  expect.assertions(1);
  setupTest();

  let existingConfig = {
    npmPublishAccess: 'public',
    npmRegistries: {
      'https://mock.registry.com': {
        npmAuthToken: 'super-secret-token',
      },
    },
  };

  await writeYamlFile(configPath, existingConfig);
  await addAuthToken(configPath, registry, token);

  let config = await parseYamlFile<Partial<YarnConfig>>(configPath);

  expect(config).toStrictEqual({
    ...existingConfig,
    npmRegistries: {
      ...existingConfig.npmRegistries,
      [registry]: {
        npmAuthToken: token,
      },
    },
  });
});

import { promises as fs } from 'fs';
import { oc } from 'ts-optchain';
import { configureRegistryAuth } from './configureRegistryAuth';
import { parseYamlFile } from './parseYamlFile';
import { writeYamlFile } from './writeYamlFile';
import { YarnConfig } from './types';

jest.mock('fs', () => new (require('metro-memory-fs'))());

function setupTest() {
  require('fs').reset();
}

const path = '/.yarnrc.yml';
const registry = 'https://mock.registry.com';
const token = 'super-secret-token';

test('it adds the provided token to the registry map in the provided file if not found', async () => {
  expect.assertions(1);
  setupTest();

  await writeYamlFile(path, {});

  await configureRegistryAuth(path, registry, token);

  let result = await parseYamlFile<Partial<YarnConfig>>(path);

  expect(oc(result).npmRegistries[registry].npmAuthToken()).toBe(token);
});

test('it skips writing the token if it is already set', async () => {
  expect.assertions(1);
  setupTest();

  // as metro-memory-fs' `stat` function returns dummy data we can't compare
  // file metadata, so we'll spy on implementation details in this case
  let spy = jest.spyOn(fs, 'writeFile');

  await configureRegistryAuth(path, registry, token);
  await configureRegistryAuth(path, registry, token);

  expect(spy).toHaveBeenCalledTimes(1);

  spy.mockRestore();
});

import { promises as fs } from 'fs';
import { parseYamlFile } from './parseYamlFile';
import { writeYamlFile } from './writeYamlFile';

jest.mock('fs', () => new (require('metro-memory-fs'))());

function setupTest() {
  require('fs').reset();
}

const path = '/example.yml';
const data = { property: 'value' };

test('it can read a valid yaml file', async () => {
  expect.assertions(1);
  setupTest();

  await writeYamlFile(path, data);

  let result = await parseYamlFile(path);

  expect(data).toStrictEqual(result);
});

test('it throws an error if the file cannot be parsed', async () => {
  expect.assertions(1);
  setupTest();

  await fs.writeFile(path, 'this:\nparser:\nis:\forgiving');

  await expect(parseYamlFile(path)).rejects.toThrowError();
});

test(`it throws an error if the file doesn't exist`, async () => {
  expect.assertions(1);
  setupTest();

  await expect(parseYamlFile(path)).rejects.toThrowError();
});

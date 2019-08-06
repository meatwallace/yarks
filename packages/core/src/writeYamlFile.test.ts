import { promises as fs } from 'fs';
import { parseYamlFile } from './parseYamlFile';
import { writeYamlFile } from './writeYamlFile';

jest.mock('fs', () => new (require('metro-memory-fs'))());

function setupTest() {
  require('fs').reset();
}

const path = '/example.yml';
const data = {
  string: 'value',
  array: ['v', 'a', 'l', 'u', 'e', 's'],
  boolean: true,
  number: 99,
  object: {
    property: 'value',
  },
};

test('it writes the data to a file in the expected YAML format', async () => {
  expect.assertions(1);
  setupTest();

  await writeYamlFile(path, data);

  let yamlString = await fs.readFile(path, 'utf8');

  expect(yamlString).toMatchInlineSnapshot(`
    "string: value
    array:
      - v
      - a
      - l
      - u
      - e
      - s
    boolean: true
    number: 99
    object:
      property: value
    "
  `);
});

test('it writes valid YAML data that can be parsed back to the original data', async () => {
  expect.assertions(1);
  setupTest();

  await writeYamlFile(path, data);

  let result = await parseYamlFile(path);

  expect(data).toStrictEqual(result);
});

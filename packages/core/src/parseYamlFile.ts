import { promises as fs } from 'fs';
import yaml from 'yaml';

export async function parseYamlFile<Data extends Object>(
  path: string,
): Promise<Data> {
  let data = await fs.readFile(path, 'utf8');

  return yaml.parse(data);
}

import { promises as fs } from 'fs';
import yaml from 'yaml';

export async function writeYamlFile(path: string, data: Object): Promise<void> {
  let yamlString = yaml.stringify(data);

  await fs.writeFile(path, yamlString);
}

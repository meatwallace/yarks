import { promises as fs } from 'fs';
import yaml from 'yaml';

export async function getAuthToken(
  configPath: string,
  registry: string,
): Promise<string | null> {
  try {
    let configString = await fs.readFile(configPath, 'utf8');
    let config = yaml.parse(configString);
    let token = config.npmRegistries[registry].npmAuthToken;

    return token;
  } catch (error) {
    return null;
  }
}

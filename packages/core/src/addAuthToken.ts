import { promises as fs } from 'fs';
import merge from 'deepmerge';
import yaml from 'yaml';

export async function addAuthToken(
  configPath: string,
  registry: string,
  token: string,
): Promise<void> {
  let registryConfig = {
    npmRegistries: {
      [registry]: {
        npmAuthToken: token,
      },
    },
  };

  try {
    let configString = await fs.readFile(configPath, 'utf8');

    // if we have a preexisting root config, merge our new auth options with it
    registryConfig = merge(yaml.parse(configString), registryConfig);
  } catch (error) {}

  await fs.writeFile(configPath, yaml.stringify(registryConfig));
}

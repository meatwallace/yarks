import merge from 'deepmerge';
import { parseYamlFile } from './parseYamlFile';
import { writeYamlFile } from './writeYamlFile';

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
    // if we have a preexisting root config, merge our new auth options with it
    let existingConfig = await parseYamlFile(configPath);

    registryConfig = merge(existingConfig, registryConfig);
  } catch {}

  await writeYamlFile(configPath, registryConfig);
}

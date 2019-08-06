import { oc } from 'ts-optchain';
import { parseYamlFile } from './parseYamlFile';
import { YarnConfig } from './types';

export async function getAuthToken(
  configPath: string,
  registry: string,
): Promise<string | null> {
  let token = null;

  try {
    let config = await parseYamlFile<Partial<YarnConfig>>(configPath);

    token = oc(config).npmRegistries[registry].npmAuthToken() || null;
  } catch {}

  return token;
}

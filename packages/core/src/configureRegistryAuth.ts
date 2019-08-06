import { addAuthToken } from './addAuthToken';
import { getAuthToken } from './getAuthToken';

export async function configureRegistryAuth(
  configPath: string,
  registry: string,
  token: string,
): Promise<void> {
  let existingToken = await getAuthToken(configPath, registry);

  // if we've already written this token, exit early to avoid disk io
  if (existingToken === token) {
    return;
  }

  await addAuthToken(configPath, registry, token);
}

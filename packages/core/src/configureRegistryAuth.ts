import * as path from 'path';
import * as os from 'os';
import { addAuthToken } from './addAuthToken';
import { getAuthToken } from './getAuthToken';

export async function configureRegistryAuth(releaseContext, options, env) {
  let configPath = path.resolve(os.homedir(), '.yarnrc.yml');

  // TODO(#21): replace hardcoded registry with default from yarn config
  let registry = 'https://registry.yarnpkg.com';

  // TODO(#4): iterate over packages and authenticate against relevant registry
  let token = await getAuthToken(configPath, registry);

  if (token) {
    return;
  }

  await addAuthToken(configPath, registry, env.NPM_TOKEN);
}

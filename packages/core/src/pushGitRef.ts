import { PushResponse } from 'isomorphic-git';
import { Environment, Options } from './types';

export async function pushGitRef(
  ref: string,
  options: Options,
  env: Environment,
): Promise<PushResponse> {
  let result = await options.git.push({
    dir: options.cwd,
    ref,
    token: env.GITHUB_TOKEN,
    // TODO(#26): accomodate other git hosts and other repository URL formats
    url: options.repositoryURL,
  });

  return result;
}

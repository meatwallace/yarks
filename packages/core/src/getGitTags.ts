import { Options } from './types';

export async function getGitTags(options: Options): Promise<Array<string>> {
  let tags = await options.git.tags({ cwd: options.cwd });

  return tags;
}

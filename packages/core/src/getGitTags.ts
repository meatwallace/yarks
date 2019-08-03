import { Tag } from './types';

export async function getGitTags(options): Promise<Array<Tag>> {
  let tags = await options.git.listTags({ dir: options.cwd });

  return tags;
}

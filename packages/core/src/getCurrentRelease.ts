import { Tag } from './types';

export function getCurrentRelease(
  workspaceName: string,
  tags: Array<Tag>,
): Tag | null {
  let lastRelease = tags.filter((tag) => tag.startsWith(workspaceName)).pop();

  return lastRelease || null;
}

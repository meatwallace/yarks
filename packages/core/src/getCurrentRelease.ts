import { Tag, Workspace } from './types';

export function getCurrentRelease(
  workspace: Workspace,
  tags: Array<Tag>,
): Tag | null {
  let lastRelease = tags.filter((tag) => tag.startsWith(workspace.name)).pop();

  return lastRelease || null;
}

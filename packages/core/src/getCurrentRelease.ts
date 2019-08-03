import { Tag, Workspace } from './types';

export function getCurrentRelease(
  workspace: Workspace,
  tags: Array<Tag>,
  options,
): Tag {
  let lastRelease = tags.filter((tag) => tag.startsWith(workspace.name)).pop();

  return lastRelease;
}

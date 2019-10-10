export function getCurrentRelease(
  workspaceName: string,
  tags: Array<string>,
): string | null {
  let lastRelease = tags.filter((tag) => tag.startsWith(workspaceName)).pop();

  return lastRelease || null;
}

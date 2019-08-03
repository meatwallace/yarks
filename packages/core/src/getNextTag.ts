export function getNextTag(
  workspaceName: string,
  nextVersion: string | null,
): string | null {
  if (!nextVersion) {
    return null;
  }

  return `${workspaceName}@v${nextVersion}`;
}

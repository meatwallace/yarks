import semver, { ReleaseType } from 'semver';

export function getNextVersion(
  currentVersion: string,
  nextRelease: ReleaseType | null,
): string | null {
  if (!nextRelease) {
    return null;
  }

  return semver.inc(currentVersion, nextRelease);
}

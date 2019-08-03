import { RELEASE_TYPE } from './enums/releaseType';
import { HIGHEST_RELEASE_TYPE } from './consts';
import { getCommitReleaseType } from './getCommitReleaseType';
import { isGreaterReleaseType } from './isGreaterReleaseType';

export function getNextReleaseType(commits): RELEASE_TYPE | null {
  let nextRelease = null;

  commits.every((commit) => {
    let commitReleaseType = getCommitReleaseType(commit);

    // if we don't need a release for this commit, bail out early
    if (!commitReleaseType) {
      return true;
    }

    // if we haven't set a release type previously or this commit reequires
    // a greater release, update our pending release type
    if (isGreaterReleaseType(nextRelease, commitReleaseType)) {
      nextRelease = commitReleaseType;
    }

    // break the loop if we're already at the highest release type
    if (nextRelease === HIGHEST_RELEASE_TYPE) {
      return false;
    }

    return true;
  });

  return nextRelease;
}

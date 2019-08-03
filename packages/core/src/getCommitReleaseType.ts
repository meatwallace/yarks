import { COMMIT_TYPE_RELEASE_TYPE } from './enums/commitTypeReleaseType';
import { RELEASE_TYPE } from './enums/releaseType';
import { isBreakingChange } from './isBreakingChange';

export function getCommitReleaseType(commit) {
  if (isBreakingChange(commit)) {
    return RELEASE_TYPE.MAJOR;
  }

  if (commit.revert) {
    return RELEASE_TYPE.PATCH;
  }

  return COMMIT_TYPE_RELEASE_TYPE[commit.type];
}

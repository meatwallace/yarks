import { Commit } from 'conventional-commits-parser';
import { $enum } from 'ts-enum-util';
import { COMMIT_TYPE_RELEASE_TYPE } from './enums/commitTypeReleaseType';
import { RELEASE_TYPE } from './enums/releaseType';
import { isBreakingChange } from './isBreakingChange';

export function getCommitReleaseType(commit: Commit): RELEASE_TYPE | null {
  if (isBreakingChange(commit)) {
    return RELEASE_TYPE.MAJOR;
  }

  if (commit.revert) {
    return RELEASE_TYPE.PATCH;
  }

  let releaseType = $enum.mapValue(commit.type).with({
    [COMMIT_TYPE_RELEASE_TYPE.FEAT]: RELEASE_TYPE.MINOR,
    [COMMIT_TYPE_RELEASE_TYPE.FIX]: RELEASE_TYPE.PATCH,
    [COMMIT_TYPE_RELEASE_TYPE.PERF]: RELEASE_TYPE.PATCH,
    [$enum.handleUnexpected]: null,
  });

  return releaseType;
}

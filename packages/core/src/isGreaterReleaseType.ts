import { RELEASE_TYPE } from './enums/releaseType';
import { RELEASE_TYPES } from './consts';

export function isGreaterReleaseType(
  current: RELEASE_TYPE | null,
  proposed: RELEASE_TYPE | null,
): boolean {
  if (current === null) {
    return true;
  }

  return RELEASE_TYPES.indexOf(current) > RELEASE_TYPES.indexOf(proposed);
}

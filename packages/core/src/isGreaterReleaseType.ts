import { RELEASE_TYPE } from './enums/releaseType';
import { RELEASE_TYPES } from './consts';

export function isGreaterReleaseType(
  currentType: RELEASE_TYPE | null,
  type: RELEASE_TYPE | null,
): boolean {
  return RELEASE_TYPES.indexOf(type) > RELEASE_TYPES.indexOf(currentType);
}

import { RELEASE_TYPES } from './consts';

export function isGreaterReleaseType(currentType, type): boolean {
  return RELEASE_TYPES.indexOf(type) > RELEASE_TYPES.indexOf(currentType);
}

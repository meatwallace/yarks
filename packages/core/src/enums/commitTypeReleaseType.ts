import { RELEASE_TYPE } from './releaseType';

export enum COMMIT_TYPE_RELEASE_TYPE {
  feat = RELEASE_TYPE.MINOR,
  fix = RELEASE_TYPE.PATCH,
  perf = RELEASE_TYPE.PATCH,
}

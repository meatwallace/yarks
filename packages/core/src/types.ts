import { RELEASE_TYPE } from './enums/releaseType';

export type Commit = any;

export type Tag = string;

export type WorkspaceManifest = any;

export type Workspace = {
  commits: Array<Commit>;
  currentRelease: string;
  currentVersion: string;
  dependencies: Array<string>;
  location: string;
  manifest: WorkspaceManifest;
  name: string;
  path: string;
  nextRelease: RELEASE_TYPE | null;
  nextTag: string | null;
  nextVersion: string | null;
  releaseNotes: string;
};

export type ReleaseContext = {
  [workspaceName: string]: Workspace;
};

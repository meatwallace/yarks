import { Commit } from 'conventional-changelog-parser';
import { Options as PrettierConfig } from 'prettier';
import { PackageJson } from 'type-fest';
import { RELEASE_TYPE } from './enums/releaseType';

export type Environment = {
  GITHUB_TOKEN: string;
  NPM_TOKEN: string;
  GIT_AUTHOR_EMAIL: string;
  GIT_AUTHOR_NAME: string;
};

export type Options = {
  changelogConfig: any;
  cwd: string;
  git: any;
  prettierConfig: PrettierConfig;
  repositoryURL: string;
};

export type Tag = string;

export type Workspace = {
  location: string;
  mismatchedWorkspaceDependencies: Array<string>;
  name: string;
  workspaceDependencies: Array<string>;
};

export type WorkspaceManifest = PackageJson;

export type WorkspaceReleaseContext = Workspace & {
  commits: Array<Commit>;
  currentRelease: string | null;
  currentVersion: string;
  manifest: WorkspaceManifest;
  path: string;
  nextRelease: RELEASE_TYPE | null;
  nextTag: string | null;
  nextVersion: string | null;
  releaseNotes: string;
};

export type ReleaseContext = {
  [workspaceName: string]: WorkspaceReleaseContext;
};

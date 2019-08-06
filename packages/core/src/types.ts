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

export type YarnConfig = {
  // @berry/core
  bstatePath: string;
  cacheFolder: string;
  checksumBehaviour: string;
  defaultLanguageName: string;
  defaultProtocol: string;
  enableAbsoluteVirtuals: boolean;
  enableColors: boolean;
  enableGlobalCache: boolean;
  enableInlineBuilds: boolean;
  enableNetwork: boolean;
  enableScripts: boolean;
  enableTimers: boolean;
  frozenInstalls: boolean;
  globalFolder: string;
  httpProxy: string | null;
  httpsProxy: string | null;
  initLicense: string;
  initScope: string;
  initVersion: string;
  lastUpdateCheck: string | null;
  lockfileFilename: string;
  ignorePath: boolean;
  preferInteractive: boolean;
  rcFilename: string;
  virtualFolder: string;
  yarnPath: string | null;

  // @berry/plugin-npm
  npmAlwaysAuth: boolean;
  npmAuthIdent: string | null;
  npmAuthToken: string | null;
  npmPublishAccess: string;
  npmPublishRegistry: string | null;
  npmRegistries: {
    [registry: string]: {
      npmAlwaysAuth: boolean;
      npmAuthToken: string;
      npmAuthIdent: string | null;
    };
  };
  npmRegistryServer: string;
  npmScopes: {
    [scope: string]: {
      npmPublishRegistry: string | null;
      npmRegistryServer: string;
    };
  };

  // @berry/plugin-pnp
  pnpDataPath: string;
  pnpEnableInlining: boolean;
  pnpFallbackMode: 'off' | 'dependencies-only' | 'all';
  pnpIgnorePattern: string | null;
  pnpPath: string;
  pnpShebang: string;
  pnpUnpluggedFolder: string;
};

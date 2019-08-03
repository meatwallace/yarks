import * as fs from 'fs';
import * as git from 'isomorphic-git';
import conventionalChangelogAngular from 'conventional-changelog-angular';
import prettier from 'prettier';
import { getWorkspaceManifest, releaseWorkspaces } from '@yarks/core';
import { getManifestRepositoryURL } from './getManifestRepositoryURL';

export async function executeCLI() {
  git.plugins.set('fs', fs);

  let changelogConfig = await conventionalChangelogAngular;
  let cwd = process.cwd();
  let prettierConfig = await prettier.resolveConfig(cwd);
  let manifest = await getWorkspaceManifest(cwd);
  let repositoryURL = getManifestRepositoryURL(manifest);

  let defaultOptions = {
    changelogConfig,
    cwd,
    git,
    prettierConfig: prettierConfig || {},
    repositoryURL,
  };

  await releaseWorkspaces(defaultOptions);
}

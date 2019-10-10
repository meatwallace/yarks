import * as git from '@yarks/git';
import conventionalChangelogAngular from 'conventional-changelog-angular';
import prettier from 'prettier';
import {
  getManifestRepositoryURL,
  getWorkspaceManifest,
  releaseWorkspaces,
} from '@yarks/core';

export async function executeCLI(): Promise<void> {
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

import conventionalChangelogAngular from 'conventional-changelog-angular';
import * as fs from 'fs';
import * as git from 'isomorphic-git';
import * as path from 'path';
import prettier from 'prettier';
import { releaseWorkspaces } from './releaseWorkspaces';

git.plugins.set('fs', fs);

async function executeCLI() {
  let changelogConfig = await conventionalChangelogAngular;
  let cwd = process.cwd();
  let prettierConfig = await prettier.resolveConfig(cwd);
  let repositoryURL = await getManifestRepositoryURL(cwd);

  let defaultOptions = {
    changelogConfig,
    cwd,
    git,
    prettierConfig: prettierConfig || {},
    repositoryURL,
  };

  await releaseWorkspaces(defaultOptions);
}

// TODO(#26): accomodate other git hosts and repository url formats
async function getManifestRepositoryURL(cwd) {
  // TODO: dedupe by reusing getWorkspaceManifest function
  let manifestPath = path.resolve(cwd, 'package.json');
  let manifestString = await fs.promises.readFile(manifestPath, 'utf8');
  let manifest = JSON.parse(manifestString);

  let repositoryURL = manifest.repository && manifest.repository.url;

  return repositoryURL;
}

executeCLI();

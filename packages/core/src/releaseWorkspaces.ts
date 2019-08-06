import * as os from 'os';
import * as path from 'path';
import { cleanEnv, str } from 'envalid';
import isCI from 'is-ci';
import { configureRegistryAuth } from './configureRegistryAuth';
import { createReleaseContext } from './createReleaseContext';
import { formatMarkdown } from './formatMarkdown';
import { getWorkspaces } from './getWorkspaces';
import { prepareWorkspace } from './prepareWorkspace';
import { releaseWorkspace } from './releaseWorkspace';
import { Options, ReleaseContext } from './types';

export async function releaseWorkspaces(
  options: Options,
): Promise<ReleaseContext> {
  let workspaces = await getWorkspaces(options);
  let releaseContext = await createReleaseContext(workspaces, options);

  // log out an overview of our release strategy
  for (let workspaceName in releaseContext) {
    let workspace = releaseContext[workspaceName];

    console.log('workspace:', workspace.name);
    console.log('currentVersion:', workspace.currentVersion);
    console.log('currentRelease:', workspace.currentRelease);

    if (workspace.nextRelease) {
      console.log('nextRelease:', workspace.nextRelease);
      console.log('nextVersion:', workspace.nextVersion);
      console.log('nextTag:', workspace.nextTag);
      console.log('releaseNotes:');
      console.log(formatMarkdown(workspace.releaseNotes, options));
    } else {
      console.log('no release required');
    }
  }

  // abort if we're not in a CI environment
  if (!isCI) {
    return releaseContext;
  }

  let schema = {
    NPM_TOKEN: str(),
    GITHUB_TOKEN: str(),
    GIT_AUTHOR_NAME: str(),
    GIT_AUTHOR_EMAIL: str(),
  };

  // TODO(#22): extract env validation to function and pass via options
  let env = cleanEnv(process.env, schema, { strict: true });

  // TODO(#56): pass yarn config path from cli to api opts
  let configPath = path.resolve(os.homedir(), '.yarnrc.yml');

  // TODO(#21): replace hardcoded registry with default from yarn config
  let registry = 'https://registry.yarnpkg.com';

  // TODO(#4): iterate over packages and authenticate against relevant registry
  await configureRegistryAuth(configPath, registry, env.NPM_TOKEN);

  // bump workspace versions and write changelogs
  for (let workspaceName in releaseContext) {
    let workspace = releaseContext[workspaceName];

    workspace = await prepareWorkspace(workspace, options);

    releaseContext[workspaceName] = workspace;
  }

  // publish packages to NPM, commit changes and push to git
  for (let workspaceName in releaseContext) {
    let workspace = releaseContext[workspaceName];

    workspace = await releaseWorkspace(workspace, options, env);

    releaseContext[workspaceName] = workspace;
  }

  return releaseContext;
}

import * as path from 'path';
import { getWorkspaceManifest } from './getWorkspaceManifest';
import { getWorkspaces } from './getWorkspaces';

export async function getPublishableWorkspaces(options) {
  let workspaces = await getWorkspaces(options);

  workspaces = await Promise.all(
    workspaces.map(async (workspace) => {
      let workspacePath = path.resolve(options.cwd, workspace.location);
      let manifest = await getWorkspaceManifest(workspacePath);

      return {
        ...workspace,
        path: workspacePath,
        manifest,
      };
    }),
  );

  // TODO: account for manifest's publishConfig.access & yarn's npmPublishAccess
  workspaces = workspaces.filter((workspace) => !workspace.manifest.private);

  return workspaces;
}

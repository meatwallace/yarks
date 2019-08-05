import execa from 'execa';
import { updateChangelog } from './updateChangelog';
import { Options, WorkspaceReleaseContext } from './types';

export async function prepareWorkspace(
  workspace: WorkspaceReleaseContext,
  options: Options,
): Promise<WorkspaceReleaseContext> {
  if (!workspace.nextRelease) {
    return workspace;
  }

  await execa('yarn', ['version', workspace.nextRelease], {
    cwd: workspace.location,
  });

  await updateChangelog(workspace, options);

  return workspace;
}

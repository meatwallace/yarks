import execa from 'execa';
import { updateChangelog } from './updateChangelog';
import { ReleaseContext, Workspace } from './types';

export async function prepareWorkspace(
  workspace: Workspace,
  releaseContext: ReleaseContext,
  options,
  env,
): Promise<Workspace> {
  if (!workspace.nextRelease) {
    return workspace;
  }

  await execa('yarn', ['version', workspace.nextRelease], {
    cwd: workspace.location,
  });

  await updateChangelog(workspace, options);

  return workspace;
}

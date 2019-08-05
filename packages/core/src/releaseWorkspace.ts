import { commitRelease } from './commitRelease';
import { publishPackage } from './publishPackage';
import { pushChanges } from './pushChanges';
import { stageReleaseFiles } from './stageReleaseFiles';
import { tagRelease } from './tagRelease';
import { Environment, Options, WorkspaceReleaseContext } from './types';

export async function releaseWorkspace(
  workspace: WorkspaceReleaseContext,
  options: Options,
  env: Environment,
): Promise<WorkspaceReleaseContext> {
  if (!workspace.nextRelease) {
    return workspace;
  }

  await stageReleaseFiles(workspace, options);
  await commitRelease(workspace, options, env);
  await tagRelease(workspace, options);
  await publishPackage(workspace);
  await pushChanges(workspace, options, env);

  return workspace;
}

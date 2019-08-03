import { commitRelease } from './commitRelease';
import { publishPackage } from './publishPackage';
import { pushChanges } from './pushChanges';
import { stageReleaseFiles } from './stageReleaseFiles';
import { tagRelease } from './tagRelease';
import { ReleaseContext, Workspace } from './types';

export async function releaseWorkspace(
  workspace: Workspace,
  releaseContext: ReleaseContext,
  options,
  env,
): Promise<Workspace> {
  if (!workspace.nextRelease) {
    return workspace;
  }

  await stageReleaseFiles(workspace, options);
  await commitRelease(workspace, options, env);
  await tagRelease(workspace, options);
  await publishPackage(workspace, options);
  await pushChanges(workspace, options, env);

  return workspace;
}

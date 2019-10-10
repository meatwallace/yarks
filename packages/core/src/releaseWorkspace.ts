import { commitRelease } from './commitRelease';
import { publishPackage } from './publishPackage';
import { pushChanges } from './pushChanges';
import { stageReleaseFiles } from './stageReleaseFiles';
import { tagRelease } from './tagRelease';
import { Options, WorkspaceReleaseContext } from './types';

export async function releaseWorkspace(
  workspace: WorkspaceReleaseContext,
  options: Options,
): Promise<WorkspaceReleaseContext> {
  if (!workspace.nextRelease) {
    return workspace;
  }

  await stageReleaseFiles(workspace, options);
  await commitRelease(workspace, options);
  await tagRelease(workspace, options);
  await publishPackage(workspace);
  await pushChanges(options);

  return workspace;
}

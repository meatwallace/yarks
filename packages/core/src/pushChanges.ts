import { pushGitRef } from './pushGitRef';
import { Environment, Options, WorkspaceReleaseContext } from './types';

export async function pushChanges(
  workspace: WorkspaceReleaseContext,
  options: Options,
  env: Environment,
): Promise<void> {
  // TODO(#25): provide option for configuring release branch
  await pushGitRef('master', options, env);

  // TODO: WorkspaceReleaseContext should have non-nullable props by this stage
  await pushGitRef(<string>workspace.nextTag, options, env);
}

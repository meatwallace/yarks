import { Options, WorkspaceReleaseContext } from './types';

export async function commitRelease(
  workspace: WorkspaceReleaseContext,
  options: Options,
) {
  let message = `chore(release): ${workspace.nextTag} [skip ci]`;

  await options.git.commit(message, { cwd: options.cwd });
}

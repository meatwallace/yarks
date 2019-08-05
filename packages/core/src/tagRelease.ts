import { Options, WorkspaceReleaseContext } from './types';

export async function tagRelease(
  workspace: WorkspaceReleaseContext,
  options: Options,
): Promise<void> {
  await options.git.tag({ dir: options.cwd, ref: workspace.nextTag });
}

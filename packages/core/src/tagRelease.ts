import invariant from 'tiny-invariant';
import { Options, WorkspaceReleaseContext } from './types';

export async function tagRelease(
  workspace: WorkspaceReleaseContext,
  options: Options,
): Promise<void> {
  invariant(
    typeof workspace.nextTag === 'string',
    'workspace tag must be set to tag release',
  );

  await options.git.tag(<string>workspace.nextTag, { cwd: options.cwd });
}

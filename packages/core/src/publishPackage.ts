import execa from 'execa';
import { WorkspaceReleaseContext } from './types';

export async function publishPackage(
  workspace: WorkspaceReleaseContext,
): Promise<void> {
  await execa('yarn', ['npm', 'publish'], { cwd: workspace.location });
}

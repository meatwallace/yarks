import * as path from 'path';
import { Options, WorkspaceReleaseContext } from './types';

export async function stageReleaseFiles(
  workspace: WorkspaceReleaseContext,
  options: Options,
): Promise<void> {
  let files = ['package.json', 'CHANGELOG.md'];

  if (workspace.manifest.files) {
    // TODO: dedupe
    files = [...files, ...workspace.manifest.files];
  }

  files = files.map((file) => {
    return path.join(workspace.location, file);
  });

  for (let filepath of files) {
    try {
      await options.git.add({ dir: options.cwd, filepath });
    } catch {}
  }
}

import * as path from 'path';
import { Options, WorkspaceReleaseContext } from './types';

const DEFAULT_FILES = ['package.json', 'CHANGELOG.md'];

export async function stageReleaseFiles(
  workspace: WorkspaceReleaseContext,
  options: Options,
): Promise<void> {
  let files = [...DEFAULT_FILES];

  if (workspace.manifest.files) {
    // TODO: dedupe
    files = [...files, ...workspace.manifest.files];
  }

  files = files.map((file) => {
    return path.join(workspace.location, file);
  });

  await options.git.add(files, { cwd: options.cwd });
}

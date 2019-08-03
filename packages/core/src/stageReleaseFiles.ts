import * as path from 'path';

export async function stageReleaseFiles(workspace, options) {
  let files = workspace.manifest.files.map((file) => {
    return path.join(workspace.location, file);
  });

  for (let filepath of files) {
    try {
      await options.git.add({ dir: options.cwd, filepath });
    } catch {}
  }
}

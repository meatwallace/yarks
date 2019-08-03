export async function tagRelease(workspace, options) {
  await options.git.tag({ dir: options.cwd, ref: workspace.nextTag });
}

import execa from 'execa';

export async function publishPackage(workspace, options) {
  await execa('yarn', ['npm', 'publish'], { cwd: workspace.location });
}

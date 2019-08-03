import execa from 'execa';

export async function getWorkspaces(options) {
  let workspaceList = await execa('yarn', ['workspaces', 'list', '--json'], {
    cwd: options.cwd,
  });

  let workspaces = workspaceList.stdout
    .split('\n')
    .map((workspace) => JSON.parse(workspace));

  return workspaces;
}

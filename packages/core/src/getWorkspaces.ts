import execa from 'execa';
import { Options, Workspace } from 'types';

export async function getWorkspaces(
  options: Options,
): Promise<Array<Workspace>> {
  let workspaceList = await execa(
    'yarn',
    ['workspaces', 'list', '--json', '--verbose'],
    {
      cwd: options.cwd,
    },
  );

  let workspaces = workspaceList.stdout
    .split('\n')
    .map((workspace: string) => JSON.parse(workspace));

  return workspaces;
}

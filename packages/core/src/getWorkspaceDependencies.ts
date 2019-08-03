import { Workspace } from './types';

export function getWorkspaceDependencies(
  workspace: Workspace,
  workspaces: Array<Workspace>,
): Array<string> {
  let dependencies = Object.keys({
    ...workspace.manifest.dependencies,
    ...workspace.manifest.devDependencies,
    ...workspace.manifest.peerDependencies,
  });

  dependencies = dependencies.filter((dependency) =>
    workspaces.some((workspace) => workspace.name === dependency),
  );

  return dependencies;
}

import { Workspace } from './types';

export async function filterWorkspaceCommits(
  workspace: Workspace,
  commits,
  options,
) {
  let lastSHA = null;
  let lastCommit = null;
  let workspaceCommits = [];

  for (let commit of commits) {
    try {
      let o = await options.git.readObject({
        dir: options.cwd,
        oid: commit.oid,
        filepath: workspace.location,
      });

      if (o.oid !== lastSHA && lastSHA !== null) {
        workspaceCommits.push(lastCommit);
      }

      if (o.oid !== lastSHA) {
        lastSHA = o.oid;
      }
    } catch (error) {
      workspaceCommits.push(lastCommit);

      break;
    }

    lastCommit = commit;
  }

  return workspaceCommits;
}

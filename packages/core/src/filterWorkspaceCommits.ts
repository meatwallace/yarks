import { CommitDescription } from 'isomorphic-git';
import { Options, Workspace } from './types';

export async function filterWorkspaceCommits(
  workspace: Workspace,
  commits: Array<CommitDescription>,
  options: Options,
): Promise<Array<CommitDescription>> {
  let lastSHA: string | null = null;
  let lastCommit: CommitDescription | null = null;
  let workspaceCommits: Array<CommitDescription> = [];

  for (let commit of commits) {
    try {
      let o = await options.git.readObject({
        dir: options.cwd,
        oid: commit.oid,
        filepath: workspace.location,
      });

      if (o.oid !== lastSHA && lastSHA !== null && lastCommit) {
        workspaceCommits.push(lastCommit);
      }

      if (o.oid !== lastSHA) {
        lastSHA = o.oid;
      }
    } catch (error) {
      if (lastCommit) {
        workspaceCommits.push(lastCommit);
      }

      break;
    }

    lastCommit = commit;
  }

  return workspaceCommits;
}

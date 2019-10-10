import filterCommits from 'conventional-commits-filter';
import parseCommit, { Commit } from 'conventional-commits-parser';
import { GitCommit } from '@yarks/git';
import { getGitCommits } from './getGitCommits';
import { Options, Workspace } from './types';

export async function getWorkspaceCommits(
  workspace: Workspace,
  currentRelease: string | null,
  options: Options,
): Promise<Array<Commit>> {
  let commits = await getGitCommits(workspace, currentRelease, options);

  // parse the commit messages and create commit objects compatible with
  // conventional-changelog
  let parsedCommits = commits.map((commit: GitCommit) => {
    return parseCommit.sync(`${commit.subject}\n${commit.body}`);
  });

  // run conventional-changelog's filter to remove any unnecesary commits ex.
  // commits that were reverted in the same release
  parsedCommits = filterCommits(parsedCommits);

  return parsedCommits;
}

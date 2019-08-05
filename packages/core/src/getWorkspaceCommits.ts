import filterCommits from 'conventional-commits-filter';
import parseCommit, { Commit } from 'conventional-commits-parser';
import { filterWorkspaceCommits } from './filterWorkspaceCommits';
import { getGitCommits } from './getGitCommits';
import { Options, Workspace } from './types';

export async function getWorkspaceCommits(
  workspace: Workspace,
  currentRelease: string | null,
  options: Options,
): Promise<Array<Commit>> {
  let commits = await getGitCommits(currentRelease, options);

  // if we are evaluating a non-root workspace, then we want to filter out any
  // commits that aren't relevant
  if (workspace.location !== '.') {
    commits = await filterWorkspaceCommits(workspace, commits, options);
  }

  // parse the commit messages and create commit objects compatible with
  // conventional-changelog
  let parsedCommits = commits.map((commit) => {
    return parseCommit.sync(commit.message);
  });

  // run conventional-changelog's filter to remove any unnecesary commits ex.
  // commits that were reverted in the same release
  parsedCommits = filterCommits(parsedCommits);

  return parsedCommits;
}

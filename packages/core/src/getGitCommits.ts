import { GitCommit } from '@yarks/git';
import { Options, Workspace } from './types';

export async function getGitCommits(
  workspace: Workspace,
  currentRelease: string | null,
  options: Options,
): Promise<Array<GitCommit>> {
  let commits = await options.git.log({
    cwd: options.cwd,
    path: workspace.location,
    // if we've got a previous release, filter the history from there
    range: currentRelease ? `${currentRelease}..HEAD` : 'HEAD',
  });

  return commits;
}

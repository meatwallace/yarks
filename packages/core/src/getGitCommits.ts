import { Commit, Workspace } from './types';

export async function getGitCommits(
  workspace: Workspace,
  currentRelease: string | null,
  options,
): Promise<Array<Commit>> {
  let commits = [];

  // if there's no current release, just get the entire commit log
  if (!currentRelease) {
    commits = await options.git.log({ dir: options.cwd });

    return commits;
  }

  // resolve our current release tag to it's SHA1
  let currentReleaseSHA1 = await options.git.resolveRef({
    dir: options.cwd,
    ref: currentRelease,
  });

  // use the SHA1 to resolve the commit information
  let currentReleaseCommit = await options.git.readObject({
    dir: options.cwd,
    oid: currentReleaseSHA1,
  });

  // grab all commits since the timestamp of the last release commit
  commits = await options.git.log({
    dir: options.cwd,

    // use the current release commits timestamp -1 millisecond so that it's
    // included in our log
    since: new Date(currentReleaseCommit.object.committer.timestamp * 1000 - 1),
  });

  return commits;
}

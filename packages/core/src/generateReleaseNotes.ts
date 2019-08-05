import { Commit } from 'conventional-commits-parser';
import writeChangelog from 'conventional-changelog-writer';
import getStream from 'get-stream';
import hostedGitInfo from 'hosted-git-info';
import intoStream from 'into-stream';
import invariant from 'tiny-invariant';
import { Options } from './types';

export async function generateReleaseNotes(
  commits: Array<Commit>,
  nextVersion: string | null,
  options: Options,
): Promise<string> {
  if (!nextVersion) {
    return '';
  }

  let repositoryURLInfo = hostedGitInfo.fromUrl(options.repositoryURL);

  invariant(
    repositoryURLInfo.user,
    'the repository URL must contain a username',
  );

  invariant(
    repositoryURLInfo.project,
    'the repository URL must contain a project name',
  );

  let changelogContext = {
    host: `https://${repositoryURLInfo.domain}`,
    owner: <string>repositoryURLInfo.user,
    repository: <string>repositoryURLInfo.project,
    commit: 'commit',
    issue: 'issues',
    version: nextVersion,
  };

  let changelogStream = intoStream
    .object(commits)
    .pipe(writeChangelog(changelogContext, options.changelogConfig.writerOpts));

  let releaseNotes = await getStream(changelogStream);

  return releaseNotes;
}

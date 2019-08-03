import writeChangelog from 'conventional-changelog-writer';
import getStream from 'get-stream';
import hostedGitInfo from 'hosted-git-info';
import intoStream from 'into-stream';

export async function generateReleaseNotes(
  workspace,
  commits,
  nextVersion,
  options,
): Promise<string> {
  if (!nextVersion) {
    return '';
  }

  let repositoryURLInfo = hostedGitInfo.fromUrl(options.repositoryURL);

  let changelogContext = {
    host: `https://${repositoryURLInfo.domain}`,
    owner: repositoryURLInfo.user,
    repository: repositoryURLInfo.project,
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

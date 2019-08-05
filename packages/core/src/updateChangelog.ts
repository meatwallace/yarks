import { promises as fs } from 'fs';
import * as path from 'path';
import { formatMarkdown } from './formatMarkdown';
import { Options, WorkspaceReleaseContext } from './types';

export async function updateChangelog(
  workspace: WorkspaceReleaseContext,
  options: Options,
) {
  let changelogPath = path.resolve(workspace.location, 'CHANGELOG.md');
  let changelog = '';

  try {
    changelog = await fs.readFile(changelogPath, 'utf8');

    // remove the first line/title from our existing changelog to simplify
    // appending new release notes
    changelog = changelog.substring(changelog.indexOf('\n') + 1);
  } catch {}

  changelog = `# ${workspace.name}\n${workspace.releaseNotes}\n${changelog}`;
  changelog = formatMarkdown(changelog, options);

  await fs.writeFile(changelogPath, changelog, 'utf8');
}

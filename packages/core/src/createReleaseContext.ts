import * as path from 'path';
import invariant from 'tiny-invariant';
import { RELEASE_TYPE } from './enums/releaseType';
import { generateReleaseNotes } from './generateReleaseNotes';
import { getCurrentRelease } from './getCurrentRelease';
import { getGitTags } from './getGitTags';
import { getNextReleaseType } from './getNextReleaseType';
import { getNextTag } from './getNextTag';
import { getNextVersion } from './getNextVersion';
import { getWorkspaceCommits } from './getWorkspaceCommits';
import { getWorkspaceManifest } from './getWorkspaceManifest';
import {
  Options,
  ReleaseContext,
  Workspace,
  WorkspaceReleaseContext,
} from './types';

const DEPENDENCIES_HEADER = '### Dependencies';

// TODO: split out into smaller functions to reduce the complexity and
// redundancy
export async function createReleaseContext(
  workspaces: Array<Workspace>,
  options: Options,
): Promise<ReleaseContext> {
  let tags = await getGitTags(options);

  let releases: Array<string> = [];

  let releaseContext: ReleaseContext = await workspaces.reduce(
    async (
      accumP: Promise<ReleaseContext>,
      workspace: Workspace,
    ): Promise<ReleaseContext> => {
      let accum = await accumP;

      let workspacePath = path.resolve(options.cwd, workspace.location);
      let manifest = await getWorkspaceManifest(workspacePath);

      if (manifest.private) {
        return accum;
      }

      let currentRelease = getCurrentRelease(workspace.name, tags);
      let commits = await getWorkspaceCommits(
        workspace,
        currentRelease,
        options,
      );

      let nextRelease = getNextReleaseType(commits);

      invariant(
        typeof manifest.version === 'string',
        `workspace ${workspace.name} must declare a version property in it's manifest. if this is your initial release, use '1.0.0-development'.`,
      );

      // TODO: remove assertion when tiny-invariant is migrated to typescript
      let currentVersion: string = <string>manifest.version;

      let nextVersion = getNextVersion(currentVersion, nextRelease);
      let nextTag = getNextTag(workspace.name, nextVersion);
      let releaseNotes = await generateReleaseNotes(
        commits,
        nextVersion,
        options,
      );

      accum[workspace.name] = {
        ...workspace,
        commits,
        currentRelease,
        currentVersion,
        manifest,
        nextRelease,
        nextTag,
        nextVersion,
        path: workspacePath,
        releaseNotes,
      };

      if (nextRelease) {
        releases.push(workspace.name);
      }

      return accum;
    },
    Promise.resolve({}),
  );

  const processWorkspaceSiblings = async (
    workspace: WorkspaceReleaseContext,
  ) => {
    if (!workspace.nextRelease) {
      return;
    }

    // repeatedly parsing the release context's values like this is incredibly
    // wasteful - ideally we'd graph our dependency tree and simply walk it
    await Promise.all(
      Object.values(releaseContext).map(
        async (sibling: WorkspaceReleaseContext) => {
          if (!sibling.workspaceDependencies.includes(workspace.name)) {
            return;
          }

          if (!sibling.nextRelease) {
            sibling.nextRelease = RELEASE_TYPE.PATCH;
            sibling.nextVersion = getNextVersion(
              sibling.currentVersion,
              sibling.nextRelease,
            );

            sibling.nextTag = getNextTag(sibling.name, sibling.nextVersion);
          }

          // if we don't already have release notes, we want to generate a stub
          // that we can amend our dependency changes to
          if (!sibling.releaseNotes) {
            sibling.releaseNotes = await generateReleaseNotes(
              [],
              sibling.nextVersion,
              options,
            );
          }

          // if this is our first dependency change, add a header to the notes
          if (!sibling.releaseNotes.includes(DEPENDENCIES_HEADER)) {
            sibling.releaseNotes = `${sibling.releaseNotes}\n${DEPENDENCIES_HEADER}\n`;
          }

          // add our change log item describing the dependency bump
          let changeItem = `* **${workspace.name}:** upgraded to ${workspace.nextVersion}`;
          sibling.releaseNotes = `${sibling.releaseNotes}\n${changeItem}`;

          // if we've flagged this workspace for release already, exit to avoid
          // recursively processing dependencies forever
          if (releases.includes(sibling.name)) {
            return;
          } else {
            // if we haven't processed this workspaces' dependencies, track this
            // workspace and then process it
            releases.push(sibling.name);

            await processWorkspaceSiblings(sibling);
          }
        },
      ),
    );
  };

  await Promise.all(
    Object.values(releaseContext).map((workspace: WorkspaceReleaseContext) =>
      processWorkspaceSiblings(workspace),
    ),
  );

  return releaseContext;
}

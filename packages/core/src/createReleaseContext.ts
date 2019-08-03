import { RELEASE_TYPE } from './enums/releaseType';
import { generateReleaseNotes } from './generateReleaseNotes';
import { getCurrentRelease } from './getCurrentRelease';
import { getGitTags } from './getGitTags';
import { getNextReleaseType } from './getNextReleaseType';
import { getNextTag } from './getNextTag';
import { getNextVersion } from './getNextVersion';
import { getWorkspaceCommits } from './getWorkspaceCommits';
import { getWorkspaceDependencies } from './getWorkspaceDependencies';
import { ReleaseContext, Workspace } from './types';

const DEPENDENCIES_HEADER = '### Dependencies';

// TODO: split out into smaller functions to reduce the complexity and
// redundancy
export async function createReleaseContext(
  workspaces,
  options,
): Promise<ReleaseContext> {
  let tags = await getGitTags(options);

  let releases = [];

  let releaseContext = await workspaces.reduce(async (accumP, workspace) => {
    let accum = await accumP;

    let currentRelease = getCurrentRelease(workspace, tags, options);
    let currentVersion = workspace.manifest.version;
    let commits = await getWorkspaceCommits(workspace, currentRelease, options);
    let dependencies = getWorkspaceDependencies(workspace, workspaces);
    let nextRelease = getNextReleaseType(commits);
    let nextVersion = getNextVersion(currentVersion, nextRelease);
    let nextTag = getNextTag(workspace.name, nextVersion);
    let releaseNotes = await generateReleaseNotes(
      workspace,
      commits,
      nextVersion,
      options,
    );

    accum[workspace.name] = {
      ...workspace,
      commits,
      currentRelease,
      currentVersion,
      dependencies,
      nextRelease,
      nextTag,
      nextVersion,
      releaseNotes,
    };

    if (nextRelease) {
      releases.push(workspace.name);
    }

    return accum;
  }, Promise.resolve({}));

  workspaces = Object.values(releaseContext);

  const processWorkspaceSiblings = async (workspace: Workspace) => {
    if (!workspace.nextRelease) {
      return;
    }

    // repeatedly parsing the release context's values like this is incredibly
    // wasteful - ideally we'd graph our dependency tree and simply walk it
    await Promise.all(
      workspaces.map(async (sibling: Workspace) => {
        if (!sibling.dependencies.includes(workspace.name)) {
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
            sibling,
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
      }),
    );
  };

  await Promise.all(
    workspaces.map((workspace: Workspace) =>
      processWorkspaceSiblings(workspace),
    ),
  );

  return releaseContext;
}

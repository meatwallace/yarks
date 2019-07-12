import filterCommits from 'conventional-commits-filter';
import parseCommit from 'conventional-commits-parser';
import writeChangelog from 'conventional-changelog-writer';
import merge from 'deepmerge';
import { cleanEnv, str } from 'envalid';
import execa from 'execa';
import { promises as fs } from 'fs';
import getStream from 'get-stream';
import hostedGitInfo from 'hosted-git-info';
import isCI from 'is-ci';
import intoStream from 'into-stream';
import * as os from 'os';
import * as path from 'path';
import prettier from 'prettier';
import semver from 'semver';
import yaml from 'yaml';

const RELEASE_TYPE = {
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major',
};

const RELEASE_TYPES = Object.values(RELEASE_TYPE);
const HIGHEST_RELEASE_TYPE = RELEASE_TYPES[RELEASE_TYPES.length - 1];

const COMMIT_TYPE_RELEASE_TYPE = {
  feat: RELEASE_TYPE.MINOR,
  fix: RELEASE_TYPE.PATCH,
  perf: RELEASE_TYPE.PATCH,
};

export async function releaseWorkspaces(options) {
  let workspaces = await getPublishableWorkspaces(options);
  let workspaceNames = workspaces.map((workspace) => workspace.name);
  let releaseContext = await createReleaseContext(workspaces, options);

  for (let workspaceName of workspaceNames) {
    let workspace = releaseContext[workspaceName];

    console.log('workspace:', workspace.name);
    console.log('currentVersion:', workspace.currentVersion);
    console.log('currentRelease:', workspace.currentRelease);
    console.log('nextRelease:', workspace.nextRelease);
    console.log('nextVersion:', workspace.nextVersion);
    console.log('nextTag:', workspace.nextTag);
    console.log('releaseNotes:');
    console.log(formatMarkdown(workspace.releaseNotes, options));
  }

  if (!isCI) {
    return releaseContext;
  }

  let schema = {
    NPM_TOKEN: str(),
    GITHUB_TOKEN: str(),
    GIT_AUTHOR_NAME: str(),
    GIT_AUTHOR_EMAIL: str(),
    GIT_COMMITER_NAME: str(),
    GIT_COMMITER_EMAIL: str(),
  };

  // TODO(#22): extract env validation to function and pass via options
  let env = cleanEnv(process.env, schema, { strict: true });

  await configureRegistryAuth(releaseContext, options, env);

  for (let workspaceName of workspaceNames) {
    let workspace = releaseContext[workspaceName];

    workspace = await releaseWorkspace(workspace, releaseContext, options, env);

    releaseContext[workspaceName] = workspace;
  }

  return releaseContext;
}

async function createReleaseContext(workspaces, options) {
  let tags = await getGitTags(options);

  let releaseContext = await workspaces.reduce(async (accumP, workspace) => {
    let accum = await accumP;

    let currentRelease = await getCurrentRelease(workspace, tags, options);
    let currentVersion = workspace.manifest.version;
    let commits = await getWorkspaceCommits(workspace, options);
    let nextRelease = getNextReleaseType(commits);
    let nextTag = null;
    let nextVersion = null;
    let releaseNotes = null;

    if (nextRelease) {
      nextVersion = semver.inc(currentVersion, nextRelease);
      nextTag = `${workspace.name}@${nextVersion}`;
      releaseNotes = await generateReleaseNotes(
        workspace,
        commits,
        nextVersion,
        options,
      );
    }

    accum[workspace.name] = {
      ...workspace,
      commits,
      currentRelease,
      currentVersion,
      nextRelease,
      nextTag,
      nextVersion,
      releaseNotes,
    };

    return accum;
  }, Promise.resolve({}));

  return releaseContext;
}

async function getPublishableWorkspaces(context) {
  let workspaces = await getWorkspaces(context);

  workspaces = await Promise.all(
    workspaces.map(async (workspace) => {
      let workspacePath = path.resolve(context.cwd, workspace.location);
      let manifest = await getWorkspaceManifest(workspacePath);

      return {
        ...workspace,
        path: workspacePath,
        manifest,
      };
    }),
  );

  // TODO: account for manifest's publishConfig.access & yarn's npmPublishAccess
  workspaces = workspaces.filter((workspace) => !workspace.manifest.private);

  return workspaces;
}

async function getWorkspaceManifest(workspacePath) {
  let manifestPath = path.resolve(workspacePath, 'package.json');
  let manifestString = await fs.readFile(manifestPath, 'utf8');
  let manifest = JSON.parse(manifestString);

  return manifest;
}

async function getWorkspaces(context) {
  let workspaceList = await execa('yarn', ['workspaces', 'list', '--json'], {
    cwd: context.cwd,
  });

  let workspaces = workspaceList.stdout
    .split('\n')
    .map((workspace) => JSON.parse(workspace));

  return workspaces;
}

async function getCurrentRelease(workspace, tags, options) {
  let lastRelease = tags.filter((tag) => tag.startsWith(workspace.name)).pop();

  return lastRelease;
}

async function getGitTags(options) {
  let tags = await options.git.listTags({ dir: options.cwd });

  return tags;
}

async function getWorkspaceCommits(workspace, options) {
  let commits = await getGitCommits(workspace, options);

  // if we are evaluating a non-root workspace, then we want to filter out any
  // commits that aren't relevant
  if (workspace.location !== '.') {
    commits = await filterWorkspaceCommits(workspace, commits, options);
  }

  // parse the commit messages and create commit objects compatible with
  // conventional-changelog
  commits = commits.map((commit) => {
    return { ...commit, ...parseCommit.sync(commit.message) };
  });

  // run conventional-changelog's filter to remove any unnecesary commits ex.
  // commits that were reverted in the same release
  commits = filterCommits(commits);

  return commits;
}

async function getGitCommits(workspace, options) {
  let commits = await options.git.log({
    dir: options.cwd,
    ref: workspace.lastRelease,
  });

  return commits;
}

async function filterWorkspaceCommits(workspace, commits, options) {
  let lastSHA = null;
  let lastCommit = null;
  let workspaceCommits = [];

  for (let commit of commits) {
    try {
      let o = await options.git.readObject({
        dir: options.cwd,
        oid: commit.oid,
        filepath: workspace.location,
      });

      if (o.oid !== lastSHA && lastSHA !== null) {
        workspaceCommits.push(lastCommit);
      }

      if (o.oid !== lastSHA) {
        lastSHA = o.oid;
      }
    } catch (error) {
      workspaceCommits.push(lastCommit);

      break;
    }

    lastCommit = commit;
  }

  return workspaceCommits;
}

function getNextReleaseType(commits) {
  let nextRelease = null;

  commits.every((commit) => {
    let commitReleaseType = getCommitReleaseType(commit);

    // if we don't need a release for this commit, bail out early
    if (!commitReleaseType) {
      return true;
    }

    // if we haven't set a release type previously or this commit reequires
    // a greater release, update our pending release type
    if (isGreaterReleaseType(nextRelease, commitReleaseType)) {
      nextRelease = commitReleaseType;
    }

    // break the loop if we're already at the highest release type
    if (nextRelease === HIGHEST_RELEASE_TYPE) {
      return false;
    }

    return true;
  });

  return nextRelease;
}

const BREAKING_CHANGE_REGEXP = new RegExp(/^BREAKING/);

function getCommitReleaseType(commit) {
  if (isBreakingChange(commit)) {
    return RELEASE_TYPE.MAJOR;
  }

  if (commit.revert) {
    return RELEASE_TYPE.PATCH;
  }

  return COMMIT_TYPE_RELEASE_TYPE[commit.type];
}

function isBreakingChange(commit) {
  if (commit.notes.length === 0) {
    return false;
  }

  return commit.notes.some((note) => BREAKING_CHANGE_REGEXP.test(note.title));
}

function isGreaterReleaseType(currentType, type) {
  return RELEASE_TYPES.indexOf(type) > RELEASE_TYPES.indexOf(currentType);
}
async function configureRegistryAuth(releaseContext, options, env) {
  let configPath = path.resolve(os.homedir(), '.yarnrc.yml');

  // TODO(#21): replace hardcoded registry with default from yarn config
  let registry = 'https://registry.yarnpkg.com/';

  // TODO(#4): iterate over packages and authenticate against relevant registry
  let token = await getAuthToken(configPath, registry);

  if (token) {
    return;
  }

  await addAuthToken(configPath, registry, env.NPM_TOKEN);
}

async function addAuthToken(configPath, registry, token) {
  let registryConfig = {
    npmRegistries: {
      [registry]: {
        npmAuthToken: token,
      },
    },
  };

  try {
    let configString = await fs.readFile(configPath, 'utf8');

    // if we have a preexisting root config, merge our new auth options with it
    registryConfig = merge(yaml.parse(configString), registryConfig);
  } catch (error) {}

  await fs.writeFile(configPath, yaml.stringify(registryConfig));
}

async function getAuthToken(configPath, registry) {
  try {
    let configString = await fs.readFile(configPath, 'utf8');
    let config = yaml.parse(configString);
    let token = config.npmRegistries[registry].npmAuthToken;

    return token;
  } catch (error) {
    return null;
  }
}

async function releaseWorkspace(workspace, releaseContext, options, env) {
  // if a release is not required bail out early
  if (!workspace.nextRelease) {
    return workspace;
  }

  await execa('yarn', ['version', workspace.nextRelease], {
    cwd: workspace.location,
  });

  await updateChangelog(workspace, options);
  await stageReleaseFiles(workspace, options);
  await commitRelease(workspace, options, env);
  await tagRelease(workspace, options);
  await publishPackage(workspace, options);
  await pushChanges(workspace, options, env);
}

async function generateReleaseNotes(workspace, commits, nextVersion, options) {
  let changelogContext = {
    repoUrl: options.repositoryURL,
    version: nextVersion,
  };

  let changelogStream = intoStream
    .object(commits)
    .pipe(writeChangelog(changelogContext, options.changelogConfig.writerOpts));

  let releaseNotes = await getStream(changelogStream);

  return releaseNotes;
}

async function updateChangelog(workspace, options) {
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

function formatMarkdown(input, options) {
  let prettierConfig = { ...options.prettierConfig, parser: 'markdown' };
  let formatted = prettier.format(input, prettierConfig);

  return formatted;
}

async function stageReleaseFiles(workspace, options) {
  let files = workspace.manifest.files.map((file) => {
    return path.join(workspace.location, file);
  });

  for (let filepath of files) {
    try {
      await options.git.add({ dir: options.cwd, filepath });
    } catch {}
  }
}

async function commitRelease(workspace, options, env) {
  await options.git.commit({
    dir: options.cwd,
    message: `chore(release): ${workspace.nextTag} [skip ci]`,
    author: {
      name: env.GIT_AUTHOR_NAME,
      email: env.GIT_AUTHOR_EMAIL,
    },
  });
}

async function tagRelease(workspace, options) {
  await options.git.tag({ dir: options.cwd, ref: workspace.nextTag });
}

async function publishPackage(workspace, options) {
  await execa('yarn', ['npm', 'publish', '--tolerate-republish'], {
    cwd: workspace.location,
  });
}

async function pushChanges(workspace, options, env) {
  // TODO(#26): accomodate other git hosts and other repository URL formats
  await options.git.push({
    dir: options.cwd,
    // TODO(#25): provide option for configuring release branch
    ref: 'master',
    token: env.GITHUB_TOKEN,
    url: options.repositoryURL,
  });
}

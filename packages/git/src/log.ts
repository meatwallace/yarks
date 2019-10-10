import * as path from 'path';
import execa from 'execa';
import { parseRefs } from './utils/parseRefs';
import { getRootGitPath } from './utils/getRootGitPath';
import { GitCommit } from './types';

const PART_SEPERATOR = '==PART_SEPERATOR==';
const COMMIT_SEPERATOR = '==COMMIT_SEPERATOR==';

// prettier-ignore
// subject, body, refs, commit hash, tree hash, author info, committer info
const FIELDS = ['s', 'b', 'd', 'H', 'h', 'T', 't', 'aI', 'ae', 'an', 'cI', 'ce', 'cn' ]
  .map((field: string) => `%${field}`)
  .join(PART_SEPERATOR)
  .concat(COMMIT_SEPERATOR);

type Options = {
  cwd?: string;
  range?: string;
  path?: string;
};

const defaultOptions = {
  cwd: process.cwd(),
  range: 'HEAD',
  path: null,
};

export async function log(options?: Options): Promise<Array<GitCommit>> {
  let finalOptions = { ...defaultOptions, ...options };

  let args = [`--format=${FIELDS}`, finalOptions.range];

  if (finalOptions.path) {
    let rootGitPath = await getRootGitPath({ cwd: finalOptions.cwd });
    let relativePath = path.relative(rootGitPath, finalOptions.path);

    args.push('--', relativePath);
  }

  // run `git log` with our specific format string, split into seperate commit
  // strings, then parse the commit strings into our desired format
  let output = await execa('git', ['log', ...args], { cwd: finalOptions.cwd });

  let commitStrings = output.stdout.split(COMMIT_SEPERATOR);
  let commits = commitStrings.filter(Boolean).map((commitString: string) => {
    return parseCommitString(commitString);
  });

  return commits;
}

function parseCommitString(commitString: string): GitCommit {
  const [
    subject,
    body,
    refs,
    commitHash,
    commitShortHash,
    treeHash,
    shortTreeHash,
    authorDate,
    authorEmail,
    authorName,
    committerDate,
    committerEmail,
    committerName,
  ] = commitString.split(PART_SEPERATOR);

  let commit = {
    subject: subject.trim(),
    body: body.trim(),
    refs: parseRefs(refs),
    hash: {
      long: commitHash,
      short: commitShortHash,
    },
    tree: {
      long: treeHash,
      short: shortTreeHash,
    },
    author: {
      date: new Date(authorDate),
      email: authorEmail,
      name: authorName,
    },
    committer: {
      date: new Date(committerDate),
      email: committerEmail,
      name: committerName,
    },
  };

  return commit;
}


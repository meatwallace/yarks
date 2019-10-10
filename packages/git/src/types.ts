export interface Git {
  add(files: Array<string>, options?: GitAddOptions): Promise<void>;
  commit(message: string, options?: GitCommitOptions): Promise<void>;
  lsFiles(files: Array<string>): Promise<Array<string>>;
  log(options?: GitLogOptions): Promise<Array<GitCommit>>;
  push(origin: string, branch: string): Promise<void>;
  revParse(rev: string): Promise<string>;
  tag(tag: string, options?: GitTagOptions): Promise<void>;
  tags(options?: GitTagsOptions): Promise<Array<string>>;
}

type GitLogOptions = {
  cwd?: string;
  path?: string;
  range?: string;
};

type GitCommitOptions = {
  cwd?: string;
};

type GitAddOptions = {
  cwd?: string;
};

type GitTagOptions = {
  cwd?: string;
};

type GitTagsOptions = {
  cwd?: string;
};

export type GitCommit = {
  hash: GitSha1;
  tree: GitSha1;
  author: GitCommitUserInfo;
  committer: GitCommitUserInfo;
  subject: string;
  body: string;
  refs: GitRefs;
};

export type GitCommitUserInfo = {
  date: Date;
  email: string;
  name: string;
};

export type GitSha1 = {
  long: string;
  short: string;
};

export type GitRefs = {
  tags: Array<string>;
};

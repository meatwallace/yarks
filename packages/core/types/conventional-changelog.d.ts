/// <reference types="node" />

type ConventionalCommit = {
  type: string;
  scope: string | null;
  subject: string;
  merge: CommitMergeInfo | null;
  header: string;
  body: string | null;
  footer: string | null;
  notes: Array<CommitNote>;
  references: Array<CommitReference>;
  mentions: Array<string>;
  revert: CommitRevertInfo | null;
};

type CommitMergeInfo = {
  [correspondence: string]: string;
};

type CommitNote = {
  title: string;
  text: string;
};

type CommitReference = {
  action: string;
  owner: string | null;
  repository: string | null;
  issue: string;
  raw: string;
  prefix: string;
};

type CommitRevertInfo = {
  header: string;
  hash: string;
};

declare module 'conventional-commits-filter' {
  export type Commit = ConventionalCommit;

  function conventionalCommitsFilter(
    commits: Array<ConventionalCommit>,
  ): Array<ConventionalCommit>;

  export default conventionalCommitsFilter;
}

declare module 'conventional-commits-parser' {
  import * as stream from 'stream';

  export type Commit = ConventionalCommit;

  export type Options = {
    mergePattern?: RegExp | string;
    mergeCorrespondence?: Array<string> | string;
    headerPattern?: RegExp | string;
    headerCorrespondence?: Array<string> | string;
    referenceActions?: Array<string> | string;
    issuePrefixes?: Array<string> | string;
    noteKeywords?: Array<string> | string;
    fieldPattern?: RegExp | string;
    revertCorrespondence?: Array<string> | string;
    commentChar?: string;
    warn?: boolean | LogFunction;
  };

  type LogFunction = (message: string) => void;

  function conventionalCommitsParser(options: Options): stream.Transform;

  namespace conventionalCommitsParser {
    export function sync(
      commitMessage: string,
      options?: Options,
    ): ConventionalCommit;
  }

  export default conventionalCommitsParser;
}

declare module 'conventional-changelog-writer' {
  import * as stream from 'stream';

  export type Commit = ConventionalCommit;

  export type Context = {
    version: string;
    title?: string;
    isPatch?: boolean;
    host?: string;
    owner?: string;
    repository?: string;
    repoUrl?: string;
    linkReferences?: boolean;
    commit?: string;
    issue?: string;
    date?: string;
  };

  // TODO: verify sort function signature
  type SortFunction = (a: string, b: string) => string;
  type SortOption = boolean | string | Array<string> | SortFunction;

  export type Options = {
    transform?: any;
    groupBy?: string;
    commitGroupsSort?: SortOption;
    commitsSort: SortOption;
    noteGroupsSort: SortOption;
    notesSort: SortOption;
    // TODO: add function signatures
    // generateOn: string;
    // finalizeContext: () => void;
    // debug: () => void;
    reverse?: boolean;
    includeDetails?: boolean;
    ignoreReverted?: boolean;
    doFlush?: boolean;
    mainTemplate?: string;
    headerPartial?: string;
    commitPartial?: string;
    footerPartial?: string;
    partials: {
      [partial: string]: string;
    };
  };

  function conventionalChangelogWriter(
    context: Context,
    options: Options,
  ): stream.Transform;

  export default conventionalChangelogWriter;
}

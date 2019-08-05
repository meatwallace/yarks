import { Commit } from 'conventional-changelog-parser';

export function createMockCommit(overrides: Partial<Commit> = {}): Commit {
  let commit = {
    type: 'feat',
    scope: 'example',
    subject: 'changed a thing',
    merge: null,
    header: 'feat(example): changed a thing',
    body: null,
    footer: 'closes #20',
    notes: [],
    mentions: [],
    references: [
      {
        action: 'closes',
        owner: null,
        repository: null,
        issue: '20',
        raw: '#20',
        prefix: '#',
      },
    ],
    revert: null,
    ...overrides,
  };

  return commit;
}

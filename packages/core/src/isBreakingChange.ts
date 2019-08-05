import { Commit } from 'conventional-commits-parser';

const BREAKING_CHANGE_REGEXP = new RegExp(/^BREAKING/);

export function isBreakingChange(commit: Commit): boolean {
  if (commit.notes.length === 0) {
    return false;
  }

  return commit.notes.some((note) => BREAKING_CHANGE_REGEXP.test(note.title));
}

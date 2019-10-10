import { createMatchReducer } from './createMatchReducer';

const TAG_EXTRACTION_REGEXP = /tag: (.+)\)/;
const reduceTags = createMatchReducer(TAG_EXTRACTION_REGEXP);

export function parseTags(refsItems: Array<string>): Array<string> {
  let tags = refsItems.reduce(reduceTags, []);

  return tags;
}

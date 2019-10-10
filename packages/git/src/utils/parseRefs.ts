import { parseTags } from './parseTags';
import { GitRefs } from '../types';

export function parseRefs(refsString?: string): GitRefs {
  if (!refsString) {
    return { tags: [] };
  }

  let refsItems = refsString.split(',');

  let refs = {
    tags: parseTags(refsItems),
  };

  return refs;
}


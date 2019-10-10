export function createMatchReducer(matcher: RegExp) {
  const reduceMatches = (matches: Array<string>, item: string) => {
    let match = matcher.exec(item);

    if (match) {
      matches.push(match[1]);
    }

    return matches;
  };

  return reduceMatches;
}

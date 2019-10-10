import execa from 'execa';

export async function revParse(rev: string): Promise<string> {
  let result = await execa('git', ['rev-parse', rev]);

  return result.stdout;
}

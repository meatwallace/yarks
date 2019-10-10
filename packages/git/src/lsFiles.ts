import execa from 'execa';

export async function lsFiles(files: Array<string>): Promise<Array<string>> {
  if (files.length === 0) {
    return [];
  }

  let output = await execa('git', ['ls-files', '-m', '-o', ...files]);

  return output.stdout
    .split('\n')
    .map((file: string) => file.trim())
    .filter((file: string) => Boolean(file));
}

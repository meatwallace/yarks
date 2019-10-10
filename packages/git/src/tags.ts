import execa from 'execa';

type Options = {
  cwd?: string;
};

const defaultOptions = {
  cwd: process.cwd(),
};

export async function tags(options: Options): Promise<Array<string>> {
  let finalOptions = { ...defaultOptions, ...options };

  let output = await execa('git', ['tag'], { cwd: finalOptions.cwd });

  let tags = output.stdout.split('\n').filter(Boolean);

  return tags;
}

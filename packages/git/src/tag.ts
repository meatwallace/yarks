import execa from 'execa';

type Options = {
  cwd?: string;
};

const defaultOptions = {
  cwd: process.cwd(),
};

export async function tag(tag: string, options: Options): Promise<void> {
  let finalOptions = { ...defaultOptions, ...options };

  await execa('git', ['tag', tag], { cwd: finalOptions.cwd });
}

import execa from 'execa';

type Options = {
  cwd?: string;
};

const defaultOptions = {
  cwd: process.cwd(),
};

export async function add(
  files: Array<string>,
  options?: Options,
): Promise<void> {
  let finalOptions = { ...defaultOptions, ...options };

  await execa('git', ['add', '--force', '--ignore-errors', ...files], {
    cwd: finalOptions.cwd,
  });
}

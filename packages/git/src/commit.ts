import execa from 'execa';

type Options = {
  cwd?: string;
};

const defaultOptions = {
  cwd: process.cwd(),
};

export async function commit(
  message: string,
  options?: Options,
): Promise<void> {
  let finalOptions = { ...defaultOptions, ...options };

  await execa('git', ['commit', '-m', message], { cwd: finalOptions.cwd });
}

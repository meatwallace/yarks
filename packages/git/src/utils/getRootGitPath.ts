import execa from 'execa';

type Options = {
  cwd: string;
};

export async function getRootGitPath(options: Options): Promise<string> {
  let output = await execa('git', ['rev-parse', '--show-toplevel'], {
    cwd: options.cwd,
  });

  return output.stdout;
}

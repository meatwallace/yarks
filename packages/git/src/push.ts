import execa from 'execa';

export async function push(remote: string, branch: string): Promise<void> {
  await execa('git', ['push', '--tags', remote, `HEAD:${branch}`]);
}

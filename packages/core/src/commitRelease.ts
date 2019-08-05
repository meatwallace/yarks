import { Environment, Options, WorkspaceReleaseContext } from './types';

export async function commitRelease(
  workspace: WorkspaceReleaseContext,
  options: Options,
  env: Environment,
) {
  await options.git.commit({
    dir: options.cwd,
    message: `chore(release): ${workspace.nextTag} [skip ci]`,
    author: {
      name: env.GIT_AUTHOR_NAME,
      email: env.GIT_AUTHOR_EMAIL,
    },
  });
}

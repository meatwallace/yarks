import { pushGitRef } from './pushGitRef';

export async function pushChanges(workspace, options, env) {
  // TODO(#25): provide option for configuring release branch
  await pushGitRef('master', options, env);

  // push tag
  await pushGitRef(workspace.nextTag, options, env);
}

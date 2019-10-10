import { Options } from './types';

export async function pushChanges(options: Options): Promise<void> {
  // TODO(#25): provide option for configuring release branch
  await options.git.push('origin', 'master');
}

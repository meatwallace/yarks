export async function pushGitRef(ref, options, env) {
  let result = await options.git.push({
    dir: options.cwd,
    ref,
    token: env.GITHUB_TOKEN,
    // TODO(#26): accomodate other git hosts and other repository URL formats
    url: options.repositoryURL,
  });

  return result;
}

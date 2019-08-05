import { PackageJson } from 'type-fest';
// import invariant from 'tiny-invariant';

// TODO(#26): accomodate other git hosts and repository url formats
export function getManifestRepositoryURL(manifest: PackageJson): string {
  // invariant(
  //   manifest.repository,
  //   'workspace manifest must include a valid repository field',
  // );

  // TODO: replace with invariant when tiny-invariant supports typescript
  if (!manifest.repository) {
    throw new Error('workspace manifest must include a valid repository field');
  }

  let repositoryURL =
    typeof manifest.repository === 'string'
      ? manifest.repository
      : manifest.repository.url;

  return repositoryURL;
}

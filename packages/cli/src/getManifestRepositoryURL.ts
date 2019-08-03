import { WorkspaceManifest } from '@yarks/core';

// TODO(#26): accomodate other git hosts and repository url formats
export function getManifestRepositoryURL(manifest: WorkspaceManifest): string {
  let repositoryURL = manifest.repository && manifest.repository.url;

  return repositoryURL;
}

import { PackageJson } from 'type-fest';

export function createMockManifest(
  overrides: Partial<PackageJson> = {},
): PackageJson {
  let manifest = {
    repository: {
      type: 'git',
      url: 'https://github.com/mock/project.git',
    },
    ...overrides,
  };

  return manifest;
}

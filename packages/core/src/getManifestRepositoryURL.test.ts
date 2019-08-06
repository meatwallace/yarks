import { getManifestRepositoryURL } from './getManifestRepositoryURL';
import { createMockManifest } from './test-helpers/createMockManifest';

const repositoryURL = 'https://github.com/mock/project.git';

test(`it returns the value of the manifests's 'repository' field if its a string`, () => {
  expect.assertions(1);

  let manifest = createMockManifest({ repository: repositoryURL });

  let result = getManifestRepositoryURL(manifest);

  expect(result).toBe(repositoryURL);
});

test(`it returns the value of the manifest's 'repository.url' field if it's an object`, () => {
  expect.assertions(1);

  let manifest = createMockManifest({
    repository: {
      type: 'git',
      url: repositoryURL,
    },
  });

  let result = getManifestRepositoryURL(manifest);

  expect(result).toBe(repositoryURL);
});

test(`it throws an error if the manifest's 'repository' field is missing`, () => {
  expect.assertions(1);

  expect(() => getManifestRepositoryURL({})).toThrow();
});

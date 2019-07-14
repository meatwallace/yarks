# :package: yarks

> automated package version management and publishing workflow for Yarn v2
> (Berry) projects

`yarks` aims to fill the gap left by
[`semantic-release`](https://github.com/semantic-release/semantic-release) when
using [Yarn v2 (Berry)](https://yarnpkg.github.io/berry/), automating a "common"
package release workflow that is compatible with both single package
repositories and monorepos that are powered by Yarn's
[workspaces](https://yarnpkg.github.io/berry/features/workspaces).

## :zap: Quick Start

To quickly see how `yarks` would release your current project:

```shell
yarn dlx @yarks/cli release-workspaces
```

For ongoing usage, it's recommended you add `yarks` to your dependencies and run
it from there:

```shell
yarn add @yarks/cli --dev
yarn release-workspaces
```

When releasing, `yarks` expects the following environment variables to be set:

```shell
export NPM_TOKEN="your NPM token for publishing"
export GITHUB_TOKEN="your GitHub token with push access to your project's repo"
export GIT_AUTHOR_NAME="the name used to author the release commits"
export GIT_AUTHOR_EMAIL="the email used to author the release commits"
```

By default, `yarks` will only release packages when ran inside a CI environment.
To release locally, this behaviour can be mimiced by setting your `CI`
environment variable to `true`:

```shell
export CI=true
yarn release-workspaces
```

## :question: Why yarks?

`yarks` automates your release workflow:

- Processes your commits using
  [`conventional-changelog`](https://github.com/conventional-changelog/conventional-changelog)
- Writes release notes to your workspaces' `CHANGELOG.md`
- Bumps your workspaces' versions following the
  [semantic versioning](https://semver.org/) specification
- Publishes your workspace package updates to the NPM registry
- Commits your new version and pushes it back to your git repository

### :thinking: Why not `semantic-release`?

While `semantic-release` _can_ be used with any package manager in any
repository configuration, there are
[caveats](https://github.com/semantic-release/semantic-release/issues/193) when
used in conjunction with Yarn workspaces that require
[brittle](https://github.com/Updater/semantic-release-monorepo)
[hacks](https://github.com/qiwi/semantic-release-monorepo-hooks)
[and](https://github.com/atlassian/lerna-semantic-release)
[workarounds](https://github.com/dhoulb/multi-semantic-release), all of which
are incompatible with Yarn v2. `yarks` is specifically built to address these
caveats and offer a robust solution that treats Yarn v2 & workspaces as
first-class citizens.

### :microscope: What problems does `yarks` solve?

When working in a monorepo, a reliable release strategy requires centralized
coordination to ensure workspaces that depend on sibling workspaces are queued
for release as needed, and all workspaces are evaluated before final versions
are applied and the release process begins.

If workspaces are simply processed and released sequentially, workspaces that
depend on sibling workspaces may not be released when they should be, or if they
_are_ released, may depend on the incorrect versions of sibling workspaces,
potentially introducing errors that would likely be missed by your tests.

### :gem: What makes `yarks` different?

Rather than shoehorning Yarn workspaces into another `semantic-release`-based
workaround, `yarks` addresses the aforementioned issues, avoids any form of
brittle integration and uses it's own release strategy, and interfaces with Yarn
itself. The initial goal is to create a _reliable_ tool that's been designed
with intention and tailored to the problem, rather providing another short-term
workaround.

### :clipboard: Release Strategy

The process begins by collating workspace and git metadata to determine the
release strategy:

1. Create a list of workspaces including the root of the project, allowing usage
   with single package repositories and workspace-based monorepos
2. Filter out workspaces that are flagged as `private`
3. For each workspace, find the latest git tag that match the pattern
   `package-name@x.x.x` that's available, if any
4. Parse the commits that modified each workspace since the last release (or the
   first commit if there is no previous release) using
   [`conventional-changelog`](https://github.com/conventional-changelog/conventional-changelog)
   and determine what type of release is required, if any
5. Check if each workspace's workspace dependencies have changed, and determine
   additional releases as required
6. For each release required, log the release type, new version, and the
   relevant changes
7. If on CI, increment workspace versions as needed

When all workspaces have been processed, if we are executing in a CI
environment, release each workspace sequentially:

1. Ammend or write a `CHANGELOG.md` to the workspace
2. Publish the workspace to the package registry
3. Commit and tag the workspace, then push the changes to your remote repository
4. Publish a GitHub release

## :telescope: Project Goals

Although `yarks` is currently a simplistic release automation tool, it's roadmap
is positioned towards maturing into a lightweight and flexible Yarn workspaces
task runner. At a high level, the development milestones look like:

1. **Release automation**: serves as a drop in replacement for
   `semantic-release` that accounts for monorepo nuances, with 'essentials' such
   as changelog generation, semantic versioning, and package publishing
2. **Plugin driven**: the initial release strategy is extracted to optional
   plugins to be used via a streamlined core API and CLI, similar to
   `semantic-release`'s current architecture
3. **Generic task running**: expansion of the core API, CLI, and plugins to
   facilitate generic task execution with access to workspace related context
   and convenience APIs

## :hammer_and_wrench: Contributing

### :speech_balloon: Code of Conduct

`yarks` has adopted a [Code of Conduct](./CODE_OF_CONDUCT.md) that we expect
project participants to adhere to. TODO

### :book: Contributing Guide

Read the [contributing guide](./CONTRIBUTING.md) to learn about the development
process, how to propose bug fixes and improvements, and how to build and test
your changes to `yarks`

## :scroll: License

All `yarks` related packages are [MIT licensed](./LICENSE).

## :books: Prior Art

- [`semantic-release`](https://github.com/semantic-release/semantic-release)
- [`lerna-semantic-release`](https://github.com/atlassian/lerna-semantic-release)
- [`semantic-release-monorepo`](https://github.com/Updater/semantic-release-monorepo)
- [`semantic-release-monorepo-hooks`](https://github.com/qiwi/semantic-release-monorepo-hooks)
- [`multi-semantic-release`](https://github.com/dhoulb/multi-semantic-release)

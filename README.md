# yarks

> automated package releasing workflow with Yarn v2 (Berry)

`yarks` automates the process of publishing NPM packages and accompanying GitHub
releases using Yarn v2's (Berry) workspaces, including automatic
[semantic versioning](http://semver.org/) and changelog generation.

## Usage

Prerequisites:

- node >=10.0.0
- yarn >=2.0.0
- `@berry/plugin-version`

```sh
yarn dlx yarks release-workspaces
```

## Overview

This tool was quickly hacked together as a Yarn Berry & workspaces compatible
replacement for
[`semantic-release`](https://github.com/semantic-release/semantic-release),
however the initial implementation is quite inflexible and lacks configuration
and modularity, following a strict package release strategy documented below.

### Release Strategy

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

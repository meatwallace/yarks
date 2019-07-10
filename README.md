# @meatwallace/release-yarn-workspaces

CLI that automates the process of publishing NPM packages and accompanying
GitHub releases using Yarn Berry's (v2) workspaces, including automatic semantic
versioning and changelog generation.

## Overview

This tool was quickly hacked together as a replacement for `semantic-release`
for my own specific publishing strategy, so it is quite inflexible re:
configuration & modularity. The release process currently looks like:

1. Create a list of workspaces including the root of the project, allowing for
   both single package repositories and workspace monorepos
2. Filter out workspaces that are flagged as `private`
3. For each workspace, finds the latest git tag that match the pattern
   `package-name@x.x.x` that's available (if any)
4. Parse the commits that effected each workspace since the last release if
   available (or the first commit if not) using `conventional-changelog` and
   determine what type of release is required, if any
5. Determine if a workspace's workspace dependencies have changed, and
   reeevaluate what releases are required
6. Log the relevant changes for each release that's required and the release
   type that will be used, and exit if not executing on CI

When all workspaces have been processed, begin each release in a sequential
manner:

1. Ammend or write a `CHANGELOG.md` to the workspace
2. Publish the workspace to the package registry
3. Commit and tag the workspace, then push the changes to your remote repository

## Prerequisites

- node >=12.0.0
- yarn >=2.0.0

## Usage

```sh
yarn dlx release-yarn-workspaces
```

## Run tests

```sh
yarn test
```

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check
[issues page](https://github.com/meatwallace/release-yarn-workspaces/issues).

## License

Copyright © 2019
[Geoff Whatley <me@geoffwhatley.com> (https://geoffwhatley.com/)](https://github.com/meatwallace).

This project is
[MIT](https://github.com/meatwallace/release-yarn-workspaces/blob/master/LICENSE)
licensed.


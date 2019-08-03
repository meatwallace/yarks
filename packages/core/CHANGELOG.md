# @yarks/core

## 1.1.1 (2019-08-03)

### Bug Fixes

- **core:** include dist directory in published files
  ([eba7375](https://github.com/meatwallace/yarks/commit/eba7375))
- **git:** remove hardcoded ref from push function
  ([8ce86d4](https://github.com/meatwallace/yarks/commit/8ce86d4))
- **tags:** use next release's tag as ref when pushing
  ([ac891c7](https://github.com/meatwallace/yarks/commit/ac891c7))

# 1.1.0 (2019-08-03)

### Bug Fixes

- **versioning:** bump workspace versions prior to publishing
  ([3363fc3](https://github.com/meatwallace/yarks/commit/3363fc3)), closes
  [#49](https://github.com/meatwallace/yarks/issues/49)

### Features

- **git:** push git tag of each release
  ([8e32340](https://github.com/meatwallace/yarks/commit/8e32340)), closes
  [#29](https://github.com/meatwallace/yarks/issues/29)
- **workspaces:** release dependent sibling workspaces
  ([b4ed8d5](https://github.com/meatwallace/yarks/commit/b4ed8d5)), closes
  [#16](https://github.com/meatwallace/yarks/issues/16)

# 1.0.0 (2019-08-01)

### Bug Fixes

- **publish:** remove trailing slash from hardcoded registry url
  ([d3a3d4e](https://github.com/meatwallace/yarks/commit/d3a3d4e)), closes
  [#46](https://github.com/meatwallace/yarks/issues/46)

### Features

- **packages:** split core api and cli into seperate workspaces
  ([e28146b](https://github.com/meatwallace/yarks/commit/e28146b)), closes
  [#14](https://github.com/meatwallace/yarks/issues/14)
  [#2](https://github.com/meatwallace/yarks/issues/2)

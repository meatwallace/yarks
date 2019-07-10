module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': 'pretty-staged --quick',
    'post-commit': 'git update-index --again',
  },
};

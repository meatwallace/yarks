import { log } from './log';

async function setupTest() {
  // TODO: scaffold a fake git repo and log the commits
}

test.skip('it returns an array of commit objects', async () => {
  await setupTest();

  let commits = await log();

  expect(commits).toBe(true);
});

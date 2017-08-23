#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import gitRemoteOriginUrl from 'git-remote-origin-url';
import getUrlFromGitRemote from './lib/git';
import gitlabCI from './lib/gitlab-ci';
import loadPropertiesFile from './lib/properties-file';

const gitlabEnvFileName = 'gitlab.env.yml';

async function execute(cmd) {
  const errors = [];

  // Check for token
  if (cmd.token === undefined) {
    errors.push('No Gitlab token given.');
  }

  // If there is no url provided, get it!
  let url = cmd.url;
  if (!url) {
    try {
      url = await getUrlFromGitRemote(gitRemoteOriginUrl);
      console.log('No URL specified, using git remote `origin`.');
    } catch (err) {
      errors.push('No Gitlab project URL given.');
    }
  }

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const cwd = process.cwd();
  const path = `${cwd}/${gitlabEnvFileName}`;

  if (!fs.existsSync(path)) {
    console.error(`${gitlabEnvFileName} does not exist`);
    process.exit(1);
  }

  // By default, force update for existing variables
  let forceUpdate = true;
  if (cmd.doNotForce) {
    forceUpdate = false;
  }

  const properties = loadPropertiesFile(path);
  const handler = gitlabCI(url, cmd.token);
  await handler.setVariables(properties, forceUpdate);

  console.log('Completed setting variables on Gitlab CI.');
}

program
  .description('Read all key/value pairs under gitlab.env.yml on the current directory and sets them as environment variables on Gitlab CI')
  .option(
    '--url <url>',
    'Your Gitlab project URL, e.g. https://gitlab.com/gitlab-org/gitlab-ce',
  )
  .option(
    '--token <token>',
    'Your Gitlab token.',
  )
  .option(
    '--do-not-force',
    'Ignore variables if they already exist on gitlab CI. By default all variables are overridden',
  );

program.parse(process.argv);

if (!process.argv.slice(1).length) {
  program.outputHelp();
}

execute(program);

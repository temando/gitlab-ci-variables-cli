#!/usr/bin/env node

import program from 'commander';
import { getConf, getProperties } from './lib/utils';
import gitlabCI from './lib/gitlab-ci';

async function execute(cmd) {
  const conf = await getConf();

  const properties = getProperties();
  const handler = gitlabCI(conf.url, conf.token);
  const resp = await handler.setVariables(properties, !cmd.doNotForce);

  console.log('Completed setting variables on Gitlab CI.');
  return resp;
}

program
  .description('Read all key/value pairs under gitlab.env.yml on the current directory and sets them as environment variables on Gitlab CI')
  .option(
    '--url <url>',
    'Your Gitlab project URL, e.g. https://gitlab.com/gitlab-org/gitlab-ce',
  )
  .option(
    '--token <token>',
    'Your Gitlab token',
  )
  .option(
    '--do-not-force',
    'Ignore variables if they already exist on gitlab CI. By default all variables are overridden',
  )
  .parse(process.argv);

execute(program);

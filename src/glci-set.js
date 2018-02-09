#!/usr/bin/env node

import program from 'commander';
import { getConf } from './lib/utils';
import gitlabCI from './lib/gitlab-ci';

async function execute(cmd) {
  let resp = null;
  const conf = await getConf();

  if (!conf.key || !conf.value) {
    console.error('No key/value pair given.');
    process.exit(1);
  }

  const handler = gitlabCI(conf.url, conf.token);

  const existingKeys = (await handler.listVariables()).map(variable => variable.key);

  const keyExists = existingKeys.includes(conf.key);

  if (keyExists && cmd.doNotForce) {
    console.log(`Skipping ${conf.key}, already set.`);
    return undefined;
  }

  if (keyExists) {
    resp = await handler.updateVariable(conf.key, conf.value);
  } else {
    resp = await handler.createVariable(conf.key, conf.value);
  }

  console.log('Completed setting variable on Gitlab CI.');
  return resp;
}

program
  .description('Set given key/value pair as environment variables on Gitlab CI')
  .option(
    '--url <url>',
    'Your Gitlab project URL, e.g. https://gitlab.com/gitlab-org/gitlab-ce',
  )
  .option(
    '--token <token>',
    'Your Gitlab token',
  )
  .option(
    '--key <key>',
    'Your Gitlab CI variable',
  )
  .option(
    '--value <value>',
    'Your Gitlab CI value',
  )
  .option(
    '--do-not-force',
    'Ignore variable if it already exists on gitlab CI. By default variable is overridden',
  )
  .parse(process.argv);

execute(program);

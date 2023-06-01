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

  const isProtected = Boolean(cmd.protected);
  const masked = Boolean(cmd.masked);
  const raw = Boolean(cmd.raw);
  const scope = cmd.environmentScope !== undefined ? cmd.environmentScope : '*';

  if (keyExists && cmd.doNotForce) {
    console.log(`Skipping ${conf.key}, already set.`);
    return undefined;
  }

  if (keyExists) {
    resp = await handler.updateVariable(conf.key, conf.value, isProtected, masked, raw, scope);
  } else {
    resp = await handler.createVariable(conf.key, conf.value, isProtected, masked, raw, scope);
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
    '--protected',
    'Set the variable as protected. By default it is not protected',
  )
  .option(
    '--masked',
    'Set the variable as masked. By default it is not masked',
  )
  .option(
    '--raw',
    'Set the variable as raw. By default it is not raw',
  )
  .option(
    '--environment-scope <environment-scope>',
    'Set the environment scope. By default it is set to *',
  )
  .parse(process.argv);

execute(program);

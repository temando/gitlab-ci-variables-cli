#!/usr/bin/env node

import program from 'commander';
import { getConf } from './lib/utils';
import { savePropertiesFile } from './lib/properties-file';
import gitlabCI from './lib/gitlab-ci';

async function execute() {
  const conf = await getConf();

  const handler = gitlabCI(conf.url, conf.token);
  const resp = await handler.listVariables();

  console.log('Downloaded variables from Gitlab CI.');

  savePropertiesFile(`${process.cwd()}/conf.out`, resp);

  console.log(`Saved variables to ${conf.out}`);

  return resp;
}

program
  .description('Read all key/value pairs from Gitlab API and saves them to the specified .yml file')
  .option(
    '--url <url>',
    'Your Gitlab project URL, e.g. https://gitlab.com/gitlab-org/gitlab-ce',
  )
  .option(
    '--token <token>',
    'Your Gitlab token.',
  )
  .option(
    '--out <out>',
    'The location to save CI values to.',
    'gitlab.env.yml',
  )
  .parse(process.argv);

execute(program);

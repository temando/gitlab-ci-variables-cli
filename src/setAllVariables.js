#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import loadPropertiesFile from './lib/properties-file';
import gitlabCI from './lib/gitlab-ci';

const gitlabEnvFileName = 'gitlab.env.yml';

/**
 * Validate CLI options
 *
 * @param {Object} options
 * @return {Array} array of errors. Empty array if no errors
 */
function validate(options = {}) {
  const errors = [];

  if (options.url === undefined) {
    errors.push('No Gitlab project URL given.');
  }

  if (options.token === undefined) {
    errors.push('No Gitlab token given.');
  }

  return errors;
}

async function execute(cmd) {
  const errors = validate(cmd);
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
  if (cmd.donotforce) {
    forceUpdate = false;
  }

  const properties = loadPropertiesFile(path);
  const handler = gitlabCI(cmd.url, cmd.token);
  await handler.setVariables(properties, forceUpdate);

  console.log('Completed setting variables on Gitlab CI.');
}

program
  .description('Read all key/value pairs under gitlab.env.yml on the current directory and sets them as environment variables on Gitlab CI')
  .option(
    '--url <url>',
    'Your Gitlab project URL, e.g. https://src.temando.io/khoa.tran/temando-field-manual-tome',
  )
  .option(
    '--token <token>',
    'Your Gitlab token.',
  )
  .option(
    '--donotforce',
    'Ignore variables if they already exist on gitlab CI. By default all variables are overridden',
  );

program.parse(process.argv);

if (!process.argv.slice(1).length) {
  program.outputHelp();
}

execute(program);

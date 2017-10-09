#!/usr/bin/env node

import program from 'commander';

program
  .version('0.1.0')
  .command('sv', 'set a variable')
  .command('sav', 'set all variables')
  .parse(process.argv);


if (!process.argv.slice(1).length) {
  program.outputHelp();
}

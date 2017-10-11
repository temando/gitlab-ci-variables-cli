#!/usr/bin/env node

import program from 'commander';
import npmPackage from '../package.json';

program
  .version(npmPackage.version)
  .command('sv', 'set a variable')
  .command('sav', 'set all variables')
  .parse(process.argv);


if (!process.argv.slice(1).length) {
  program.outputHelp();
}

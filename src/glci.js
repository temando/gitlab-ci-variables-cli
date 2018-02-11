#!/usr/bin/env node

import program from 'commander';
import npmPackage from '../package.json';

program
  .version(npmPackage.version)
  .command('set', 'set a variable')
  .command('setAll', 'set all variables')
  .command('getAll', 'load all variables')
  .parse(process.argv);

if (!process.argv.slice(1).length) {
  program.outputHelp();
}

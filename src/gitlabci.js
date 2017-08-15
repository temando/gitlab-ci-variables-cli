#!/usr/bin/env node

import program from 'commander'

program
  .version(require('../package.json').version)
  .command('variables <option>', 'Handles gitlab CI variables')
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

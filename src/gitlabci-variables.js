#!/usr/bin/env node

import program from 'commander'

program
  .command('setAll')
  .description('Read all key/value pairs under gitlab.env.yml on the current directory and sets them as environment variables on Gitlab CI')
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

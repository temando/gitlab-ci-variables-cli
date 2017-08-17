# Gitlab CI Variables Bulk Setter

[![NPM](https://img.shields.io/npm/v/gitlab-ci-variables-setter-cli.svg)](https://npmjs.org/packages/gitlab-ci-variables-setter-cli/)
[![Travis CI](https://img.shields.io/travis/quangkhoa/gitlab-ci-variables-cli.svg)](https://travis-ci.org/quangkhoa/gitlab-ci-variables-cli)
[![MIT License](https://img.shields.io/github/license/quangkhoa/gitlab-ci-variables-cli.svg)](https://en.wikipedia.org/wiki/MIT_License)

CLI tool to allow setting multiple environment variables on Gitlab CI, instead of going through Gitlab UI and adding individual variables.

## Installation

Install the tool globally for ease of use, by running the following command

```sh
$ npm install -g gitlab-ci-variables-setter-cli
```

## Usage

- Put all required variable key/values on a properties file named `gitlab.env.yml`. For an example of the file format, check out `test/fixtures/test.yml`.

- Run the following command from the directory that contains the properties file:

```sh
$ setAllVars --url <gitlab-project-url> --token <gitlab-token>
```

where `gitlab-project-url` is the url to view your project on gitlab, e.g. https://src.temando.io/khoa.tran/temando-field-manual-tome

By default, all existing variables on gitlab ci will be overridden. If you wish to ignore those existing variables, add a `--donotforce` option, i.e.

```sh
$ setAllVars --url <gitlab-project-url> --token <gitlab-token> --donotforce
```

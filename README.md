# Gitlab CI Variables Bulk Setter

[![NPM](https://img.shields.io/npm/v/gitlab-ci-variables-setter-cli.svg)](https://npmjs.org/packages/gitlab-ci-variables-setter-cli/)
[![Travis CI](https://img.shields.io/travis/temando/gitlab-ci-variables-cli.svg)](https://travis-ci.org/temando/gitlab-ci-variables-cli)
[![MIT License](https://img.shields.io/github/license/temando/gitlab-ci-variables-cli.svg)](https://en.wikipedia.org/wiki/MIT_License)

CLI tool to allow setting multiple environment variables on Gitlab CI, instead of going through Gitlab UI and adding individual variables.

## Installation

Install the tool globally for ease of use, by running the following command

```sh
$ npm install -g gitlab-ci-variables-setter-cli
```

## Usage

- Put all required variable key/values on a properties file named `gitlab.env.yml`. For example:

```yml
AWS_CREDENTIALS: |
    [canary]
    aws_access_key_id = AKIA1234
    aws_secret_access_key = verySecretKey
NPM_INSTALL_TOKEN: 123456789
```

Note that the value for `AWS_CREDENTIALS` is a multi line string (with spaces and no tabs).

- Run the following command from the directory that contains the properties file:

```sh
$ setAllVars --url <gitlab-project-url> --token <gitlab-token>
```

where `gitlab-project-url` is the url to view your project on gitlab, e.g. https://gitlab.com/gitlab-org/gitlab-ce

By default, all existing variables on gitlab ci will be overridden. If you wish to ignore those existing variables, add a `--do-not-force` option, i.e.

```sh
$ setAllVars --url <gitlab-project-url> --token <gitlab-token> --do-not-force
```

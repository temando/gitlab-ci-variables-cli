# Gitlab CI Variables Setter CLI

[![NPM](https://img.shields.io/npm/v/gitlab-ci-variables-setter-cli.svg)](https://npmjs.org/packages/gitlab-ci-variables-setter-cli/)
[![Travis CI](https://img.shields.io/travis/temando/gitlab-ci-variables-cli.svg)](https://travis-ci.org/temando/gitlab-ci-variables-cli)
[![MIT License](https://img.shields.io/github/license/temando/gitlab-ci-variables-cli.svg)](https://en.wikipedia.org/wiki/MIT_License)

CLI tool to allow setting multiple pipeline variables on Gitlab CI, instead of going through Gitlab UI and adding individual variables.

Supports Gitlab API v4, available since Gitlab 9.0.

## Installation

Install the tool globally for ease of use, by running the following command

```sh
$ npm install -g gitlab-ci-variables-setter-cli
```

## Usage

Put all required variable key/values on a properties file named `gitlab.env.yml`, e.g:

```yml
AWS_CREDENTIALS: |
    [canary]
    aws_access_key_id = AKIA1234
    aws_secret_access_key = verySecretKey
NPM_INSTALL_TOKEN: 123456789
```

> Note that the value for `AWS_CREDENTIALS` is a multi line string (with spaces and no tabs).

Run the following command from the directory that contains the properties file, where:

- `gitlab-token` is your Gitlab personal access token
- `gitlab-project-url` is your project url on gitlab, e.g. https://gitlab.com/gitlab-org/gitlab-ce

```sh
$ setAllVars --token <gitlab-token> --url <gitlab-project-url>
Set AWS_CREDENTIALS = <value> for gitlab-org/gitlab-ce.
Set NPM_INSTALL_TOKEN = <value> for gitlab-org/gitlab-ce.
Completed setting variables on Gitlab CI.
```

By default, all existing variables on Gitlab CI will be overridden. If you wish to ignore existing variables, add a `--do-not-force` option, e.g:

```sh
$ setAllVars --token <gitlab-token> --url <gitlab-project-url> --do-not-force
Skipping AWS_CREDENTIALS, already set for gitlab-org/gitlab-ce.
Skipping NPM_INSTALL_TOKEN, already set for gitlab-org/gitlab-ce.
Completed setting variables on Gitlab CI.
```

If your working directory is a git repostory of your project, the `--url` option can be omitted, e.g:

```sh
$ setAllVars --token <gitlab-token>
No URL specified, using git remote `origin`.
Set AWS_CREDENTIALS = <value> for gitlab-org/gitlab-ce.
Set NPM_INSTALL_TOKEN = <value> for gitlab-org/gitlab-ce.
Completed setting variables on Gitlab CI.
```

> Omitting `--url` will derive the URL from the remote named `origin`.

This project supports `.gitlabrc` files using [rc](https://www.npmjs.com/package/rc).
If `--token` is not specified, this project can use a `.gitlabrc`, e.g:

```ini
token = this-is-my-gitlab-token
```

```sh
$ setAllVars --url <gitlab-project-url>
Using token from .gitlabrc.
Set AWS_CREDENTIALS = <value> for gitlab-org/gitlab-ce.
Set NPM_INSTALL_TOKEN = <value> for gitlab-org/gitlab-ce.
Completed setting variables on Gitlab CI.
```

Essentially, if your project is a git repository, and you have `.gitlabrc` file,
no options are required and this tool can be invoked simply as:

```sh
$ setAllVars
No URL specified, using git remote `origin`.
Set AWS_CREDENTIALS = <value> for gitlab-org/gitlab-ce.
Set NPM_INSTALL_TOKEN = <value> for gitlab-org/gitlab-ce.
Completed setting variables on Gitlab CI.
```

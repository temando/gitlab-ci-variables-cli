# Gitlab CI Variables Setter CLI

[![NPM](https://img.shields.io/npm/v/gitlab-ci-variables-cli.svg)](https://npmjs.org/packages/gitlab-ci-variables-cli/)
[![Travis CI](https://img.shields.io/travis/temando/gitlab-ci-variables-cli.svg)](https://travis-ci.org/temando/gitlab-ci-variables-cli)
[![MIT License](https://img.shields.io/github/license/temando/gitlab-ci-variables-cli.svg)](https://en.wikipedia.org/wiki/MIT_License)

CLI tool to allow setting/getting pipeline variables on Gitlab CI.

Supports Gitlab API v4, available since Gitlab 9.0.

## Installation

Install the tool globally for ease of use, by running the following command

```sh
$ npm install -g gitlab-ci-variables-cli
```

## Usage

### Set one variable (`glci set`)

Run the following command, where:

- `gitlab-token` is your Gitlab personal access token
- `gitlab-project-url` is your project url on gitlab, e.g. https://gitlab.com/gitlab-org/gitlab-ce
- `key` is the variable you want to set
- `value` is the value of the variable you want to set

```sh
$ glci set --token <gitlab-token> --url <gitlab-project-url> --key <key> --value <value>
Set <key> = <value> for gitlab-org/gitlab-ce.
Completed setting variable on Gitlab CI.
```

### Set several variables (`glci setAll`)

Put all required variable key/values on a properties file named `gitlab.env.yml`, e.g:

```yml
AWS_CREDENTIALS: |
    [canary]
    aws_access_key_id = AKIA1234
    aws_secret_access_key = verySecretKey
NPM_INSTALL_TOKEN: 123456789
```

> Note that the value for `AWS_CREDENTIALS` is a multi line string (with spaces and no tabs).

Run the following command from the directory that contains the properties file.

```sh
$ glci setAll --token <gitlab-token> --url <gitlab-project-url>
Set AWS_CREDENTIALS = <value> for gitlab-org/gitlab-ce.
Set NPM_INSTALL_TOKEN = <value> for gitlab-org/gitlab-ce.
Completed setting variables on Gitlab CI.
```

- `gitlab-token` is your Gitlab personal access token
- `gitlab-project-url` is your project url on gitlab, e.g. https://gitlab.com/gitlab-org/gitlab-ce

### Get all variables (`glci getAll`)

Download all variable key/value pairs to a properties file.

Run the following command:
```sh
$ glci getAll --token <gitlab-token> --url <gitlab-project-url> --output result.yml
Downloaded variables from Gitlab CI.
Saved variables to result.yml
```

- `gitlab-token` is your Gitlab personal access token
- `gitlab-project-url` is your project url on gitlab, e.g. https://gitlab.com/gitlab-org/gitlab-ce

> Note that if you do not specify `output`, then the properties file will be saved to `gitlab.env.yml` in the current directory.

#### For all usages

##### `--do-not-force`

By default, existing variables on Gitlab CI will be overridden. If you wish to ignore existing variables, add a `--do-not-force` option, e.g:

```sh
$ glci setAll --token <gitlab-token> --url <gitlab-project-url> --do-not-force
Skipping AWS_CREDENTIALS, already set for gitlab-org/gitlab-ce.
Skipping NPM_INSTALL_TOKEN, already set for gitlab-org/gitlab-ce.
Completed setting variables on Gitlab CI.
```

##### `--url`

If your working directory is a git repository of your project, the `--url` option can be omitted, e.g:

```sh
$ glci set --token <gitlab-token> --key <key> --value <value>
No URL specified, using git remote `origin`.
Set <key> = <value> for gitlab-org/gitlab-ce.
Completed setting variable on Gitlab CI.
```

> Omitting `--url` will derive the URL from the remote named `origin`.

##### `--token`

This project supports `.gitlabrc` files using [rc](https://www.npmjs.com/package/rc).
If `--token` is not specified, this project can use a `.gitlabrc`, e.g:

```ini
token = this-is-my-gitlab-token
```

```sh
$ glci setAll --url <gitlab-project-url>
Using token from .gitlabrc.
Set AWS_CREDENTIALS = <value> for gitlab-org/gitlab-ce.
Set NPM_INSTALL_TOKEN = <value> for gitlab-org/gitlab-ce.
Completed setting variables on Gitlab CI.
```

Alternatively, you can also set a GITLAB_TOKEN environment variable:

```sh
$ export GITLAB_TOKEN=this-is-my-gitlab-token
$ glci set --url <gitlab-project-url> --key <key> --value <value>
Using token from environment variable GITLAB_TOKEN.
Set <key> = <value> for gitlab-org/gitlab-ce.
Completed setting variable on Gitlab CI.
```

---

Essentially, if your project is a git repository, and you have a `.gitlabrc` file or a GITLAB_TOKEN env variable,
 this tool can be invoked simply as:

```sh
$ glci setAll
Using token from .gitlabrc.
No URL specified, using git remote `origin`.
Set AWS_CREDENTIALS = <value> for gitlab-org/gitlab-ce.
Set NPM_INSTALL_TOKEN = <value> for gitlab-org/gitlab-ce.
Completed setting variables on Gitlab CI.
```
```sh
$ glci set --key <key> --value <value>
Using token from environment variable GITLAB_TOKEN.
No URL specified, using git remote `origin`.
Set <key> = <value> for gitlab-org/gitlab-ce.
Completed setting variable on Gitlab CI.
```

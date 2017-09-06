# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Fixed

- Only serialise non-primitive values (such as object and function).

## [v1.1.1] - 2017-09-06

### Fixed

- Values, such as objects, are now serialised prior to saving in Gitlab.

## [v1.1.0] - 2017-08-24

### Changed

- The `--url` option became optional. When omitted, the plugin will infer the URL from the git remote.
- The `--token` option became optional if a `.gitlabrc` file exists.

## [v1.0.10] - 2017-08-18

Initial release of `gitlab-ci-variables-setter-cli` plugin.

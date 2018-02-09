import rc from 'rc';
import fs from 'fs';
import gitRemoteOriginUrl from 'git-remote-origin-url';
import getUrlFromGitRemote from './git';
import { loadPropertiesFile } from './properties-file';

const gitlabEnvFileName = 'gitlab.env.yml';

async function getConf() {
  const conf = rc('gitlab');
  const errors = [];

  // Check for token
  if (!conf.token) {
    if (!process.env.GITLAB_TOKEN) {
      errors.push('No Gitlab token given.');
    } else {
      conf.token = process.env.GITLAB_TOKEN;
      console.log('Using token from environment variable GITLAB_TOKEN.');
    }
  }

  if (conf.config) {
    console.log(`Using token from ${conf.config}.`);
  }

  // If there is no url provided, get it!
  if (!conf.url) {
    try {
      conf.url = await getUrlFromGitRemote(gitRemoteOriginUrl);
      console.log('No URL specified, using git remote `origin`.');
    } catch (err) {
      errors.push('No Gitlab project URL given.');
    }
  }

  if (!conf.output) {
    conf.output = gitlabEnvFileName;
  }

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  return conf;
}

function getProperties() {
  const cwd = process.cwd();
  const path = `${cwd}/${gitlabEnvFileName}`;

  if (!fs.existsSync(path)) {
    console.error(`${gitlabEnvFileName} does not exist`);
    process.exit(1);
  }

  return loadPropertiesFile(path);
}

export {
  getConf,
  getProperties,
};

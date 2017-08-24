import parse from 'git-url-parse';

/**
 * Retrieves the URL to a Gitlab project from parsing the git remote `origin`.
 *
 * @param {function} getRemoteFn function that can get the remote URL
 * @return {Promise<string>}
 */
export default async function getUrlFromGitRemote(getRemoteFn) {
  const remote = await getRemoteFn();
  const parts = parse(remote);
  const protocol = parts.protocol === 'ssh' ? 'https' : parts.protocol;

  return `${protocol}://${parts.resource}/${parts.full_name}`;
}

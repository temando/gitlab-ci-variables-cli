import { expect } from 'chai';

import getUrlFromGitRemote from '../../src/lib/git';

describe('git', () => {
  it('can parse git remotes', async () => {
    const getRemoteMock = () => Promise.resolve('git@src.temando.io:developer-experience/temando-field-manual-tome.git');
    const url = await getUrlFromGitRemote(getRemoteMock);
    const expectedUrl = 'https://src.temando.io/developer-experience/temando-field-manual-tome';

    expect(url).to.equal(expectedUrl);
  });

  it('can parse https remotes', async () => {
    const getRemoteMock = () => Promise.resolve('https://src.temando.io/developer-experience/temando-field-manual-tome.git');
    const url = await getUrlFromGitRemote(getRemoteMock);
    const expectedUrl = 'https://src.temando.io/developer-experience/temando-field-manual-tome';

    expect(url).to.equal(expectedUrl);
  });
});

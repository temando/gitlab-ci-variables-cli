import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import gitlabCIProject from '../../src/lib/gitlab-ci';

const mock = new MockAdapter(axios);
const gitlabToken = 'gitlabToken';
const apiBase = 'https://src.temando.io/api/v4/projects/khoa.tran%2Ftemando-field-manual-tome';

describe('gitlab-ci-project-handler', () => {
  afterEach(() => {
    mock.reset();
  });

  it('list variables', async () => {
    const mockResponse = [
      {
        key: 'DEPLOYMENT_REGION',
        value: 'us-east-1',
        protected: false,
      },
      {
        key: 'ENV',
        value: 'test',
        protected: false,
      },
    ];

    mock.onGet(`${apiBase}/variables?private_token=${gitlabToken}`).reply(200, mockResponse);

    const handler = gitlabCIProject('https://src.temando.io/khoa.tran/temando-field-manual-tome', gitlabToken);
    const variables = await handler.listVariables();

    expect(variables.length).to.equal(2);
    expect(variables[0].key).to.equal('DEPLOYMENT_REGION');
    expect(variables[1].key).to.equal('ENV');
  });

  it('update variable', async () => {
    const mockResponse = {
      key: 'ENV',
      value: 'env2',
      protected: false,
    };
    mock.onPut(`${apiBase}/variables/ENV?private_token=${gitlabToken}`).reply(200, mockResponse);

    const handler = gitlabCIProject('https://src.temando.io/khoa.tran/temando-field-manual-tome', gitlabToken);
    const variable = await handler.updateVariable('ENV', 'env2');

    expect(variable.key).to.equal('ENV');
    expect(variable.value).to.equal('env2');
  });

  context('set variables', () => {
    it('set variable', async () => {
      const mockResponse = {
        key: 'ENV',
        value: 'env2',
        protected: false,
      };
      mock
        .onPost(`${apiBase}/variables?private_token=${gitlabToken}`, {
          key: 'ENV',
          value: 'env2',
        })
        .reply(200, mockResponse);

      const handler = gitlabCIProject('https://src.temando.io/khoa.tran/temando-field-manual-tome', gitlabToken);
      const variable = await handler.createVariable('ENV', 'env2');

      expect(variable.key).to.equal('ENV');
      expect(variable.value).to.equal('env2');
    });

    it('set variable with object value', async () => {
      const mockResponse = {
        key: 'MSG',
        value: '{"hello":"world"}',
        protected: false,
      };
      mock
        .onPost(`${apiBase}/variables?private_token=${gitlabToken}`, {
          key: 'MSG',
          value: '{"hello":"world"}',
        })
        .reply(200, mockResponse);

      const handler = gitlabCIProject('https://src.temando.io/khoa.tran/temando-field-manual-tome', gitlabToken);
      const variable = await handler.createVariable('MSG', { hello: 'world' });

      expect(variable.key).to.equal('MSG');
      expect(variable.value).to.equal('{"hello":"world"}');
    });

    it('do not force update', async () => {
      const mockListVariablesResponse = [
        {
          key: 'DEPLOYMENT_REGION',
          value: 'us-east-1',
          protected: false,
        },
        {
          key: 'ENV',
          value: 'env',
          protected: false,
        },
      ];

      mock.onGet(`${apiBase}/variables?private_token=${gitlabToken}`).reply(200, mockListVariablesResponse);
      mock.onPost(`${apiBase}/variables?private_token=${gitlabToken}`).reply(200, { REGION: 'us-east-1' });

      const handler = gitlabCIProject('https://src.temando.io/khoa.tran/temando-field-manual-tome', gitlabToken);
      const properties = {
        ENV: 'env2',
        REGION: 'us-east-1',
      };
      const variables = await handler.setVariables(properties, false);

      expect(variables.length).to.equal(1);
      expect(variables[0].REGION).to.equal('us-east-1');
    });

    it('force update', async () => {
      const mockListVariablesResponse = [
        {
          key: 'DEPLOYMENT_REGION',
          value: 'us-east-1',
          protected: false,
        },
        {
          key: 'ENV',
          value: 'env',
          protected: false,
        },
      ];

      mock.onGet(`${apiBase}/variables?private_token=${gitlabToken}`).reply(200, mockListVariablesResponse);
      mock.onPost(`${apiBase}/variables?private_token=${gitlabToken}`).reply(200, { REGION: 'us-east-1' });
      mock.onPut(`${apiBase}/variables/ENV?private_token=${gitlabToken}`).reply(200, { ENV: 'env2' });

      const handler = gitlabCIProject('https://src.temando.io/khoa.tran/temando-field-manual-tome', gitlabToken);
      const properties = {
        ENV: 'env2',
        REGION: 'us-east-1',
      };
      const variables = await handler.setVariables(properties, true);

      expect(variables.length).to.equal(2);
      expect(variables[0].ENV).to.equal('env2');
      expect(variables[1].REGION).to.equal('us-east-1');
    });
  });
});

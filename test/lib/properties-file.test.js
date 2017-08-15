import { expect } from 'chai';
import loadPropertiesFile from '../../src/lib/properties-file';

const cwd = process.cwd();

describe('properties-file-handler', () => {
  context('loadPropertiesFile', () => {
    it('loads properties file into properties object', () => {
      const path = `${cwd}/test/fixtures/test.yml`;
      const properties = loadPropertiesFile(path);

      expect(properties.BIBLIOTECA).to.equal('docs');
      expect(properties.DEPLOYMENT_REGION).to.equal('us-east-1');
      expect(properties.NPM_INSTALL_TOKEN).to.equal(123456789);
    });
  });
});

import { expect } from 'chai';
import { loadPropertiesFile, savePropertiesFile } from '../../src/lib/properties-file';
import { readFileSync, unlinkSync } from 'fs';

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

  context('savePropertiesFile', () => {
    it('saves properties object into properties file', () => {
      const path = `${cwd}/test/fixtures/test-save.yml`;
      savePropertiesFile(path, [
        {
          key: 'TEST_KEY',
          value: 'hello',
          protected: false,
        },
        {
          key: 'TOKEN',
          value: 'jkdsjkldfsjkl',
          protected: false,
        }
      ]);

      const result = readFileSync(path, 'utf8');
      expect(result).to.equal(`TEST_KEY: hello
TOKEN: jkdsjkldfsjkl
`);

      unlinkSync(path);
    });
  });
});

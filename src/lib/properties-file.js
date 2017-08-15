import fs from 'fs';
import yaml from 'js-yaml';

/**
 * Load properties file into properties object
 * A property is a key/value pair.
 *
 * @param path
 *
 * @return {Object} properties
 */
export default function loadPropertiesFile(path) {
  let doc;
  try {
    const contents = fs.readFileSync(path, 'utf8');
    doc = yaml.safeLoad(contents);
  } catch (error) {
    console.log(error);
  }

  return doc;
}

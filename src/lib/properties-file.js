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
export function loadPropertiesFile(path) {
  let doc;
  try {
    const contents = fs.readFileSync(path, 'utf8');
    doc = yaml.safeLoad(contents);
  } catch (error) {
    console.log(error);
  }

  return doc;
}

/**
 * Save properties object into properties file
 * A property is a key/value pair.
 *
 * @param path
 * @param obj
 *
 */
export function savePropertiesFile(path, obj) {
  const contents = {};
  obj.forEach((envVar) => {
    contents[envVar.key] = envVar.value;
  });

  try {
    const string = yaml.safeDump(contents);
    fs.writeFileSync(path, string, 'utf8');
  } catch (error) {
    console.log(error);
  }
}

import fs from 'fs'
import yaml from 'js-yaml'

/**
 * Load properties file into properties object
 * A property is a key/value pair.
 *
 * @param path
 *
 * @return {Object} properties
 */
export function loadPropertiesFile (path) {
  try {
    const contents = fs.readFileSync(path, 'utf8')
    const doc = yaml.safeLoad(contents)

    return doc
  } catch (error) {
    console.log(error)
  }
}

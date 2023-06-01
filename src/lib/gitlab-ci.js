import axios from 'axios';
import URL from 'url-parse';
import isPrimitive from 'is-primitive';

/**
 * Provides utility functions to simplify interacting with a GitLab CI project through the API
 *
 * @param {string} url
 * @param {string} token
 *
 * @return {object} utility functions wrapped in an object
 */
export default function gitlabCI(url, token) {
  const parsedUrl = new URL(url);
  const perPageDefault = 100;

  // Construct project id by encoding namespace/projectName
  const projectId = parsedUrl.pathname
    .split('/')
    .filter(x => x)
    .join('%2F');

  const apiUrl = `${parsedUrl.origin}/api/v4/projects/${projectId}/variables`;
  const tokenQueryString = `private_token=${token}`;
  const perPageQueryString = `per_page=${perPageDefault}`;

  /**
   * Will serialise a value using `JSON.stringify` if it is not primative.
   *
   * @param {any} value
   * @return {string|number|boolean}
   */
  function serialiseValue(value) {
    if (!isPrimitive(value)) {
      return JSON.stringify(value);
    }

    return value;
  }

  /**
   * Create project variable
   *
   * @param key
   * @param value
   * @param isProtected
   * @param masked
   * @param raw
   * @param scope
   * @return {Promise<Object>} variable object
   */
  async function createVariable(key, value, isProtected, masked, raw, scope) {
    await axios({
      method: 'post',
      url: `${apiUrl}?${tokenQueryString}`,
      data: {
        key,
        value: serialiseValue(value),
        protected: isProtected,
        masked,
        raw,
        environment_scope: scope,
      },
    }).then((response) => {
      console.log(`Created new variable ${key} = ${JSON.stringify(value)}`);

      return response.data;
    }).catch((error) => {
      console.log(`Creation failed: ${error}`);

      if (masked) {
        console.log('Retrying unmasked...');
        createVariable(key, value, isProtected, false, raw, scope);
      }
    });
  }

  /**
   * Update project variable
   *
   * @param key
   * @param value
   * @param isProtected
   * @param masked
   * @param raw
   * @param scope
   * @return {Promise<Object>} variable object
   */
  async function updateVariable(key, value, isProtected, masked, raw, scope) {
    await axios({
      method: 'put',
      url: `${apiUrl}/${key}?${tokenQueryString}`,
      data: {
        key,
        value: serialiseValue(value),
        protected: isProtected,
        masked,
        raw,
        environment_scope: scope,
      },
    }).then((response) => {
      console.log(`Updated variable ${key} = ${JSON.stringify(value)}`);

      return response.data;
    }).catch((error) => {
      console.log(`Update failed: ${error}`);

      if (masked) {
        console.log('Retrying unmasked...');
        updateVariable(key, value, isProtected, false, raw, scope);
      }
    });
  }

  /**
   * Get all variables for project
   *
   * @return {Promise<Array>} array of variable objects
   */
  async function listVariables() {
    const response = await axios.get(`${apiUrl}?${tokenQueryString}&${perPageQueryString}`);

    return response.data;
  }

  /**
   * Set project variables
   *
   * @param {Object} properties
   * @param forceUpdate
   * @param isProtected
   * @param masked
   * @param raw
   * @param scope
   *
   * @return {Promise<Array>} array of variable objects
   */
  async function setVariables(properties, forceUpdate, isProtected, masked, raw, scope) {
    if (!properties) {
      return null;
    }

    const existingKeys = (await listVariables()).map(variable => variable.key);
    const keysToSet = Object.keys(properties);

    const promises = keysToSet.map(async (key) => {
      const value = properties[key];
      const keyExists = existingKeys.includes(key);

      if (keyExists && !forceUpdate) {
        console.log(`Skipped variable ${key}, already set for project.`);
        return undefined;
      }

      let variable;
      if (keyExists) {
        // Update variable
        variable = await updateVariable(key, value, isProtected, masked, raw, scope);
      } else {
        // Create variable
        variable = await createVariable(key, value, isProtected, masked, raw, scope);
      }

      return variable;
    });

    const variables = await Promise.all(promises);

    return variables.filter(variable => variable);
  }

  return {
    createVariable,
    updateVariable,
    listVariables,
    setVariables,
  };
}

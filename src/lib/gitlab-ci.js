import axios from 'axios';
import URL from 'url-parse';

/**
 * Provides utility functions to simplify interacting with a GitLab CI project through the API
 *
 * @param url
 * @param token
 *
 * @return {Object} utility functions wrapped in an object
 */
export default function gitlabCI(url, token) {
  const parsedUrl = new URL(url);

  // Construct project id by encoding namespace/projectName
  const projectId = parsedUrl.pathname
    .split('/')
    .filter(x => x)
    .join('%2F');

  const apiUrl = `${parsedUrl.origin}/api/v4/projects/${projectId}/variables`;
  const tokenQueryString = `private_token=${token}`;

  /**
   * Set project variable
   *
   * @param key
   * @param value
   *
   * @return {Promise<Object>} variable object
   */
  async function setVariable(key, value) {
    const response = await axios({
      method: 'post',
      url: `${apiUrl}?${tokenQueryString}`,
      data: {
        key,
        value,
      },
    });

    return response.data;
  }

  /**
   * Update project variable
   *
   * @param key
   * @param value
   *
   * @return {Promise<Object>} variable object
   */
  async function updateVariable(key, value) {
    const response = await axios({
      method: 'put',
      url: `${apiUrl}/${key}?${tokenQueryString}`,
      data: {
        key,
        value,
      },
    });

    return response.data;
  }

  /**
   * Get all variables for project
   *
   * @return {Promise<Array>} array of variable objects
   */
  async function listVariables() {
    const response = await axios.get(`${apiUrl}?${tokenQueryString}`);

    return response.data;
  }

  /**
   * Set project variables
   *
   * @param {Object} properties
   * @param forceUpdate if true, override existing values, otherwise ignore them
   *
   * @return {Promise<Array>} array of variable objects
   */
  async function setVariables(properties, forceUpdate) {
    if (!properties) {
      return null;
    }

    const existingKeys = (await listVariables()).map(variable => variable.key);
    const keysToSet = Object.keys(properties);

    const promises = keysToSet.map(async (key) => {
      const value = properties[key];
      const keyExists = existingKeys.some(existingKey => existingKey === key);

      if (keyExists && !forceUpdate) {
        console.log(`Skipping ${key}, already set for ${projectId}.`);
        return undefined;
      }

      let variable;
      if (keyExists) {
        // Update variable
        variable = await updateVariable(key, value);
      } else {
        // Create variable
        variable = await setVariable(key, value);
      }

      console.log(`Set ${key} = ${value} for ${projectId}`);
      return variable;
    });

    const variables = await Promise.all(promises);

    return variables.filter(variable => variable);
  }

  return {
    setVariable,
    updateVariable,
    listVariables,
    setVariables,
  };
}

/**
 * @typedef {Object} babel
 * @property {string} corePackage
 * @property {number} loaderVersion
 * @property {string} transformFunctionName
 * @property {number} version
 */

/**
 * @typedef {Object} testCase
 * @property {string[]} expectedRequirePaths
 * @property {string} name
 * @property {string} repositoryPath
 */

/**
 * @typedef {Object} setupParameter
 * @property {string} parameter.directory
 * @property {string} parameter.repositoryJavascript
 */

/**
 * @callback setup
 * @param {setupParameter} parameter
 */

/**
 * @typedef {Object} setupAndTestCases
 * @property {setup} setupAndTestCases.setup
 * @property {testCase[]} setupAndTestCases.testCases
*/

module.exports = null;
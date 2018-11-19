/**
 * @typedef {Object} babel
 * @property {string} corePackage
 * @property {string} transformFunctionName
 * @property {number} version
 */

/**
 * @typedef {Object} testCase
 * @property {string} expected
 * @property {string} name
 * @property {string} repositoryPath
 */

/**
 * @callback setupInDirectory
 * @param {string} directory
 */

/**
 * @typedef {Object} setupAndTestCases
 * @property {setupInDirectory} setupAndTestCases.setupInDirectory
 * @property {testCase[]} setupAndTestCases.testCases
*/

module.exports = null;
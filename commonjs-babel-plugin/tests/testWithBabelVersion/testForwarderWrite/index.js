/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	createTestCasesInDirectory = require("./createTestCasesInDirectory"),
	{ readFile } = require("fs-extra"),
	path = require("path"),
	writePlugin = require("../../../../tests/writePlugin"),
	writeRepositoryPackage = require("../writeRepositoryPackage");

/**
 * @param {object} parameters
 * @param {string} parameters.packagePluginDirectoryName
 * @param {string} parameters.repositoryJavascript
 * @param {string} parameters.testDirectory
 * @param {function(string):Promise} parameters.transformFilePath
*/
module.exports =
	({
		packagePluginDirectoryName,
		repositoryJavascript,
		testDirectory,
		transformFilePath,
	}) => {
		const testCases =
			createTestCasesInDirectory(testDirectory);

		beforeAll(
			() =>
				Promise.all(
					testCases.map(
						testCase =>
							[
								setupRepository(testCase.repository),
								...testCase.plugins.map(writePlugin),
							],
					),
				),
		);

		describe(
			"plug-in transform/forwarder write",
			() => {
				for (const testCase of testCases)
					testTestCase(testCase);
			},
		);

		async function setupRepository({
			filename,
			packageName,
		}) {
			await writeRepositoryPackage({
				directory:
					path.join(testDirectory, "node_modules", packageName),
				filename,
				javascript:
					repositoryJavascript,
				name:
					packageName,
			});
		}

		function testTestCase(
			testCase,
		) {
			test(
				testCase.name,
				async() => {
					const pluginsTransformed = [];

					for (const plugin of testCase.plugins)
						pluginsTransformed.push(
							// plug-ins transformed in order to match expected forwarder file side-effect
							// eslint-disable-next-line no-await-in-loop
							await transformFilePath(plugin.filePath),
						);

					expect({
						forwarder:
							await readFile(getForwarderPathOfRepository(testCase.repository), "UTF-8"),
						pluginsTransformed,
					})
					.toEqual({
						forwarder:
							getForwardersOfPluginsExpected(testCase.plugins),
						pluginsTransformed:
							testCase.plugins.map(plugin => plugin.javascript),
					});
				},
			);

			function getForwarderPathOfRepository({
				filename,
				packageName,
			}) {
				return (
					path.join(
						testDirectory,
						packagePluginDirectoryName,
						packageName,
						filename,
					)
				);
			}

			function getForwardersOfPluginsExpected(
				plugins,
			) {
				return (
					plugins
					.map(plugin => `require("../../${plugin.requirePath}")\n`)
					.join("")
				);
			}
		}
	};
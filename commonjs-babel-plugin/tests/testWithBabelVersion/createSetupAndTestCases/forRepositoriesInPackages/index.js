const
	createTestCases = require("./createTestCases"),
	path = require("path"),
	writePlugin = require("../../../../../tests/writePlugin");

module.exports =
	() => {
		const testCases = createTestCases();

		return (
			{
				setupInDirectory,
				testCases:
					testCases
					.map(
						testCase => (
							{
								expected:
									getExpectedForPlugin(testCase.plugin),
								name:
									testCase.packageName,
								repositoryPath:
									`/node_modules/${testCase.repositoryRequire}`,
							}
						),
					),
			}
		);

		async function setupInDirectory(
			directory,
		) {
			await Promise.all(testCases.map(writePluginForTestCase));

			function writePluginForTestCase(
				testCase,
			) {
				return (
					writePlugin({
						filePath:
							path.join(
								directory,
								testCase.plugin.filename,
							),
						plugin:
							`test plug-in of repository in package ${testCase.packageName}`,
						repositoryRequire:
							testCase.repositoryRequire,
					})
				);
			}
		}

		function getExpectedForPlugin(
			plugin,
		) {
			return `module.exports = require("@devsnicket/plugin-discovery-create-repository")();\n\nrequire("${plugin.toRepositoryPathExpected}${plugin.filename}")`;
		}
	};
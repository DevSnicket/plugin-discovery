const
	createTestCases = require("./createCases"),
	path = require("path"),
	writePlugin = require("../../../../tests/writePlugin");

module.exports =
	({
		testDirectory,
		transformRepositoryWithPath,
	}) => {
		const testCases = createTestCases();

		return (
			{
				name: "packages",
				setup,
				test: () => testCases.map(testTestCase),
			}
		);

		async function setup() {
			await Promise.all(testCases.map(writePluginForTestCase));

			function writePluginForTestCase(
				testCase,
			) {
				return (
					writePlugin({
						filePath:
							path.join(
								testDirectory,
								testCase.plugin.filename,
							),
						plugin:
							`test plug-in of repository in package ${testCase.packageName}`,
						repositoryPath:
							testCase.repositoryPath,
					})
				);
			}
		}

		function testTestCase(
			testCase,
		) {
			test(
				testCase.packageName,
				async() =>
					expect(
						await transformRepositoryWithPath(
							`${testDirectory}/node_modules/${testCase.repositoryPath}`,
						),
					)
					.toEqual(
						getExpectedForPlugin(testCase.plugin),
					),
			);
		}

		function getExpectedForPlugin(
			plugin,
		) {
			return `module.exports = require("@devsnicket/plugin-discovery-create-repository")();\n\nrequire("${plugin.toRepositoryPathExpected}${plugin.filename}")`;
		}
	};
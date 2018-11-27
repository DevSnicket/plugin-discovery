const
	createTestCaseForRoot = require("./createTestCaseForRoot"),
	createTestCaseForSubdirectory = require("./createTestCaseForSubdirectory"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	writeFile = promisify(fs.writeFile);

module.exports =
	/** @returns {import('../TestCase').TestCase[]} */
	({
		directory,
		repositoryJavascript,
	}) => {
		const testCases =
			[
				createTestCaseForRoot(),
				createTestCaseForSubdirectory(),
			];

		beforeAll(setup);

		return (
			testCases.map(
				testCase => (
					{
						expectedRequirePaths:
							[
								"./plugin.js",
								"./pluginSubdirectory/pluginOfRepositoryInParentDirectory.js",
							],
						name:
							testCase.name,
						repositoryPath:
							testCase.repositoryPath,
					}
				),
			)
		);

		async function setup() {
			await Promise.all(
				testCases.map(setupTestCase),
			);

			async function setupTestCase(
				testCase,
			) {
				await testCase.setupInDirectory(directory);

				await writeFile(
					path.join(directory, testCase.repositoryPath),
					repositoryJavascript,
				);
			}
		}
	};
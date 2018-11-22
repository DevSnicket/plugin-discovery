const
	createTestCaseForRoot = require("./createTestCaseForRoot"),
	createTestCaseForSubdirectory = require("./createTestCaseForSubdirectory"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	readRepositoryTransformed = require("../../../../../tests/readRepositoryTransformed");

const
	writeFile = promisify(fs.writeFile);

module.exports =
	/**
	 * @returns {import('../../../types').testCase[]}
	 */
	({
		directory,
		repositoryJavascript,
	}) => {
		const testCases =
			[
				createTestCaseForRoot(),
				createTestCaseForSubdirectory(),
			];

		let expected = null;

		beforeAll(setup);

		return (
			testCases.map(
				testCase => (
					{
						get expected() {
							return expected;
						},
						name: testCase.name,
						repositoryPath: testCase.repositoryPath,
					}
				),
			)
		);

		async function setup() {
			expected = await readRepositoryTransformed();

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
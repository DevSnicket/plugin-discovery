const
	createTestCaseForRoot = require("./createTestCaseForRoot"),
	createTestCaseForSubdirectory = require("./createTestCaseForSubdirectory"),
	readRepositoryTransformed = require("../../../../../tests/readRepositoryTransformed");

module.exports =
	/**
	 * @returns {import('../../../types').setupAndTestCases}
	 */
	() => {
		const testCases =
			[
				createTestCaseForRoot(),
				createTestCaseForSubdirectory(),
			];

		let expected = null;

		return (
			{
				setupInDirectory,
				testCases:
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
					),
			}
		);

		async function setupInDirectory(
			directory,
		) {
			expected = await readRepositoryTransformed();

			await Promise.all(
				testCases.map(testCase => testCase.setupInDirectory(directory)),
			);
		}
	};
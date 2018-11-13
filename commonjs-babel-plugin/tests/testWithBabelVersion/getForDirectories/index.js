const
	getTestCaseForRoot = require("./getTestCaseForRoot"),
	getTestCaseForSubdirectory = require("./getTestCaseForSubdirectory"),
	readRepositoryTransformed = require("../../../../tests/readRepositoryTransformed");

module.exports =
	({
		testDirectory,
		transformRepositoryWithPath,
	}) => {
		const testCases =
			[
				getTestCaseForRoot(
					testDirectory,
				),
				getTestCaseForSubdirectory(
					testDirectory,
				),
			];

		let expected = null;

		return (
			{
				name: "directories",
				setup,
				test: () => testCases.map(testTestCase),
			}
		);

		async function setup() {
			expected = await readRepositoryTransformed();

			await Promise.all(
				testCases.map(testCase => testCase.setup()),
			);
		}

		function testTestCase(
			testCase,
		) {
			test(
				testCase.name,
				async() =>
					expect(
						await transformRepositoryWithPath(
							testCase.repositoryPath,
						),
					)
					.toEqual(
						expected,
					),
			);
		}
	};
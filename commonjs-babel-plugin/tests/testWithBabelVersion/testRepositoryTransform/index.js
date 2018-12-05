const
	path = require("path"),
	setupAndCreateTestSets = require("./setupAndCreateTestSets"),
	testWebpack = require("./testWebpack");

module.exports =
	({
		packagePluginDirectoryName,
		repositoryJavascript,
		scope,
		testDirectory,
		transformFilePath,
	}) => {
		// setup outside of describe and so setup all tests first, to recreate their potential to affect each others behaviour
		const testCaseSets =
			setupAndCreateTestSets({
				directory: testDirectory,
				packagePluginDirectoryName,
				repositoryJavascript,
				scope,
			});

		describe(
			"transform repository",
			() => {
				for (const testCaseSet of testCaseSets)
					describe(
						testCaseSet.name,
						() => testTestCases(testCaseSet.testCases),
					);

				testWebpack({
					directory:
						testDirectory,
					testCases:
						testCaseSets.flatMap(testCaseSet => testCaseSet.testCases),
				});
			},
		);

		function testTestCases(
			testCases,
		) {
			for (const testCase of testCases)
				testTestCase(testCase);
		}

		function testTestCase(
			testCase,
		) {
			test(
				testCase.name,
				async() =>
					expect(
						await transformFilePath(
							path.join(
								testDirectory,
								testCase.repositoryPath,
							),
						),
					)
					.toEqual(
						getExpected({
							forwarderOrPluginPaths: testCase.forwarderOrPluginPaths,
							repositoryJavascript,
						}),
					),
			);
		}
	};

function getExpected({
	forwarderOrPluginPaths,
	repositoryJavascript,
}) {
	return (
		[
			repositoryJavascript,
			...forwarderOrPluginPaths.map(forwarderOrPluginPath => `require("${forwarderOrPluginPath}")`),
		]
		.join("\n\n")
	);
}
const path = require("path");

module.exports =
	({
		repositoryJavascript,
		testCaseSets,
		testDirectory,
		transformSourceFileWithPath,
	}) => {
		describe(
			"transform repository",
			() => {
				for (const testCaseSet of testCaseSets)
					describe(
						testCaseSet.name,
						() => testTestCases(testCaseSet.testCases),
					);
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
						await transformSourceFileWithPath(
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
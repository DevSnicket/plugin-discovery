require("array.prototype.flatmap")
.shim();

const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	createSetupAndTestCasesForRelative = require("./createSetupAndTestCases/forRelative"),
	createSetupAndTestCasesForRepositoriesInPackages = require("./createSetupAndTestCases/forRepositoriesInPackages"),
	path = require("path"),
	setupPackagesAndTransform = require("./setupPackagesAndTransform");

module.exports =
	({
		babel,
		testDirectory,
	}) => {
		const transformRepositoryFilename = "transformRepository.js";

		const testSets =
			[
				{
					...createSetupAndTestCasesForRelative(),
					name: "relative",
				},
				{
					...createSetupAndTestCasesForRepositoriesInPackages(),
					name: "repositories in packages",
				},
			];

		beforeAll(
			async() => {
				await setupPackagesAndTransform({
					babel,
					testDirectory,
					transformRepositoryFilename,
				});

				// setup all first incase they affect each other
				await Promise.all(
					testSets
					.flatMap(testDescription => testDescription.setupInDirectory(testDirectory)),
				);
			},
		);

		for (const testDescription of testSets)
			describe(
				testDescription.name,
				() => testTestCases(testDescription.testCases),
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
						await transformRepositoryWithPath(
							path.join(
								testDirectory,
								testCase.repositoryPath,
							),
						),
					)
					.toEqual(
						testCase.expected,
					),
			);
		}

		function transformRepositoryWithPath(
			repositoryPath,
		) {
			return (
				callModuleInProcess({
					argument:
						{
							babelCorePackage:
								babel.corePackage,
							repositoryPath,
							transformFunctionName:
								babel.transformFunctionName,
						},
					directory:
						testDirectory,
					moduleFile:
						transformRepositoryFilename,
				})
			);
		}
	};
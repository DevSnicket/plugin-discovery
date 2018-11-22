const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	createSetupAndTestCasesForRelative = require("./createSetupAndTestCases/forRelative"),
	createSetupAndTestCasesForRepositoriesInPackages = require("./createSetupAndTestCases/forRepositoriesInPackages"),
	path = require("path"),
	setupPackagesAndTransform = require("./setupPackagesAndTransform");

/**
 * @typedef {import('../types').testCase} testCase
 *
 * @typedef {Object} pluginPackagesAndTestCases
 * @property {string[]} pluginPackagesAndTestCases.packages
 * @property {testCase[]} pluginPackagesAndTestCases.testCases
*/

module.exports =
	/**
	 * @param {object} parameter
	 * @param {import('../types').babel} parameter.babel
	 * @param {pluginPackagesAndTestCases} parameter.pluginPackagesAndTestCases
	 * @param {string} parameter.repositoryJavascript
	 * @param {string} parameter.testDirectory
	 */
	({
		babel,
		pluginPackagesAndTestCases,
		repositoryJavascript,
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
					packages: pluginPackagesAndTestCases.packages,
					testDirectory,
					transformRepositoryFilename,
				});

				// setup all tests together incase they affect each other
				await Promise.all(
					testSets.map(
						testSet =>
							testSet.setup({
								directory: testDirectory,
								repositoryJavascript,
							}),
					),
				);
			},
		);

		for (const testSet of testSets)
			describe(
				testSet.name,
				() => testTestCases(testSet.testCases),
			);

		describe(
			"plug-ins in packages",
			() => testTestCases(pluginPackagesAndTestCases.testCases),
		);

		/** @param {testCase[]} testCases */
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
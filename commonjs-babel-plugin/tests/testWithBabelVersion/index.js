require("array.prototype.flatmap")
.shim();

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
	 * @param {string} parameter.testDirectory
	 */
	({
		babel,
		pluginPackagesAndTestCases,
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
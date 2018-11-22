const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	path = require("path"),
	setupAndCreateTestCasesForRelative = require("./setupAndCreateTestCasesForRelative"),
	setupAndCreateTestCasesForRepositoriesInPackages = require("./setupAndCreateTestCasesForRepositoriesInPackages"),
	setupPackagesAndTransform = require("./setupPackagesAndTransform");

module.exports =
	/**
	 * @typedef {Object} pluginPackagesAndTestCases
	 * @property {string[]} pluginPackagesAndTestCases.packages
	 * @property {import('../types').testCase[]} pluginPackagesAndTestCases.testCases
	 *
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

		beforeAll(
			() =>
				setupPackagesAndTransform({
					babel,
					packages: pluginPackagesAndTestCases.packages,
					testDirectory,
					transformRepositoryFilename,
				}),
		);

		// setup all tests first to recreate their potential to affect each others behaviour
		const
			relativeTestCases =
				setupAndCreateTestCasesForRelative({
					directory: testDirectory,
					repositoryJavascript,
				}),
			repositoriesInPackagesTestCases =
				setupAndCreateTestCasesForRepositoriesInPackages({
					directory: testDirectory,
					repositoryJavascript,
				});

		describe(
			"relative",
			() => testTestCases(relativeTestCases),
		);

		describe(
			"repositories in packages",
			() => testTestCases(repositoriesInPackagesTestCases),
		);

		describe(
			"plug-ins in packages",
			() => testTestCases(pluginPackagesAndTestCases.testCases),
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
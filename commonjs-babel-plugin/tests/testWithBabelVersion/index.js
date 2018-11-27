const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	path = require("path"),
	setupAndCreateTestCasesForPluginsInPackages = require("./setupAndCreateTestCasesForPluginsInPackages"),
	setupAndCreateTestCasesForRelative = require("./setupAndCreateTestCasesForRelative"),
	setupAndCreateTestCasesForRepositoriesInPackages = require("./setupAndCreateTestCasesForRepositoriesInPackages"),
	setupPackagesAndTransform = require("./setupPackagesAndTransform"),
	testWebpack = require("./testWebpack");

module.exports =
	/**
	 * @param {object} parameter
	 * @param {import('../Babel').Babel} parameter.babel
	 * @param {string} parameter.repositoryJavascript
	 * @param {string} parameter.testDirectory
	 */
	({
		babel,
		repositoryJavascript,
		testDirectory,
	}) => {
		const transformRepositoryFilename = "transformRepository.js";

		beforeAll(
			() =>
				setupPackagesAndTransform({
					babel,
					testDirectory,
					transformRepositoryFilename,
				}),
		);

		const scope = "@devsnicket";

		// setup all tests first to recreate their potential to affect each others behaviour
		const
			pluginsInPackagesTestCases =
				setupAndCreateTestCasesForPluginsInPackages({
					directory: testDirectory,
					repositoryJavascript,
					scope,
				}),
			relativeTestCases =
				setupAndCreateTestCasesForRelative({
					directory: testDirectory,
					repositoryJavascript,
				}),
			repositoriesInPackagesTestCases =
				setupAndCreateTestCasesForRepositoriesInPackages({
					directory: testDirectory,
					repositoryJavascript,
					scope,
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
			() => testTestCases(pluginsInPackagesTestCases),
		);

		testWebpack({
			directory:
				testDirectory,
			testCases:
				[
					...relativeTestCases,
					...repositoriesInPackagesTestCases,
					...pluginsInPackagesTestCases,
				],
		});

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
						getExpected({
							repositoryJavascript,
							requirePaths: testCase.expectedRequirePaths,
						}),
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

function getExpected({
	repositoryJavascript,
	requirePaths,
}) {
	return (
		[
			repositoryJavascript,
			...requirePaths.map(requirePath => `require("${requirePath}")`),
		]
		.join("\n\n")
	);
}
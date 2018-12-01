const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	path = require("path"),
	setupAndCreateTestCasesForForwarders = require("./setupAndCreateTestCasesForForwarders"),
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
			forwardersTestCases =
				setupAndCreateTestCasesForForwarders({
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
			"transform repository",
			() => {
				describe(
					"relative",
					() => testRepositoryTransforms(relativeTestCases),
				);

				describe(
					"repositories in packages",
					() => testRepositoryTransforms(repositoriesInPackagesTestCases),
				);

				describe(
					"forwarders",
					() => testRepositoryTransforms(forwardersTestCases),
				);
			},
		);

		testWebpack({
			directory:
				testDirectory,
			testCases:
				[
					...relativeTestCases,
					...repositoriesInPackagesTestCases,
					...forwardersTestCases,
				],
		});

		function testRepositoryTransforms(
			testCases,
		) {
			for (const testCase of testCases)
				testRepositoryTransform(testCase);
		}

		function testRepositoryTransform(
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
							pluginPaths: testCase.pluginPaths,
							repositoryJavascript,
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
	pluginPaths,
}) {
	return (
		[
			repositoryJavascript,
			...pluginPaths.map(pluginPath => `require("${pluginPath}")`),
		]
		.join("\n\n")
	);
}
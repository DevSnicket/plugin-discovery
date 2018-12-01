require("array.prototype.flatmap")
.shim();

const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	setupAndCreateTestSets = require("./setupAndCreateTestSets"),
	setupPackagesAndTransform = require("./setupPackagesAndTransform"),
	testRepositoryTransform = require("./testRepositoryTransform"),
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
		const transformFilename = "transform.js";

		beforeAll(
			() =>
				setupPackagesAndTransform({
					babel,
					testDirectory,
					transformFilename,
				}),
		);

		const scope = "@devsnicket";

		// setup all tests first to recreate their potential to affect each others behaviour
		const testCaseSets =
			setupAndCreateTestSets({
				directory: testDirectory,
				repositoryJavascript,
				scope,
			});

		testRepositoryTransform({
			repositoryJavascript,
			testCaseSets,
			testDirectory,
			transformSourceFileWithPath,
		});

		testWebpack({
			directory:
				testDirectory,
			testCases:
				testCaseSets.flatMap(testCaseSet => testCaseSet.testCases),
		});

		function transformSourceFileWithPath(
			sourceFilePath,
		) {
			return (
				callModuleInProcess({
					argument:
						{
							babelCorePackage:
								babel.corePackage,
							sourceFilePath,
							transformFunctionName:
								babel.transformFunctionName,
						},
					directory:
						testDirectory,
					moduleFile:
						transformFilename,
				})
			);
		}
	};
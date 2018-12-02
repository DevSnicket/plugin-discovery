require("array.prototype.flatmap")
.shim();

const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	setupPackagesAndTransform = require("./setupPackagesAndTransform"),
	testRepositoryTransform = require("./testRepositoryTransform");

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

		testRepositoryTransform({
			repositoryJavascript,
			scope,
			testDirectory,
			transformSourceFileWithPath,
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
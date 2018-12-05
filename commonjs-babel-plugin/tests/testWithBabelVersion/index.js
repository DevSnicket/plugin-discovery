require("array.prototype.flatmap")
.shim();

const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	setupPackagesAndTransform = require("./setupPackagesAndTransform"),
	testForwarderWrite = require("./testForwarderWrite"),
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
		const
			packagePluginDirectoryName = ".devsnicket-plugin-discovery",
			transformFilename = "transform.js";

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
			packagePluginDirectoryName,
			repositoryJavascript,
			scope,
			testDirectory,
			transformFilePath,
		});

		testForwarderWrite({
			packagePluginDirectoryName,
			repositoryJavascript,
			testDirectory,
			transformFilePath,
		});

		function transformFilePath(
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
const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	getForDirectories = require("./getForDirectories"),
	getForPackages = require("./getForPackages"),
	setupPackagesAndTransform = require("./setupPackagesAndTransform");

module.exports =
	({
		babel,
		testDirectory,
	}) => {
		const transformRepositoryFilename = "transformRepository.js";

		const testDescriptions =
			[
				getForDirectories({
					testDirectory,
					transformRepositoryWithPath,
				}),
				getForPackages({
					testDirectory,
					transformRepositoryWithPath,
				}),
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
					testDescriptions
					.map(testDescription => testDescription.setup()),
				);
			},
		);

		for (const testDescription of testDescriptions)
			describe(
				testDescription.name,
				testDescription.test,
			);

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
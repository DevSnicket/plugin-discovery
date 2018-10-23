const
	callModuleInProcess = require("../callModuleInProcess"),
	fs = require("fs"),
	path = require("path"),
	setupForRepositoryDirectories = require("../setupForRepositoryDirectories"),
	{ promisify } = require("util");

const copyFile = promisify(fs.copyFile);

module.exports =
	({
		babel,
		getRepositoryForTestDescription,
	}) => {
		const
			testDescription = "transform",
			transformRepositoryFilename = "transformRepository.js";

		let repository = null;

		beforeAll(
			async() => {
				repository = await getRepositoryForTestDescription(testDescription);

				await setupForRepositoryDirectories({
					babel,
					repository,
				});

				await copyFile(
					path.join(__dirname, transformRepositoryFilename),
					path.join(repository.directories.root, transformRepositoryFilename),
				);
			},
		);

		describe(
			testDescription,
			() => {
				test(
					"in root directory",
					() =>
						testTransformInDirectory(
							repository.directories.root,
						),
				);

				test(
					"in sub-directory",
					() =>
						testTransformInDirectory(
							repository.directories.sub,
						),
				);
			},
		);

		async function testTransformInDirectory(
			directory,
		) {
			expect(
				await callModuleInProcess({
					argument:
						{
							babelCorePackage: babel.corePackage,
							repositoryFile: path.join(directory, repository.filename),
							transformFunctionName: babel.transformFunctionName,
						},
					directory:
						repository.directories.root,
					moduleFile:
						transformRepositoryFilename,
				}),
			)
			.toEqual(
				repository.transformed,
			);
		}
	};
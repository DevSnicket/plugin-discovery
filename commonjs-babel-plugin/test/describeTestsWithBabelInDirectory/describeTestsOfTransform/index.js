const
	callModuleInProcess = require("../callModuleInProcess"),
	fs = require("fs"),
	path = require("path"),
	setupForRepositoryDirectories = require("../setupForRepositoryDirectories");

module.exports =
	({
		babel,
		repository,
	}) => {
		const transformRepositoryFilename = "transformRepository.js";

		beforeAll(
			callback =>
				setupForRepositoryDirectories({
					babel,
					callback:
						() => {
							fs.copyFileSync(
								path.join(__dirname, transformRepositoryFilename),
								path.join(repository.directories.root, transformRepositoryFilename),
							);

							callback();
						},
					repository,
				}),
		);

		describe(
			"transform",
			() => {
				test(
					"in root directory",
					callback =>
						testTransformInDirectory({
							callback,
							directory: repository.directories.root,
						}),
				);

				test(
					"in sub-directory",
					callback =>
						testTransformInDirectory({
							callback,
							directory: repository.directories.sub,
						}),
				);
			},
		);

		function testTransformInDirectory({
			callback,
			directory,
		}) {
			callModuleInProcess({
				argument:
					{
						babelCorePackage: babel.corePackage,
						repositoryFile: path.join(directory, repository.filename),
						transformFunctionName: babel.transformFunctionName,
					},
				callback:
					transformedCode => {
						expect(transformedCode)
						.toEqual(repository.transformed);

						callback();
					},
				directory:
					repository.directories.root,
				moduleFile:
					transformRepositoryFilename,
			});
		}
	};
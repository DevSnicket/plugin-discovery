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
		const iterateRepositoryFilename = "iterateRepository.js";

		beforeAll(
			callback =>
				setupForRepositoryDirectories({
					babel,
					callback:
						() => {
							fs.copyFileSync(
								path.join(__dirname, iterateRepositoryFilename),
								path.join(repository.directories.root, iterateRepositoryFilename),
							);

							callback();
						},
					repository,
				}),
		);

		describe(
			"runtime",
			() => {
				test(
					"in root directory",
					callback =>
						testRuntimeInDirectory({
							callback,
							directory: repository.directories.root,
						}),
				);

				test(
					"in sub-directory",
					callback =>
						testRuntimeInDirectory({
							callback,
							directory: repository.directories.sub,
						}),
				);
			},
		);

		function testRuntimeInDirectory({
			callback,
			directory,
		}) {
			fs.writeFileSync(
				path.join(directory, repository.filename),
				repository.transformed,
			);

			callModuleInProcess({
				argument:
					{ repositoryFile: path.join(directory, repository.filename) },
				callback:
					plugins => {
						expect(plugins)
						.toEqual(
							[
								"test plug-in",
								"test sub-directory plug-in of repository in parent directory",
							],
						);

						callback();
					},
				directory:
					repository.directories.root,
				moduleFile:
					iterateRepositoryFilename,
			});

			callback();
		}
	};
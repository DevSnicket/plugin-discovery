const
	callModuleInProcess = require("../callModuleInProcess"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	setupForRepositoryDirectories = require("../setupForRepositoryDirectories");

const
	copyFile = promisify(fs.copyFile),
	writeFile = promisify(fs.writeFile);

module.exports =
	({
		babel,
		getRepositoryForTestDescription,
	}) => {
		const
			iterateRepositoryFilename = "iterateRepository.js",
			testDescription = "runtime";

		let repository = null;

		beforeAll(
			async() => {
				repository = await getRepositoryForTestDescription(testDescription);

				await setupForRepositoryDirectories({
					babel,
					repository,
				});

				await copyFile(
					path.join(__dirname, iterateRepositoryFilename),
					path.join(repository.directories.root, iterateRepositoryFilename),
				);
			},
		);

		describe(
			testDescription,
			() => {
				test(
					"in root directory",
					() =>
						testRuntimeInDirectory(
							repository.directories.root,
						),
				);

				test(
					"in sub-directory",
					() =>
						testRuntimeInDirectory(
							repository.directories.sub,
						),
				);
			},
		);

		async function testRuntimeInDirectory(
			directory,
		) {
			await writeFile(
				path.join(directory, repository.filename),
				repository.transformed,
			);

			expect(
				await callModuleInProcess({
					argument:
						path.join(directory, repository.filename),
					directory:
						repository.directories.root,
					moduleFile:
						iterateRepositoryFilename,
				}),
			)
			.toEqual(
				[
					"test plug-in",
					"test sub-directory plug-in of repository in parent directory",
				],
			);
		}
	};
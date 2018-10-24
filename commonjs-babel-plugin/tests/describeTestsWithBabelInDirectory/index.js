const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	fs = require("fs"),
	getRepositoryForDirectory = require("../../../tests/getRepositoryForDirectory"),
	path = require("path"),
	setupForRepositoryDirectories = require("../../../tests/setupForRepositoryDirectories"),
	{ promisify } = require("util");

const
	copyFile = promisify(fs.copyFile),
	writeFile = promisify(fs.writeFile);

module.exports =
	({
		babel,
		directory,
	}) => {
		const
			testDescription = `babel-${babel.version}`,
			transformRepositoryFilename = "transformRepository.js";

		let repository = null;

		beforeAll(
			async() => {
				repository =
					await getRepositoryForDirectory(
						path.join(directory, testDescription),
					);

				await setupForRepositoryDirectories({
					packages:
						[
							`${babel.corePackage}@${babel.version}`,
							path.join("..", "..", "commonjs-babel-plugin"),
						],
					repository,
				});

				await writeBabelrcInDirectory(repository.directories.root);

				await copyFile(
					path.join(__dirname, transformRepositoryFilename),
					path.join(repository.directories.root, transformRepositoryFilename),
				);
			},
		);

		describe(
			testDescription,
			testWithBabelInDirectory,
		);

		function testWithBabelInDirectory() {
			test(
				"in root directory",
				() =>
					testInRepositoryDirectory(
						repository.directories.root,
					),
			);

			test(
				"in sub-directory",
				() =>
					testInRepositoryDirectory(
						repository.directories.sub,
					),
			);
		}

		async function testInRepositoryDirectory(
			repositoryDirectory,
		) {
			expect(
				await callModuleInProcess({
					argument:
						{
							babelCorePackage: babel.corePackage,
							repositoryFile: path.join(repositoryDirectory, repository.filename),
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

async function writeBabelrcInDirectory(
	directory,
) {
	await writeFile(
		path.join(directory, ".babelrc"),
		JSON.stringify(
			{
				plugins:
					[
						[
							"@devsnicket/plugin-discovery-commonjs-babel-plugin",
							{ log: "warnings" },
						],
					],
			},
		),
	);
}
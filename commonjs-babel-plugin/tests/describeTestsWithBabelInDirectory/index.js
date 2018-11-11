const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	fs = require("fs"),
	getRepository = require("../../../tests/getRepository"),
	path = require("path"),
	setupDirectoryWithPackages = require("../../../tests/setupDirectoryWithPackages"),
	{ promisify } = require("util"),
	writePlugins = require("../../../tests/writePlugins");

const
	copyFile = promisify(fs.copyFile),
	makeDirectory = promisify(fs.mkdir),
	writeFile = promisify(fs.writeFile);

module.exports =
	babel => {
		const
			testDescription = `babel-${babel.version}`,
			testDirectory = path.join(babel.directory, testDescription),
			transformRepositoryFilename = "transformRepository.js";

		const repositorySubdirectory = path.join(testDirectory, "repositoryInSubdirectory");

		let repository = null;

		beforeAll(
			async() => {
				repository = await getRepository();

				await setupDirectoryWithPackages({
					directory: testDirectory,
					packages:
						[
							`${babel.corePackage}@${babel.version}`,
							path.join("..", "..", "commonjs-babel-plugin"),
						],
				});

				await writePluginsInDirectory(
					testDirectory,
				);

				await makeDirectory(
					repositorySubdirectory,
				);

				await writePluginsInDirectory(
					repositorySubdirectory,
				);

				await writeBabelrcInDirectory(testDirectory);

				await copyFile(
					path.join(__dirname, transformRepositoryFilename),
					path.join(testDirectory, transformRepositoryFilename),
				);
			},
		);

		describe(
			testDescription,
			testWithBabelInDirectory,
		);

		function writePluginsInDirectory(
			directory,
		) {
			return (
				writePlugins({
					directory,
					repositoryFilename: repository.filename,
				})
			);
		}

		function testWithBabelInDirectory() {
			test(
				"in root directory",
				() =>
					testInRepositoryDirectory(
						testDirectory,
					),
			);

			test(
				"in sub-directory",
				() =>
					testInRepositoryDirectory(
						repositorySubdirectory,
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
						testDirectory,
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
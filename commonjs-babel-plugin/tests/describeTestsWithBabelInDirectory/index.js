const
	callModuleInProcess = require("../../../tests/callModuleInProcess"),
	fs = require("fs"),
	getRepository = require("../../../tests/getRepository"),
	path = require("path"),
	setupDirectoryWithPackages = require("../../../tests/setupDirectoryWithPackages"),
	{ promisify } = require("util"),
	writePlugin = require("../../../tests/writePlugin"),
	writePlugins = require("../../../tests/writePlugins");

const
	copyFile = promisify(fs.copyFile),
	makeDirectory = promisify(fs.mkdir);

module.exports =
	babel => {
		const
			testDescription = `babel-${babel.version}`,
			testDirectory = path.join(babel.directory, testDescription),
			transformRepositoryFilename = "transformRepository.js";

		const
			repositoryInPackagePath = "@devsnicket/plugin-discovery-test-repository-in-package/repositoryInPackage.js",
			repositoryInPackagePluginFilename = "pluginOfRepositoryInPackage.js",
			repositorySubdirectory = path.join(testDirectory, "repositoryInSubdirectory");

		let repository = null;

		beforeAll(
			async() => {
				repository = await getRepository();

				await setupDirectoryWithPackages({
					directory:
						testDirectory,
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

				await writePlugin({
					filePath:
						path.join(
							testDirectory,
							repositoryInPackagePluginFilename,
						),
					plugin:
						"test plug-in of repository in package",
					repositoryPath:
						repositoryInPackagePath,
				});

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
				async() =>
					expect(
						await transformRepositoryWithPath(
							path.join(testDirectory, repository.filename),
						),
					)
					.toEqual(
						repository.transformed,
					),
			);

			test(
				"in sub-directory",
				async() =>
					expect(
						await transformRepositoryWithPath(
							path.join(repositorySubdirectory, repository.filename),
						),
					)
					.toEqual(
						repository.transformed,
					),
			);

			test(
				"in package",
				async() =>
					expect(
						await transformRepositoryWithPath(
							`${testDirectory}/node_modules/${repositoryInPackagePath}`,
						),
					)
					.toEqual(
						`module.exports = require("@devsnicket/plugin-discovery-create-repository")();\n\nrequire("../../../${repositoryInPackagePluginFilename}")`,
					),
			);
		}

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
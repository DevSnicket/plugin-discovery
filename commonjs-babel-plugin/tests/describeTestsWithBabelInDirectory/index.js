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
			repositoriesInPackages =
				createRepositoriesInPackages(),
			repositorySubdirectory =
				path.join(testDirectory, "repositoryInSubdirectory");

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

				await Promise.all(
					[
						writePluginsInDirectory(
							testDirectory,
						),
						writePluginsOfRespositoryInSubdirectory(),
						...repositoriesInPackages.map(writeRepositoryInPackagePlugin),
						copyFile(
							path.join(__dirname, transformRepositoryFilename),
							path.join(testDirectory, transformRepositoryFilename),
						),
					],
				);
			},
		);

		describe(
			testDescription,
			testWithBabelInDirectory,
		);

		function createRepositoriesInPackages() {
			return (
				[
					{
						packageName:
							"plugin-discovery-test-repository-in-package",
						plugin:
							{
								filename: "pluginOfRepositoryInPackage.js",
								toRepositoryPathExpected: "../../",
							},
					},
					{
						packageName:
							"@devsnicket/plugin-discovery-test-repository-in-package",
						plugin:
							{
								filename: "pluginOfRepositoryInScopedPackage.js",
								toRepositoryPathExpected: "../../../",
							},
					},
				]
				.map(
					repositoryInPackage => (
						{
							...repositoryInPackage,
							repositoryPath: `${repositoryInPackage.packageName}/repositoryInScopedPackage.js`,
						}
					),
				)
			);
		}

		async function writePluginsOfRespositoryInSubdirectory() {
			await makeDirectory(
				repositorySubdirectory,
			);

			await writePluginsInDirectory(
				repositorySubdirectory,
			);
		}

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

		function writeRepositoryInPackagePlugin(
			repositoryInPackage,
		) {
			return (
				writePlugin({
					filePath:
						path.join(
							testDirectory,
							repositoryInPackage.plugin.filename,
						),
					plugin:
						`test plug-in of repository in package ${repositoryInPackage.packageName}`,
					repositoryPath:
						repositoryInPackage.repositoryPath,
				})
			);
		}

		function testWithBabelInDirectory() {
			testInDirectory({
				directory: testDirectory,
				name: "in root directory",
			});

			testInDirectory({
				directory: repositorySubdirectory,
				name: "in sub-directory",
			});

			testInPackages();
		}

		function testInDirectory({
			directory,
			name,
		}) {
			test(
				name,
				async() =>
					expect(
						await transformRepositoryWithPath(
							path.join(directory, repository.filename),
						),
					)
					.toEqual(
						repository.transformed,
					),
			);
		}

		function testInPackages() {
			for (const repositoryInPackage of repositoriesInPackages)
				test(
					`in package ${repositoryInPackage.packageName}`,
					async() =>
						expect(
							await transformRepositoryWithPath(
								`${testDirectory}/node_modules/${repositoryInPackage.repositoryPath}`,
							),
						)
						.toEqual(
							`module.exports = require("@devsnicket/plugin-discovery-create-repository")();\n\nrequire("${repositoryInPackage.plugin.toRepositoryPathExpected}${repositoryInPackage.plugin.filename}")`,
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
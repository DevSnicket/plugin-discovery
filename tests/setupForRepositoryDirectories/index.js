const
	callModuleInProcess = require("../callModuleInProcess"),
	deleteDirectoryContents = require("./deleteDirectoryContents"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	fileOrDirectoryExists = promisify(fs.exists),
	getAbsolutePath = promisify(fs.realpath),
	makeDirectory = promisify(fs.mkdir),
	which = promisify(require("which")),
	writeFile = promisify(fs.writeFile);

module.exports =
	async({
		packages,
		repository,
	}) => {
		if (await fileOrDirectoryExists(repository.directories.root))
			await deleteDirectoryContents(repository.directories.root);
		else
			await makeDirectory(repository.directories.root);

		await writePackageJsonFile();

		await callModuleInProcess({
			argument:
				{
					directory: repository.directories.root,
					npmPath: await getNpmPath(),
					packages,
				},
			directory:
				__dirname,
			moduleFile:
				"./installPackages",
		});

		await writePlugins();

		async function writePackageJsonFile() {
			await writeFile(
				path.join(repository.directories.root, "package.json"),
				JSON.stringify(
					{
						description: "test",
						license: "UNLICENSED",
						repository: "none",
					},
				),
			);
		}

		function getNpmPath() {
			return (
				getNpmPathFromProcessEnvironment(
					// eslint-disable-next-line no-process-env
					process.env,
				)
			);
		}

		async function writePlugins() {
			await writePluginsInDirectory(
				repository.directories.root,
			);

			await makeDirectory(repository.directories.sub);

			await writePluginsInDirectory(
				repository.directories.sub,
			);
		}

		async function writePluginsInDirectory(
			directory,
		) {
			await writeTestFile({
				content: `require("./${repository.filename}").plugIn("test plug-in");`,
				relativePath: "plugin.js",
			});

			await makeDirectory(path.join(directory, "pluginSubdirectory"));

			await writeTestFile({
				content: `require("../${repository.filename}").plugIn("test sub-directory plug-in of repository in parent directory");`,
				relativePath: path.join("pluginSubdirectory", "pluginOfRepositoryInParentDirectory.js"),
			});

			async function writeTestFile({
				content,
				relativePath,
			}) {
				await writeFile(
					path.join(directory, relativePath),
					content,
				);
			}
		}
	};

async function getNpmPathFromProcessEnvironment(
	environment,
) {
	return (
		environment.GLOBAL_NPM_PATH
		||
		path.join(
			await getBinaryPath(),
			process.platform === "win32" ? "../node_modules/npm" : "../..",
		)
	);

	async function getBinaryPath() {
		return (
			environment.GLOBAL_NPM_BIN
			||
			// Removal of await appears to cause subsequent behaviour reliant on result to fail
			// eslint-disable-next-line no-return-await
			await getAbsolutePath(
				await which("npm"),
			)
		);
	}
}
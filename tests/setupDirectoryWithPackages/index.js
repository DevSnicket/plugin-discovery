const
	callModuleInProcess = require("../callModuleInProcess"),
	deleteDirectoryContents = require("../deleteDirectoryContents"),
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
		directory,
		packages,
	}) => {
		if (await fileOrDirectoryExists(directory))
			await deleteDirectoryContents(directory);
		else
			await makeDirectory(directory);

		await writePackageJsonFile();

		await callModuleInProcess({
			argument:
				{
					directory,
					npmPath: await getNpmPath(),
					packages,
				},
			directory:
				__dirname,
			moduleFile:
				"./installPackages",
		});

		async function writePackageJsonFile() {
			await writeFile(
				path.join(directory, "package.json"),
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
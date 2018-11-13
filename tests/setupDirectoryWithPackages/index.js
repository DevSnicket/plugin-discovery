const
	callModuleInProcess = require("../callModuleInProcess"),
	{ emptyDir } = require("fs-extra"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	getAbsolutePath = promisify(fs.realpath),
	which = promisify(require("which")),
	writeFile = promisify(fs.writeFile);

module.exports =
	async({
		directory,
		packages,
	}) => {
		await emptyDir(directory);

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
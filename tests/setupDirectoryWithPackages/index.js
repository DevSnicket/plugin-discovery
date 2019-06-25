/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	callModuleInProcess = require("../callModuleInProcess"),
	{ emptyDir } = require("fs-extra"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	writePackageJsonFile = require("../writePackageJsonFile");

const
	getAbsolutePath = promisify(fs.realpath),
	which = promisify(require("which"));

module.exports =
	async({
		directory,
		packages,
	}) => {
		await emptyDir(directory);

		await writePackageJsonFile(
			{ directory },
		);

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
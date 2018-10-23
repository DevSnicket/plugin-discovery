const
	callModuleInProcess = require("../callModuleInProcess"),
	fs = require("fs"),
	path = require("path"),
	writeConfigurationFiles = require("./writeConfigurationFiles"),
	{ promisify } = require("util");

const
	makeDirectory = promisify(fs.mkdir),
	writeFile = promisify(fs.writeFile);

module.exports =
	async({
		babel,
		repository,
	}) => {
		await makeDirectory(repository.directories.root);

		await writeConfigurationFiles({
			babelVersion: babel.version,
			directory: repository.directories.root,
		});

		await callModuleInProcess({
			argument:
				{
					directory:
						repository.directories.root,
					packages:
						[
							`${babel.corePackage}@${babel.version}`,
							path.join("..", "..", "..", "create-repository"),
						],
				},
			directory:
				__dirname,
			moduleFile:
				"./installPackages",
		});

		await writePlugins();

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
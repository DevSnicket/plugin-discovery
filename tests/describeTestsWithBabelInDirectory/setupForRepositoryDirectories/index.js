const
	callModuleInProcess = require("../callModuleInProcess"),
	fs = require("fs"),
	path = require("path"),
	writeConfigurationFiles = require("./writeConfigurationFiles");

module.exports =
	({
		babel,
		callback,
		repository,
	}) => {
		fs.mkdirSync(repository.directories.root);

		writeConfigurationFiles({
			babelVersion: babel.version,
			directory: repository.directories.root,
		});

		callModuleInProcess({
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
			callback:
				writePlugins,
			directory:
				__dirname,
			moduleFile:
				"./installPackages",
		});

		function writePlugins() {
			writePluginsInDirectory(
				repository.directories.root,
			);

			fs.mkdirSync(repository.directories.sub);

			writePluginsInDirectory(
				repository.directories.sub,
			);

			callback();
		}

		function writePluginsInDirectory(
			directory,
		) {
			writeTestFile({
				content: `require("./${repository.filename}").plugIn("test plug-in");`,
				relativePath: "plugin.js",
			});

			fs.mkdirSync(path.join(directory, "pluginSubdirectory"));

			writeTestFile({
				content: `require("../${repository.filename}").plugIn("test sub-directory plug-in of repository in parent directory");`,
				relativePath: path.join("pluginSubdirectory", "pluginOfRepositoryInParentDirectory.js"),
			});

			function writeTestFile({
				content,
				relativePath,
			}) {
				fs.writeFileSync(
					path.join(directory, relativePath),
					content,
				);
			}
		}
	};
require("array.prototype.flatmap")
.shim();

const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	writePackageJsonFile = require("../../../../tests/writePackageJsonFile"),
	writePlugin = require("../../../../tests/writePlugin");

const
	makeDirectory = promisify(fs.mkdir),
	writeFile = promisify(fs.writeFile);

module.exports =
	async({
		directory,
		pluginsAndRepositories,
		repositoryJavascript,
	}) => {
		await Promise.all(
			pluginsAndRepositories
			.flatMap(
				pluginAndRepository =>
					[
						writePluginForRepository(pluginAndRepository),
						writeRepositoryPackage(pluginAndRepository.repository),
					],
			),
		);

		function writePluginForRepository({
			plugin,
			repository,
		}) {
			return (
				writePlugin({
					filePath:
						path.join(
							directory,
							plugin.filename,
						),
					plugin:
						`test plug-in of repository in package ${repository.package.name}`,
					repositoryRequire:
						repository.require,
				})
			);
		}

		async function writeRepositoryPackage({
			filename,
			package: _package,
		}) {
			const packageDirectory =
				path.join(
					directory,
					"node_modules",
					_package.scope || "",
					_package.nameInScope,
				);

			await makeDirectory(packageDirectory);

			await Promise.all(
				[
					writePackageJsonFile({
						directory:
							packageDirectory,
						name:
							_package.name,
						version:
							"0.0.0",
					}),
					writeFile(
						path.join(packageDirectory, filename),
						repositoryJavascript,
					),
				],
			);
		}
	};
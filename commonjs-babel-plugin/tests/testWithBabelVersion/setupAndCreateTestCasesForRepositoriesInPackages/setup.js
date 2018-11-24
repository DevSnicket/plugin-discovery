require("array.prototype.flatmap")
.shim();

const
	path = require("path"),
	writePlugin = require("../../../../tests/writePlugin"),
	writeRepositoryPackage = require("../writeRepositoryPackage");

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
						writePluginForRepository(
							pluginAndRepository,
						),
						writeRepositoryPackage({
							directory:
								getDirectoryForPackage(
									pluginAndRepository.repository.package,
								),
							filename:
								pluginAndRepository.repository.filename,
							javascript:
								repositoryJavascript,
							name:
								pluginAndRepository.repository.package.name,
						}),
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

		function getDirectoryForPackage(
			_package,
		) {
			return (
				path.join(
					directory,
					"node_modules",
					_package.scope || "",
					_package.nameInScope,
				)
			);
		}
	};
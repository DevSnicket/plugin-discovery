const
	path = require("path"),
	writePlugin = require("../../../../../tests/writePlugin");

module.exports =
	async({
		directory,
		packageNamesAndPluginsAndRepositoryRequires,
	}) => {
		await Promise.all(
			packageNamesAndPluginsAndRepositoryRequires
			.map(
				({
					packageName,
					plugin,
					repositoryRequire,
				}) =>
					writePlugin({
						filePath:
							path.join(
								directory,
								plugin.filename,
							),
						plugin:
							`test plug-in of repository in package ${packageName}`,
						repositoryRequire,
					}),
			),
		);
	};
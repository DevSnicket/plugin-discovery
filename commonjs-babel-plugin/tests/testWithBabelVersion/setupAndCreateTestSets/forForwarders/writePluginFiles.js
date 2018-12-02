const
	path = require("path"),
	writePlugin = require("../../../../../tests/writePlugin");

module.exports =
	({
		plugin,
		repository,
	}) =>
		writePluginFilesWithRequirePath({
			plugin,
			repositoryRequire: getRepositoryRequire(repository),
		});

function getRepositoryRequire({
	filename,
	package: _package,
}) {
	return `${_package.name}/${filename}`;
}

async function writePluginFilesWithRequirePath({
	plugin,
	repositoryRequire,
}) {
	await Promise.all(
		plugin.filePathsRelativeToPackage
		.map(
			filePathRelativeToPackage =>
				writePlugin({
					filePath: path.join(plugin.directory, filePathRelativeToPackage),
					repositoryRequire,
					value: plugin.name,
				}),
		),
	);
}
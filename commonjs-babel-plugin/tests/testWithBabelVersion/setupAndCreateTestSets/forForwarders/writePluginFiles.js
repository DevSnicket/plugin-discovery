const
	fsExtra = require("fs-extra"),
	path = require("path");

module.exports =
	({
		plugin,
		repository,
	}) =>
		writePluginFilesWithRequirePath({
			plugin,
			requirePath: getRequirePath(repository),
		});

function getRequirePath({
	filename,
	package: _package,
}) {
	return `${_package.name}/${filename}`;
}

async function writePluginFilesWithRequirePath({
	plugin,
	requirePath,
}) {
	await Promise.all(
		plugin.filePathsRelativeToPackage
		.map(
			filePathRelativeToPackage =>
				writePluginFile(
					path.join(plugin.directory, filePathRelativeToPackage),
				),
		),
	);

	async function writePluginFile(
		pluginFilePath,
	) {
		await fsExtra.ensureDir(
			path.dirname(pluginFilePath),
		);

		await fsExtra.writeFile(
			pluginFilePath,
			`require("${requirePath}").plugIn("${plugin.name}");`,
		);
	}
}
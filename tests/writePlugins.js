const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	writePlugin = require("./writePlugin");

const makeDirectory = promisify(fs.mkdir);

module.exports =
	({
		directory,
		repositoryFilename,
	}) => {
		return (
			Promise.all(
				[
					writePluginRelativeToDirectory({
						plugin:
							{
								content: "test plug-in",
								directory: "./",
							},
						relativePath:
							"plugin.js",
					}),
					writeSubdirectoryPlugin(),
				],
			)
		);

		async function writeSubdirectoryPlugin() {
			await makeDirectory(path.join(directory, "pluginSubdirectory"));

			await writePluginRelativeToDirectory({
				plugin:
					{
						content: "test sub-directory plug-in of repository in parent directory",
						directory: "../",
					},
				relativePath:
					path.join("pluginSubdirectory", "pluginOfRepositoryInParentDirectory.js"),
			});
		}

		function writePluginRelativeToDirectory({
			plugin,
			relativePath,
		}) {
			return (
				writePlugin({
					filePath: path.join(directory, relativePath),
					plugin: plugin.content,
					repositoryPath: `${plugin.directory}${repositoryFilename}`,
				})
			);
		}
	};
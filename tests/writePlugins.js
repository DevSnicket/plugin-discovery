const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	makeDirectory = promisify(fs.mkdir),
	writeFile = promisify(fs.writeFile);

module.exports =
	async({
		directory,
		repositoryFilename,
	}) => {
		await writeTestFile({
			content: `require("./${repositoryFilename}").plugIn("test plug-in");`,
			relativePath: "plugin.js",
		});

		await makeDirectory(path.join(directory, "pluginSubdirectory"));

		await writeTestFile({
			content: `require("../${repositoryFilename}").plugIn("test sub-directory plug-in of repository in parent directory");`,
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
	};
const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	writePackageJsonFile = require("../../../../tests/writePackageJsonFile"),
	writeRepositories = require("./writeRepositories");

const
	makeDirectory = promisify(fs.mkdir);

module.exports =
	async({
		directory,
		name,
		packagePluginDirectoryName,
		repository,
	}) => {
		await makeDirectory(
			directory,
		);

		await Promise.all(
			[
				writePackageJsonFile({
					directory,
					name,
					version: "0.0.0",
				}),
				writeRepositories({
					directory: path.join(directory, packagePluginDirectoryName),
					repository,
				}),
			],
		);
	};
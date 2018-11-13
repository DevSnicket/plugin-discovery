const
	fs = require("fs"),
	{ promisify } = require("util");

const writeFile = promisify(fs.writeFile);

module.exports =
	({
		filePath,
		plugin,
		repositoryPath,
	}) =>
		writeFile(
			filePath,
			`require("${repositoryPath}").plugIn("${plugin}");`,
		);
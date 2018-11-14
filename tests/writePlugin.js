const
	fs = require("fs"),
	{ promisify } = require("util");

const writeFile = promisify(fs.writeFile);

module.exports =
	({
		filePath,
		plugin,
		repositoryRequire,
	}) =>
		writeFile(
			filePath,
			`require("${repositoryRequire}").plugIn("${plugin}");`,
		);
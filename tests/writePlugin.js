const
	{ ensureDir, writeFile } = require("fs-extra"),
	path = require("path");

module.exports =
	async({
		filePath,
		repositoryRequire,
		value,
	}) => {
		await ensureDir(
			path.dirname(filePath),
		);

		await writeFile(
			filePath,
			`require("${repositoryRequire}").plugIn("${value}");`,
		);
	};
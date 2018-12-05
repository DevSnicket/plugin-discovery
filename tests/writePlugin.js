const
	{ ensureDir, writeFile } = require("fs-extra"),
	path = require("path");

module.exports =
	async({
		filePath,
		javascript,
	}) => {
		await ensureDir(
			path.dirname(filePath),
		);

		await writeFile(filePath, javascript);
	};
const
	fs = require("fs"),
	{ promisify } = require("util"),
	writePackageJsonFile = require("../../../../tests/writePackageJsonFile");

const makeDirectory = promisify(fs.mkdir);

module.exports =
	async({
		directory,
		name,
	}) => {
		await makeDirectory(
			directory,
		);

		await writePackageJsonFile({
			directory,
			name,
			version: "0.0.0",
		});
	};
const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	readFile = promisify(fs.readFile);

module.exports =
	async directory => (
		{
			directories:
				{
					root: directory,
					sub: path.join(directory, "repositoryInSubdirectory"),
				},
			filename:
				"repository.js",
			transformed:
				await readFile(
					path.join(__dirname, "repository.transformed.js"),
					{ encoding: "utf-8" },
				),
		}
	);
const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	readFile = promisify(fs.readFile);

module.exports =
	async({
		directory,
		testDescription,
	}) => {
		return (
			{
				directories:
					getDirectories(),
				filename:
					"repository.js",
				transformed:
					await readFile(
						path.join(__dirname, "repository.transformed.js"),
						{ encoding: "utf-8" },
					),
			}
		);

		function getDirectories() {
			const root =
				path.join(
					directory,
					testDescription,
				);

			return (
				{
					root,
					sub: path.join(root, "repositoryInSubdirectory"),
				}
			);
		}
	};
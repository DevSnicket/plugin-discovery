const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	writePlugins = require("../../../../tests/writePlugins");

const makeDirectory = promisify(fs.mkdir);

module.exports =
	testDirectory => {
		const
			directory = path.join(testDirectory, "repositoryInSubdirectory"),
			repositoryFilename = "repositoryInSubdirectory.js";

		return (
			{
				name:
					"sub-directory",
				repositoryPath:
					path.join(
						directory,
						repositoryFilename,
					),
				setup,
			}
		);

		async function setup() {
			await makeDirectory(
				directory,
			);

			await writePlugins({
				directory,
				repositoryFilename,
			});
		}
	};
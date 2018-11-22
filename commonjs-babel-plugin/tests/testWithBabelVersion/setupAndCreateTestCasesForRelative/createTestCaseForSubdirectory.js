const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	writePlugins = require("../../../../tests/writePlugins");

const makeDirectory = promisify(fs.mkdir);

module.exports =
	() => {
		const
			repositoryFilename = "repositoryInSubdirectory.js",
			subdirectoryName = "repositoryInSubdirectory";

		return (
			{
				name:
					"sub-directory",
				repositoryPath:
					path.join(
						subdirectoryName,
						repositoryFilename,
					),
				setupInDirectory,
			}
		);

		async function setupInDirectory(
			directory,
		) {
			const subdirectory = path.join(directory, subdirectoryName);

			await makeDirectory(
				subdirectory,
			);

			await writePlugins({
				directory: subdirectory,
				repositoryFilename,
			});
		}
	};
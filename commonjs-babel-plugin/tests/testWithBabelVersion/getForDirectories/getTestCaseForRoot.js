const
	path = require("path"),
	writePlugins = require("../../../../tests/writePlugins");

module.exports =
	testDirectory => {
		const repositoryInRootFilename = "repositoryInRoot.js";

		return (
			{
				name:
					"root",
				repositoryPath:
					path.join(
						testDirectory,
						repositoryInRootFilename,
					),
				setup:
					() =>
						writePlugins({
							directory:
								testDirectory,
							repositoryFilename:
								repositoryInRootFilename,
						}),
			}
		);
	};
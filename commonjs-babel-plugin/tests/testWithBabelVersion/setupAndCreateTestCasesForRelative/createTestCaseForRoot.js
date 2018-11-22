const writePlugins = require("../../../../tests/writePlugins");

module.exports =
	() => {
		const repositoryInRootFilename = "repositoryInRoot.js";

		return (
			{
				name:
					"root",
				repositoryPath:
					repositoryInRootFilename,
				setupInDirectory:
					directory =>
						writePlugins({
							directory,
							repositoryFilename:
								repositoryInRootFilename,
						}),
			}
		);
	};
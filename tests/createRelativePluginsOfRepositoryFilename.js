const path = require("path");

module.exports =
	repositoryFilename =>
		[
			{
				filePath: path.join("plugin.js"),
				repositoryRequire: `./${repositoryFilename}`,
				value: "test plug-in",
			},
			{
				filePath: path.join("pluginSubdirectory", "pluginOfRepositoryInParentDirectory.js"),
				repositoryRequire: `../${repositoryFilename}`,
				value: "test sub-directory plug-in of repository in parent directory",
			},
		];
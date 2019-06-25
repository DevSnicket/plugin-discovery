/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

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
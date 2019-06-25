/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	getPluginJavascript = require("../../../../../../tests/getPluginJavascript"),
	path = require("path"),
	writePlugin = require("../../../../../../tests/writePlugin");

module.exports =
	({
		plugin,
		repository,
	}) =>
		writePluginFilesWithRequirePath({
			plugin,
			repositoryRequire: getRepositoryRequire(repository),
		});

function getRepositoryRequire({
	filename,
	package: _package,
}) {
	return `${_package.name}/${filename}`;
}

async function writePluginFilesWithRequirePath({
	plugin,
	repositoryRequire,
}) {
	await Promise.all(
		plugin.filePathsRelativeToPackage
		.map(
			filePathRelativeToPackage =>
				writePlugin({
					filePath:
						path.join(plugin.directory, filePathRelativeToPackage),
					javascript:
						getPluginJavascript({
							repositoryRequire,
							value: plugin.name,
						}),
				}),
		),
	);
}
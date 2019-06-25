/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	{ appendFileSync } = require("fs"),
	fsExtra = require("fs-extra"),
	path = require("path");

module.exports =
	({
		getForwarderPathForRepositoryPath,
		logDetail,
		outputDirectoryPath,
		requirePathRelativeToNodeModules,
		sourceFilePath,
		sourceRootPath,
	}) => {
		const sourceFileRelativeToRootPath =
			path.relative(sourceRootPath, sourceFilePath);

		logDetail(`forwarder written for plug-in ${sourceFileRelativeToRootPath} to package repository ${requirePathRelativeToNodeModules}.`);

		const forwarderRelativePath =
			getForwarderPathForRepositoryPath(
				requirePathRelativeToNodeModules,
			);

		const forwarderDirectoryRelativePath =
			path.dirname(forwarderRelativePath);

		fsExtra.ensureDirSync(
			forwarderDirectoryRelativePath,
		);

		appendFileSync(
			forwarderRelativePath,
			`require("${getPluginPathRelativeToForwarder()}")\n`,
		);

		function getPluginPathRelativeToForwarder() {
			return (
				path.relative(
					forwarderDirectoryRelativePath,
					path.join(
						outputDirectoryPath,
						sourceFileRelativeToRootPath,
					),
				)
			);
		}
	};
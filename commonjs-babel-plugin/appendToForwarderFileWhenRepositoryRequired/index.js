/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	appendForwarder = require("./appendForwarder"),
	hasRequireOfCreateRepository = require("./hasRequireOfCreateRepository"),
	resolveRequirePathWhenExist = require("./resolveRequirePathWhenExist");

module.exports =
	({
		getForwarderPathForRepositoryPath,
		log: { detail: logDetail },
		isCreateRepositoryPackage,
		isVisitedRepositoryFilePath,
		javascriptFileExtension,
		nodeModulesDirectory: { path: nodeModulesDirectoryPath },
		outputDirectoryPath,
		requirePath,
		sourceFilePath,
		sourceRootPath,
		walkCallExpressions,
	}) => {
		const requireFilePath =
			resolveRequirePathWhenExist({
				javascriptFileExtension,
				nodeModulesDirectoryPath,
				requirePath,
			});

		if (requireFilePath && isForwarderRequired())
			appendForwarder({
				getForwarderPathForRepositoryPath,
				logDetail,
				outputDirectoryPath,
				requirePathRelativeToNodeModules:
					requireFilePath.relativeToNodeModules,
				sourceFilePath,
				sourceRootPath,
			});

		function isForwarderRequired() {
			return (
				!isVisitedRepositoryFilePath(
					requireFilePath.absolute,
				)
				&&
				hasRequireOfCreateRepository({
					isCreateRepositoryPackage,
					requireFilePath:
						requireFilePath.absolute,
					walkCallExpressions,
				})
			);
		}
	};
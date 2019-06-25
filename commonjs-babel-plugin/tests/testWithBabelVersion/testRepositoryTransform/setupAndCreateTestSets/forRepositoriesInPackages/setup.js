/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

require("array.prototype.flatmap")
.shim();

const
	getPluginJavascript = require("../../../../../../tests/getPluginJavascript"),
	path = require("path"),
	writePlugin = require("../../../../../../tests/writePlugin"),
	writeRepositoryPackage = require("../../../writeRepositoryPackage");

module.exports =
	async({
		directory,
		pluginsAndRepositories,
		repositoryJavascript,
	}) => {
		await Promise.all(
			pluginsAndRepositories
			.flatMap(
				pluginAndRepository =>
					[
						writePluginForRepository(
							pluginAndRepository,
						),
						writeRepositoryPackage({
							directory:
								getDirectoryForPackage(
									pluginAndRepository.repository.package,
								),
							filename:
								pluginAndRepository.repository.filename,
							javascript:
								repositoryJavascript,
							name:
								pluginAndRepository.repository.package.name,
						}),
					],
			),
		);

		async function writePluginForRepository({
			plugin: { filename: pluginFilename },
			repository: { require: repositoryRequire },
		}) {
			await writePlugin({
				filePath:
					path.join(
						directory,
						pluginFilename,
					),
				javascript:
					getPluginJavascript({
						repositoryRequire,
						value:
							"test plug-in of repository in package transformed",
					}),
			});
		}

		function getDirectoryForPackage(
			_package,
		) {
			return (
				path.join(
					directory,
					"node_modules",
					_package.scope || "",
					_package.nameInScope,
				)
			);
		}
	};
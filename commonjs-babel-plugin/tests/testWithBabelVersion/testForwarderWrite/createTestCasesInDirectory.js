/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	getPluginJavascript = require("../../../../tests/getPluginJavascript"),
	path = require("path");

module.exports =
	testDirectory => {
		return (
			[
				createTestCase({
					pluginsFilenameSuffix:
						"",
					repository:
						{
							description: "filename",
							filePathForRequire: "/repositoryNotTransformed.js",
							filename: "repositoryNotTransformed.js",
							packageName: "repository-not-transformed",
						},
				}),
				createTestCase({
					pluginsFilenameSuffix:
						"OfDirectoryIndex",
					repository:
						{
							description: "of directory index",
							filePathForRequire: "",
							filename: "index.js",
							packageName: "repository-of-directory-index-not-transformed",
						},
				}),
			]
		);

		function createTestCase({
			pluginsFilenameSuffix,
			repository,
		}) {
			return (
				{
					name:
						`repository ${repository.description}`,
					plugins:
						createPlugins({
							pluginsFilenameSuffix,
							repository:
								{
									description:
										repository.description,
									require:
										`${repository.packageName}${repository.filePathForRequire}`,
								},
						}),
					repository:
						{
							filename:
								repository.filename,
							packageName:
								repository.packageName,
						},
				}
			);
		}

		function createPlugins({
			pluginsFilenameSuffix,
			repository,
		}) {
			return (
				[
					createPlugin({
						directory: null,
						filename: `pluginOfRepositoryInPackageNotTransformed${pluginsFilenameSuffix}.js`,
						valueSuffix: "",
					}),
					createPlugin({
						directory: "pluginOfRepositoryInPackageNotTransformedSubdirectory",
						filename: `pluginOfRepositoryInPackageNotTransformed${pluginsFilenameSuffix}InSubdirectory.js`,
						valueSuffix: " in subdirectory",
					}),
				]
			);

			function createPlugin({
				directory,
				filename,
				valueSuffix,
			}) {
				return (
					{
						filePath:
							path.join(testDirectory, directory || "", filename),
						javascript:
							getPluginJavascript({
								repositoryRequire:
									repository.require,
								value:
									`test plug-in of repository ${repository.description} in package not transformed${valueSuffix}`,
							}),
						requirePath:
							directory
							?
							`${directory}/${filename}`
							:
							filename,
					}
				);
			}
		}
	};
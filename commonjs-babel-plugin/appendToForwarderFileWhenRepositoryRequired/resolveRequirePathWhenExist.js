/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	fsExtra = require("fs-extra"),
	path = require("path");

module.exports =
	({
		javascriptFileExtension,
		nodeModulesDirectoryPath,
		requirePath,
	}) => {
		return (
			hasJavascriptExtension()
			?
			resolveWhenFileExists(requirePath)
			:
			getInferredWhenFileExists()
		);

		function hasJavascriptExtension() {
			return path.extname(requirePath) === javascriptFileExtension;
		}

		function getInferredWhenFileExists() {
			return (
				resolveWhenFileExists(
					`${requirePath}${javascriptFileExtension}`,
				)
				||
				resolveWhenFileExists(
					`${requirePath}/index.js`,
				)
			);
		}

		function resolveWhenFileExists(
			relativeToNodeModules,
		) {
			const absolute =
				path.join(
					nodeModulesDirectoryPath,
					relativeToNodeModules,
				);

			return (
				fsExtra.existsSync(absolute)
				&&
				{
					absolute,
					relativeToNodeModules,
				}
			);
		}
	};
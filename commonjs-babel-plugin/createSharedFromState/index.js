/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	createConsoleLogFromOption = require("./createConsoleLogFromOption"),
	createWalkCallExpressions = require("./createWalkCallExpressions"),
	path = require("path");

const nodeModulesDirectoryName = "node_modules";

module.exports =
	state => {
		const
			log = createLog(),
			sourceRootPath = resolveSourceRootPath();

		return (
			{
				log,
				nodeModulesDirectory:
					{
						name: nodeModulesDirectoryName,
						path: getNodeModulesPath(),
					},
				sourceRootPath,
				walkCallExpressions:
					createWalkCallExpressions({
						babylonParserOptions: state.file.parserOpts,
						logWarning: log.warning,
					}),
			}
		);

		function resolveSourceRootPath() {
			return (
				path.resolve(
					state.opts.rootDirectory
					||
					state.file.opts.sourceRoot
					||
					"./",
				)
			);
		}

		function createLog() {
			return createConsoleLogFromOption(state.opts.log);
		}

		function getNodeModulesPath() {
			return path.join(sourceRootPath, nodeModulesDirectoryName);
		}
	};
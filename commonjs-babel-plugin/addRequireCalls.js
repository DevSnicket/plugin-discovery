/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const path = require("path");

module.exports =
	({
		nodePath,
		requirePaths,
		types: { callExpression, identifier, stringLiteral },
	}) => {
		if (requirePaths.length)
			getParentProgramOfNodePath(
				nodePath,
			)
			.pushContainer(
				"body",
				requirePaths.map(createRequireCallForPath),
			);

		function createRequireCallForPath(
			requirePath,
		) {
			return (
				callExpression(
					identifier("require"),
					[
						stringLiteral(
							getRequirePathWithForwardSlashes(),
						),
					],
				)
			);

			function getRequirePathWithForwardSlashes() {
				const forwardSlash = "/";

				return (
					path.sep === forwardSlash
					?
					requirePath
					:
					requirePath.replace(path.sep, forwardSlash)
				);
			}
		}
	};

function getParentProgramOfNodePath(
	nodePath,
) {
	if (nodePath)
		return (
			nodePath.isProgram()
			?
			nodePath
			:
			getParentProgramOfNodePath(nodePath.parentPath)
		);
	else
		throw Error("Could not find parent file.");
}
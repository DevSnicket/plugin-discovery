const path = require("path");

module.exports =
	({
		callExpression,
		identifier,
		pluginRepositoryNodePath,
		requirePaths,
		stringLiteral,
	}) => {
		getParentProgramOfNodePath(
			pluginRepositoryNodePath,
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
							requirePath
							.replace(
								path.sep,
								"/",
							),
						),
					],
				)
			);
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
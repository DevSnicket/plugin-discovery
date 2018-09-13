const getRelativePath = require("path").relative;

module.exports =
	({
		callExpression,
		identifier,
		pluginRepository,
		requirePaths,
		stringLiteral,
	}) => {
		getParentProgramOfNodePath(
			pluginRepository.nodePath,
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
							getRelativePath(
								pluginRepository.directoryPath,
								requirePath,
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
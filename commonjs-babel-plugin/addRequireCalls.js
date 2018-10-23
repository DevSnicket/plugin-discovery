const path = require("path");

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
							ensureRelativePathPrefix(
								path.relative(
									pluginRepository.directoryPath,
									requirePath,
								)
								.replace(
									path.sep,
									"/",
								),
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

function ensureRelativePathPrefix(
	file,
) {
	return (
		file.startsWith(".")
		?
		file
		:
		`./${file}`
	);
}
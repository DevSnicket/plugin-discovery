const
	addRequireCalls = require("./addRequireCalls"),
	createConsoleLogFromOption = require("./createConsoleLogFromOption"),
	discoverPluginFilePaths = require("./discoverPluginFilePaths"),
	path = require("path");

module.exports =
	({ types }) => {
		const
			syntaxTreeByFilePathCache = new Map(),
			visitedFilePaths = new Set();

		return { visitor: { CallExpression: visitCallExpression } };

		function visitCallExpression(
			nodePath,
			state,
		) {
			const
				log = createConsoleLogFromOption(state.opts.log),
				sourceFilePath = path.resolve(state.file.opts.filename),
				sourceRootPath = path.resolve(state.file.opts.sourceRoot || "./");

			if (!visitedFilePaths.has(sourceFilePath) && isCallOfRequireCreateRepository(nodePath.node)) {
				log.detail(`discovery "${sourceFilePath}"`);

				const sourceDirectoryPath = path.dirname(sourceFilePath);

				visitedFilePaths.add(sourceFilePath);

				const
					sourceFileNameWithoutExtension = path.basename(sourceFilePath, ".js");

				const pluginFiles =
					discoverPluginFilePaths({
						directoryPath:
							sourceRootPath,
						ignoreDirectoryNames:
							state.opts.ignoreDirectoryNames || [ "node_modules" ],
						log:
							{
								discoveredFilePath: filePath => log.detail(`discovered "${filePath}"`),
								warning: log.warning,
							},
						parserOptions:
							state.file.parserOpts,
						pluginRepositoryFile:
							{
								name: sourceFileNameWithoutExtension,
								path: path.join(sourceDirectoryPath, sourceFileNameWithoutExtension),
							},
						syntaxTreeByFilePathCache,
					});

				if (pluginFiles.length)
					addRequireCalls({
						callExpression:
							types.callExpression,
						identifier:
							types.identifier,
						pluginRepository:
							{
								directoryPath: sourceDirectoryPath,
								nodePath,
							},
						requirePaths:
							pluginFiles,
						stringLiteral:
							types.stringLiteral,
					});
			}
		}
	};

function isCallOfRequireCreateRepository(
	callExpression,
) {
	return (
		callExpression.callee.name === "require"
		&&
		callExpression.arguments[0].value === "@devsnicket/plugin-discovery-create-repository"
	);
}
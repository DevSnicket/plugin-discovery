const
	addRequireCalls = require("./addRequireCalls"),
	createConsoleLogFromOption = require("./createConsoleLogFromOption"),
	discoverAndLookupPluginPaths = require("./discoverAndLookupPluginPaths"),
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
			const sourceFilePath = path.resolve(state.file.opts.filename);

			if (!visitedFilePaths.has(sourceFilePath) && isCallOfRequireCreateRepository(nodePath.node)) {
				const log = createConsoleLogFromOption(state.opts.log);

				log.detail(`discovery "${state.file.opts.filename}"`);

				visitedFilePaths.add(sourceFilePath);

				const sourceDirectoryPath = path.dirname(sourceFilePath);

				const pluginPaths =
					discoverAndLookupPluginPaths({
						ignoreDirectoryNames: state.opts.ignoreDirectoryNames,
						log,
						parserOptions: state.file.parserOpts,
						sourceDirectoryPath,
						sourceFilePath,
						sourceRootPath: path.resolve(state.opts.rootDirectory || state.file.opts.sourceRoot || "./"),
						syntaxTreeByFilePathCache,
					});

				if (pluginPaths.length)
					addRequireCalls({
						callExpression:
							types.callExpression,
						identifier:
							types.identifier,
						pluginRepositoryNodePath:
							nodePath,
						requirePaths:
							pluginPaths,
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
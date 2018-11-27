const
	addRequireCalls = require("./addRequireCalls"),
	discoverAndLookupPluginPaths = require("./discoverAndLookupPluginPaths"),
	path = require("path");

module.exports =
	({
		log,
		nodePath,
		sourceFilePath,
		state,
		types,
		walkCallExpressions,
	}) => {
		log.detail(`discovery "${state.file.opts.filename}"`);

		const sourceDirectoryPath = path.dirname(sourceFilePath);

		const pluginPaths =
			discoverAndLookupPluginPaths({
				ignoreDirectoryNames: state.opts.ignoreDirectoryNames,
				log,
				sourceDirectoryPath,
				sourceFilePath,
				sourceRootPath: path.resolve(state.opts.rootDirectory || state.file.opts.sourceRoot || "./"),
				walkCallExpressions,
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
	};
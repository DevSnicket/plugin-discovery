const
	discoverRelative = require("./discoverRelative"),
	lookupForwardersInPackages = require("./lookupForwardersInPackages"),
	path = require("path");

const nodeModulesDirectoryName = "node_modules";

module.exports =
	({
		ignoreDirectoryNames = [ nodeModulesDirectoryName ],
		log,
		parserOptions,
		sourceDirectoryPath,
		sourceFilePath,
		sourceRootPath,
		syntaxTreeByFilePathCache,
	}) => {
		const javascriptFileExtension = ".js";

		const
			nodeModulesPath =
				path.join(sourceRootPath, nodeModulesDirectoryName),
			sourceFileNameWithoutExtension =
				path.basename(sourceFilePath, javascriptFileExtension);

		const
			logRequirePath =
				log.detail,
			repositoryFile =
				{
					name: sourceFileNameWithoutExtension,
					path: getRepositoryPath(),
				};

		return (
			[
				...discoverRelative({
					directoryPath:
						sourceRootPath,
					ignoreDirectoryNames,
					javascriptFileExtension,
					log:
						{
							requirePath: logRequirePath,
							warning: log.warning,
						},
					nodeModulesPath,
					parserOptions,
					repositoryFile,
					sourceDirectoryPath,
					syntaxTreeByFilePathCache,
				}),
				...lookupForwardersInPackages({
					javascriptFileExtension,
					logRequirePath,
					nodeModulesPath,
					repositoryFile,
				}),
			]
		);

		function getRepositoryPath() {
			return (
				path.join(
					sourceDirectoryPath,
					sourceFileNameWithoutExtension,
				)
			);
		}
	};
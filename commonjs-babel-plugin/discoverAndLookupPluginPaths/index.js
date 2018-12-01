const
	discoverRelative = require("./discoverRelative"),
	lookupForwardersInPackages = require("./lookupForwardersInPackages"),
	path = require("path");

module.exports =
	({
		forwarderDirectoryName,
		ignoreDirectoryNames,
		javascriptFileExtension,
		log: { detail: logDetail },
		nodeModulesDirectory,
		sourceFilePath,
		sourceRootPath,
		walkCallExpressions,
	}) => {
		const
			sourceDirectoryPath = path.dirname(sourceFilePath),
			sourceFileNameWithoutExtension = path.basename(sourceFilePath, javascriptFileExtension);

		const
			repositoryFile =
				{
					name: sourceFileNameWithoutExtension,
					path: getRepositoryPath(),
				};

		return (
			[
				...discoverRelative({
					discoverInDirectoryPath:
						sourceRootPath,
					ignoreDirectoryNames:
						ignoreDirectoryNames || [ nodeModulesDirectory.name ],
					javascriptFileExtension,
					logPlugin:
						logDetail,
					nodeModulesPath:
						nodeModulesDirectory.path,
					repositoryFile,
					sourceDirectoryPath,
					sourceRootPath,
					walkCallExpressions,
				}),
				...lookupForwardersInPackages({
					forwarderDirectoryName,
					javascriptFileExtension,
					logForwarder:
						logDetail,
					nodeModulesPath:
						nodeModulesDirectory.path,
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
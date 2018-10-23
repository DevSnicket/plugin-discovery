require("array.prototype.flatmap")
.shim();

const
	{ parse } = require("babylon"),
	fs = require("fs"),
	getPathFromRequireArguments = require("./getPathFromRequireArguments"),
	path = require("path"),
	walk = require("babylon-walk").simple;

module.exports = discoverPluginFilePaths;

function discoverPluginFilePaths({
	directoryPath,
	ignoreDirectoryNames,
	log,
	parserOptions,
	pluginRepositoryFile,
	syntaxTreeByFilePathCache,
}) {
	return (
		fs.readdirSync(directoryPath)
		.flatMap(getPluginFilePathsOfFileOrDirectory)
	);

	function getPluginFilePathsOfFileOrDirectory(
		fileOrDirectory,
	) {
		const fileOrDirectoryPath =
			path.join(`${directoryPath}/${fileOrDirectory}`);

		return (
			discoverWhenInDirectory()
			||
			(isFilePathPlugin(fileOrDirectoryPath) && [ fileOrDirectoryPath ])
			||
			[]
		);

		function discoverWhenInDirectory() {
			return (
				isDirectory()
				&&
				!ignoreDirectoryNames.includes(fileOrDirectory)
				&&
				discoverPluginFilePaths({
					directoryPath: fileOrDirectoryPath,
					ignoreDirectoryNames,
					log,
					parserOptions,
					pluginRepositoryFile,
					syntaxTreeByFilePathCache,
				})
			);

			function isDirectory() {
				return (
					fs.lstatSync(fileOrDirectoryPath)
					.isDirectory()
				);
			}
		}
	}

	function isFilePathPlugin(
		filePath,
	) {
		return (
			filePath !== pluginRepositoryFile.path
			&&
			path.extname(filePath) === ".js"
			&&
			hasJavascriptCallOfPlugInTo(
				fs.readFileSync(
					filePath,
					"utf-8",
				),
			)
		);

		function hasJavascriptCallOfPlugInTo(
			javascript,
		) {
			return (
				!javascript.startsWith("// @flow")
				&&
				javascript.includes(pluginRepositoryFile.name)
				&&
				isInJavascript()
			);

			function isInJavascript() {
				const syntaxTree = cacheSyntaxTree(parseJavascriptOrLogError);

				return syntaxTree && isInSyntaxTree();

				function parseJavascriptOrLogError() {
					try {
						return (
							parse(
								javascript,
								parserOptions,
							)
						);
					} catch (error) {
						if (error instanceof SyntaxError) {
							log.warning(`${filePath}: ${error.message}`);

							return null;
						} else
							throw error;
					}
				}

				function isInSyntaxTree() {
					let found = false;

					walk(
						syntaxTree,
						{ CallExpression: visitCallExpression },
						null,
					);

					return found;

					function visitCallExpression(
						callExpression,
					) {
						if (!found && (found = isRequreOfPluginRepository()))
							log.discoveredFilePath(filePath);

						function isRequreOfPluginRepository() {
							return (
								isRequire()
								&&
								pluginRepositoryFile.path === getPathFromRequire()
							);

							function isRequire() {
								return callExpression.callee.name === "require";
							}

							function getPathFromRequire() {
								return (
									getPathFromRequireArguments({
										arguments: callExpression.arguments,
										filePath,
									})
								);
							}
						}
					}
				}
			}

			function cacheSyntaxTree(
				action,
			) {
				return (
					syntaxTreeByFilePathCache.get(filePath)
					||
					callAndCache()
				);

				function callAndCache() {
					const syntaxTree = action();

					syntaxTreeByFilePathCache.set(filePath, syntaxTree);

					return syntaxTree;
				}
			}
		}
	}
}
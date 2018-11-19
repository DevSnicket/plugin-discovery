require("array.prototype.flatmap")
.shim();

const
	{ parse } = require("babylon"),
	fs = require("fs"),
	getPathFromRequireArguments = require("./getPathFromRequireArguments"),
	path = require("path"),
	walk = require("babylon-walk").simple;

module.exports = discoverRelative;

function discoverRelative({
	directoryPath,
	ignoreDirectoryNames,
	javascriptFileExtension,
	log,
	nodeModulesPath,
	parserOptions,
	repositoryFile,
	sourceDirectoryPath,
	syntaxTreeByFilePathCache,
}) {
	return (
		fs.readdirSync(directoryPath)
		.flatMap(getPluginFilePathsOfFileOrDirectory)
	);

	function getPluginFilePathsOfFileOrDirectory(
		fileOrDirectoryName,
	) {
		const fileOrDirectoryPath =
			path.join(directoryPath, fileOrDirectoryName);

		return (
			discoverWhenInDirectory()
			||
			(isFilePathPlugin(fileOrDirectoryPath) && [ getRelativePath() ])
			||
			[]
		);

		function discoverWhenInDirectory() {
			return (
				isDirectory()
				&&
				!ignoreDirectoryNames.includes(fileOrDirectoryName)
				&&
				discoverRelative({
					directoryPath: fileOrDirectoryPath,
					ignoreDirectoryNames,
					javascriptFileExtension,
					log,
					nodeModulesPath,
					parserOptions,
					repositoryFile,
					sourceDirectoryPath,
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

		function getRelativePath() {
			return (
				ensureRelativePathPrefix(
					path.relative(
						sourceDirectoryPath,
						fileOrDirectoryPath,
					),
				)
			);
		}
	}

	function isFilePathPlugin(
		filePath,
	) {
		return (
			filePath !== repositoryFile.path
			&&
			path.extname(filePath) === javascriptFileExtension
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
				javascript.includes(repositoryFile.name)
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
							log.requirePath(`plug-in "${filePath}"`);

						function isRequreOfPluginRepository() {
							return (
								isRequire()
								&&
								repositoryFile.path === getPathFromRequire()
							);

							function isRequire() {
								return callExpression.callee.name === "require";
							}

							function getPathFromRequire() {
								return (
									getPathFromRequireArguments({
										arguments: callExpression.arguments,
										filePath,
										javascriptFileExtension,
										nodeModulesPath,
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
require("array.prototype.flatmap")
.shim();

const
	fs = require("fs"),
	getPathFromRequireArguments = require("./getPathFromRequireArguments"),
	path = require("path");

module.exports = discoverRelative;

function discoverRelative({
	directoryPath,
	ignoreDirectoryNames,
	javascriptFileExtension,
	logRequirePath,
	nodeModulesPath,
	repositoryFile,
	sourceDirectoryPath,
	walkCallExpressions,
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
					logRequirePath,
					nodeModulesPath,
					repositoryFile,
					sourceDirectoryPath,
					walkCallExpressions,
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
				let found = false;

				walkCallExpressions({
					filePath,
					javascript,
					visit: visitCallExpression,
				});

				return found;

				function visitCallExpression(
					callExpression,
				) {
					if (!found && (found = isRequreOfPluginRepository()))
						logRequirePath(`plug-in "${filePath}"`);

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
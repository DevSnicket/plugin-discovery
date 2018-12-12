require("array.prototype.flatmap")
.shim();

const
	fs = require("fs"),
	getPathOfRequire = require("./getPathOfRequire"),
	getSingleRequireArgument = require("../../getSingleRequireArgument"),
	isRequireCall = require("../../isRequireCall"),
	path = require("path");

module.exports = discoverRelative;

function discoverRelative({
	discoverInDirectoryPath,
	ignoreDirectoryNames,
	javascriptFileExtension,
	logPlugin,
	nodeModulesPath,
	repositoryFile,
	sourceDirectoryPath,
	sourceRootPath,
	walkCallExpressions,
}) {
	return (
		fs.readdirSync(discoverInDirectoryPath)
		.flatMap(getPluginFilePathsOfFileOrDirectory)
	);

	function getPluginFilePathsOfFileOrDirectory(
		fileOrDirectoryName,
	) {
		const fileOrDirectoryPath =
			path.join(discoverInDirectoryPath, fileOrDirectoryName);

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
					discoverInDirectoryPath: fileOrDirectoryPath,
					ignoreDirectoryNames,
					javascriptFileExtension,
					logPlugin,
					nodeModulesPath,
					repositoryFile,
					sourceDirectoryPath,
					sourceRootPath,
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
			filePath !== `${repositoryFile.path}${javascriptFileExtension}`
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
						logPlugin(`plug-in "${path.relative(sourceRootPath, filePath)}"`);

					function isRequreOfPluginRepository() {
						return (
							isRequireCall(callExpression)
							&&
							repositoryFile.path === getPathFromRequireArguments()
						);

						function getPathFromRequireArguments() {
							return (
								getJavascriptPathWithoutExtension(
									getPathOfRequire({
										argument: getSingleRequireArgument(callExpression),
										filePath,
										nodeModulesPath,
									}),
								)
							);
						}
					}
				}

				function getJavascriptPathWithoutExtension(
					javascriptPath,
				) {
					return (
						path.join(
							path.dirname(javascriptPath),
							path.basename(javascriptPath, javascriptFileExtension),
						)
					);
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
const
	{ appendFileSync } = require("fs"),
	fsExtra = require("fs-extra"),
	getSingleRequireArgument = require("./getSingleRequireArgument"),
	isRequireCall = require("./isRequireCall"),
	path = require("path");

module.exports =
	({
		getForwarderPathForRepositoryPath,
		isCreateRepositoryPackage,
		isVisitedRepositoryFilePath,
		javascriptFileExtension,
		log: { detail: logDetail },
		nodeModulesDirectory: { path: nodeModulesDirectoryPath },
		outputDirectoryPath,
		requirePath,
		sourceFilePath,
		sourceRootPath,
		walkCallExpressions,
	}) => {
		const requirePathRelativeToNodeModules =
			ensureJavascriptExtension(requirePath);

		const requireFilePath =
			path.join(
				nodeModulesDirectoryPath,
				requirePathRelativeToNodeModules,
			);

		if (!isVisitedRepositoryFilePath(requireFilePath) && fsExtra.existsSync(requireFilePath))
			walkCallExpressions({
				filePath:
					requireFilePath,
				javascript:
					fsExtra.readFileSync(
						requireFilePath,
						"UTF-8",
					),
				visit:
					visitCallExpression,
			});

		function ensureJavascriptExtension(
			javascriptPath,
		) {
			return (
				path.extname(javascriptPath) === javascriptFileExtension
				?
				javascriptPath
				:
				`${javascriptPath}${javascriptFileExtension}`
			);
		}

		function visitCallExpression(
			callExpression,
		) {
			if (isRequireCreateRepository())
				appendForwarder();

			function isRequireCreateRepository() {
				return (
					isRequireCall(
						callExpression,
					)
					&&
					isCreateRepositoryPackage(
						getSingleRequireArgument(
							callExpression,
						),
					)
				);
			}
		}

		function appendForwarder() {
			const sourceFileRelativeToRootPath =
				path.relative(sourceRootPath, sourceFilePath);

			logDetail(`forwarder written for plug-in ${sourceFileRelativeToRootPath} to package repository ${requirePathRelativeToNodeModules}.`);

			const forwarderRelativePath =
				getForwarderPathForRepositoryPath(
					requirePathRelativeToNodeModules,
				);

			const forwarderDirectoryRelativePath =
				path.dirname(forwarderRelativePath);

			fsExtra.ensureDirSync(
				forwarderDirectoryRelativePath,
			);

			appendFileSync(
				forwarderRelativePath,
				`require("${getPluginPathRelativeToForwarder()}")\n`,
			);

			function getPluginPathRelativeToForwarder() {
				return (
					path.relative(
						forwarderDirectoryRelativePath,
						path.join(
							outputDirectoryPath,
							sourceFileRelativeToRootPath,
						),
					)
				);
			}
		}
	};
const
	addRequireCalls = require("./addRequireCalls"),
	appendToForwarderFileWhenRepositoryRequired = require("./appendToForwarderFileWhenRepositoryRequired"),
	createPerProcessInferOutputDirectoryOrLogErrorWith = require("./createPerProcessInferOutputDirectoryOrLogErrorWith"),
	createPerRunForwardersDirectories = require("./createPerRunForwardersDirectories"),
	createSharedFromState = require("./createSharedFromState"),
	discoverAndLookupPluginPaths = require("./discoverAndLookupPluginPaths"),
	getSingleRequireArgument = require("./getSingleRequireArgument"),
	isRequireCall = require("./isRequireCall"),
	isRequireOfPackage = require("./isRequireOfPackage"),
	path = require("path");

const
	javascriptFileExtension = ".js";

module.exports =
	/**
	 * @returns {{visitor: import("babel-traverse").Visitor}}
	 */
	({ types }) => {
		const
			forwardersDirectories = createPerRunForwardersDirectories(),
			inferOutputDirectoryOrLogErrorWith = createPerProcessInferOutputDirectoryOrLogErrorWith(),
			visitedRepositoryFilePaths = new Set();

		return { visitor: { CallExpression: visitCallExpression } };

		/**
		 * @param {import("babel-traverse").NodePath} nodePath
		 * @param {*} state
		 */
		function visitCallExpression(
			nodePath,
			state,
		) {
			const forwardersDirectory =
				forwardersDirectories.getFromPluginOptions(
					state.opts,
				);

			forwardersDirectory.ensureRemovedOnce();

			if (isRequireCall(nodePath.node))
				visitRequireCall();

			function visitRequireCall() {
				const sourceFilePath = path.resolve(state.file.opts.filename);

				if (!isVisitedRepositoryFilePath(sourceFilePath))
					visitRequireOfPath(
						getSingleRequireArgument(
							nodePath.node,
						),
					);

				function visitRequireOfPath(
					requirePath,
				) {
					if (isCreateRepositoryPackage(requirePath))
						addRequireCallsForCreateRepository();
					else if (isRequireOfPackage(requirePath))
						appendFileWhenForwarder();

					function appendFileWhenForwarder() {
						const shared = createSharedFromState(state);

						const outputDirectoryPath =
							state.opts.outputDirectoryPath
							||
							inferOutputDirectoryOrLogErrorWith(shared.log.warning);

						if (outputDirectoryPath)
							appendToForwarderFileWhenRepositoryRequired({
								...shared,
								getForwarderPathForRepositoryPath:
									forwardersDirectory.getForwarderPathForRepositoryPath,
								isCreateRepositoryPackage,
								isVisitedRepositoryFilePath,
								javascriptFileExtension,
								outputDirectoryPath,
								requirePath,
								sourceFilePath,
							});
					}
				}

				function addRequireCallsForCreateRepository() {
					visitedRepositoryFilePaths.add(sourceFilePath);

					const shared = createSharedFromState(state);

					shared.log.detail(`repository "${state.file.opts.filename}"`);

					deleteForwarder({
						nodeModulesDirectoryPath:
							shared.nodeModulesDirectory.path,
						repositoryPath:
							sourceFilePath,
					});

					addRequireCalls({
						nodePath,
						requirePaths:
							discoverAndLookupPluginPaths({
								...shared,
								forwarderDirectoryName:
									forwardersDirectories.name,
								ignoreDirectoryNames:
									state.opts.ignoreDirectoryNames,
								javascriptFileExtension,
								sourceFilePath,
							}),
						types,
					});
				}

				function deleteForwarder({
					nodeModulesDirectoryPath,
					repositoryPath,
				}) {
					if (repositoryPath.startsWith(nodeModulesDirectoryPath))
						forwardersDirectory.deleteForwarderOfRepositoryPath(
							path.relative(
								nodeModulesDirectoryPath,
								repositoryPath,
							),
						);
				}
			}
		}

		function isVisitedRepositoryFilePath(
			repositoryFilePath,
		) {
			return visitedRepositoryFilePaths.has(repositoryFilePath);
		}
	};

function isCreateRepositoryPackage(
	name,
) {
	return name === "@devsnicket/plugin-discovery-create-repository";
}
const
	fs = require("fs"),
	path = require("path");

module.exports =
	({
		forwarderDirectoryName,
		javascriptFileExtension,
		logForwarder,
		nodeModulesPath,
		repositoryFile,
	}) => {
		return (
			isRepositoryInPackage()
			?
			lookupPackageRepository({
				forwarderDirectoryName,
				getRelativePathWithScope:
					relativePath => relativePath,
				logForwarder,
				nodeModulesPath,
				repositoryPathRelativeToNodeModules:
					getRepositoryPathRelativeToNodeModules(),
			})
			:
			[]
		);

		function isRepositoryInPackage() {
			return repositoryFile.path.startsWith(nodeModulesPath);
		}

		function getRepositoryPathRelativeToNodeModules() {
			return (
				path.relative(
					nodeModulesPath,
					getRepositoryPathWithExtension(),
				)
			);

			function getRepositoryPathWithExtension() {
				return (
					repositoryFile.path.endsWith(javascriptFileExtension)
					?
					repositoryFile.path
					:
					`${repositoryFile.path}${javascriptFileExtension}`
				);
			}
		}
	};

function * lookupPackageRepository({
	forwarderDirectoryName,
	getRelativePathWithScope,
	logForwarder,
	nodeModulesPath,
	repositoryPathRelativeToNodeModules,
}) {
	for (const nodeModuleDirectoryName of fs.readdirSync(nodeModulesPath))
		for (const forwarderPath of getFromNodeModuleDirectoryName(nodeModuleDirectoryName))
			yield forwarderPath;

	function getFromNodeModuleDirectoryName(
		nodeModuleDirectoryName,
	) {
		return (
			getWhenScopeDirectory()
			||
			getFromPackageDirectory()
		);

		function getWhenScopeDirectory() {
			return (
				nodeModuleDirectoryName.startsWith("@")
				&&
				lookupPackageRepository({
					forwarderDirectoryName,
					getRelativePathWithScope:
						relativePath => `${nodeModuleDirectoryName}/${relativePath}`,
					logForwarder,
					nodeModulesPath:
						path.join(nodeModulesPath, nodeModuleDirectoryName),
					repositoryPathRelativeToNodeModules,
				})
			);
		}

		function * getFromPackageDirectory() {
			const forwarderPathRelativeToNodeModules =
				path.join(
					nodeModuleDirectoryName,
					forwarderDirectoryName,
					repositoryPathRelativeToNodeModules,
				);

			if (forwarderExists()) {
				const forwarderPathWithScope =
					getRelativePathWithScope(forwarderPathRelativeToNodeModules);

				logForwarder(`forwarder ${forwarderPathWithScope}`);

				yield forwarderPathWithScope;
			}

			function forwarderExists() {
				return (
					fs.existsSync(
						path.join(nodeModulesPath, forwarderPathRelativeToNodeModules),
					)
				);
			}
		}
	}
}
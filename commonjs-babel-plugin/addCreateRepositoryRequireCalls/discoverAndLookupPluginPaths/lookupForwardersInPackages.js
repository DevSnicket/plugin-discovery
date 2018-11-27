const
	fs = require("fs"),
	path = require("path");

module.exports =
	({
		javascriptFileExtension,
		logRequirePath,
		nodeModulesPath,
		repositoryFile,
	}) => {
		return (
			isRepositoryInPackage()
			?
			lookupPackageRepository({
				getRelativePathWithScope:
					relativePath => relativePath,
				logRequirePath,
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
	getRelativePathWithScope,
	logRequirePath,
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
					getRelativePathWithScope:
						relativePath => `${nodeModuleDirectoryName}/${relativePath}`,
					logRequirePath,
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
					".devsnicket-plugin-discovery",
					repositoryPathRelativeToNodeModules,
				);

			if (forwarderExists()) {
				const forwarderPathWithScope =
					getRelativePathWithScope(forwarderPathRelativeToNodeModules);

				logRequirePath(`forwarder "${forwarderPathWithScope}"`);

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
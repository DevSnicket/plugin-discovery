const
	createPluginPackagesFromScopeCombinations = require("./createPluginPackagesFromScopeCombinations"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	writePluginPackage = require("./writePluginPackage");

const
	makeDirectory = promisify(fs.mkdir);

module.exports =
	directory => {
		const scope = "@devsnicket";

		const pluginPackages =
			createPluginPackagesFromScopeCombinations({
				directory,
				scope,
			});

		const packagePluginDirectoryName = ".devsnicket-plugin-discovery";

		return (
			{
				packages: getPackageDirectories(),
				setup,
				testCases: createTestCases(),
			}
		);

		function getPackageDirectories() {
			return pluginPackages.map(pluginPackage => pluginPackage.directory);
		}

		async function setup() {
			await makeDirectory(
				directory,
			);

			await makeDirectory(
				path.join(directory, scope),
			);

			await Promise.all(
				pluginPackages.map(
					pluginPackage =>
						writePluginPackage({
							...pluginPackage,
							packagePluginDirectoryName,
						}),
				),
			);
		}

		function createTestCases() {
			return (
				pluginPackages.map(
					pluginPackage => {
						const repositoryRelativePath = getRepositoryPath(pluginPackage.repository);

						return (
							{
								expected:
									`module.exports = require("@devsnicket/plugin-discovery-create-repository")();\n\nrequire("${getPackageRepositoryPath()}")`,
								name:
									pluginPackage.name,
								repositoryPath:
									path.join("node_modules", repositoryRelativePath),
							}
						);

						function getPackageRepositoryPath() {
							return `${pluginPackage.name}/${packagePluginDirectoryName}/${repositoryRelativePath}`;
						}
					},
				)
			);
		}

		function getRepositoryPath({
			filename,
			package: _package,
		}) {
			return `${getScopeAsRelativePath(_package.scope)}${_package.name}/${filename}`;
		}
	};

function getScopeAsRelativePath(
	scope,
) {
	return scope && `${scope}/`;
}
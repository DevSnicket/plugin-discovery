const
	createPackageCombinationsFromScope = require("./createPackageCombinationsFromScope"),
	path = require("path"),
	writeForwarder = require("./writeForwarder"),
	writePackage = require("./writePackage"),
	writeRepositoryPackage = require("../writeRepositoryPackage");

module.exports =
	({
		directory,
		repositoryJavascript,
		scope,
	}) => {
		const packageCombinations =
			createPackageCombinationsFromScope({
				nodeModulesDirectory: path.join(directory, "node_modules"),
				scope,
			});

		const packagePluginDirectoryName = ".devsnicket-plugin-discovery";

		beforeAll(
			() =>
				Promise.all(
					packageCombinations.map(writePackages),
				),
		);

		return packageCombinations.map(createTestCase);

		function writePackages(
			packageCombination,
		) {
			return (
				Promise.all(
					[
						writePluginPackage(),
						writeRepositoryPackage({
							directory: packageCombination.repository.package.directory,
							filename: packageCombination.repository.filename,
							javascript: repositoryJavascript,
							name: packageCombination.repository.package.name,
						}),
					],
				)
			);

			async function writePluginPackage() {
				await writePackage(
					packageCombination.plugin,
				);

				await writeForwarder({
					directory: path.join(packageCombination.plugin.directory, packagePluginDirectoryName),
					repository: packageCombination.repository,
				});
			}
		}

		function createTestCase(
			packageCombination,
		) {
			const repositoryRelativePath = getRepositoryPath(packageCombination.repository);

			return (
				{
					expected:
						`${repositoryJavascript}\n\nrequire("${getPackageRepositoryPath()}")`,
					name:
						packageCombination.plugin.name,
					repositoryPath:
						path.join("node_modules", repositoryRelativePath),
				}
			);

			function getPackageRepositoryPath() {
				return `${packageCombination.plugin.name}/${packagePluginDirectoryName}/${repositoryRelativePath}`;
			}
		}
	};

function getRepositoryPath({
	filename,
	package: _package,
}) {
	return `${_package.name}/${filename}`;
}
require("array.prototype.flatmap")
.shim();

const
	createPackageCombinationsFromScope = require("./createPackageCombinationsFromScope"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	writeForwarder = require("./writeForwarder"),
	writePackage = require("./writePackage"),
	writeRepositoryPackage = require("../writeRepositoryPackage");

const
	makeDirectory = promisify(fs.mkdir);

module.exports =
	({
		directory,
		repositoryJavascript,
	}) => {
		const scope = "@devsnicket";

		const packageCombinations =
			createPackageCombinationsFromScope({
				directory,
				scope,
			});

		const packagePluginDirectoryName = ".devsnicket-plugin-discovery";

		beforeAll(setup);

		return (
			{
				packages: getPackageDirectories(),
				testCases: packageCombinations.map(createTestCase),
			}
		);

		function getPackageDirectories() {
			return (
				packageCombinations.flatMap(
					packageCombination =>
						[
							packageCombination.plugin.directory,
							packageCombination.repository.package.directory,
						],
				)
			);
		}

		async function setup() {
			await makeDirectory(
				directory,
			);

			await makeDirectory(
				path.join(directory, scope),
			);

			await Promise.all(
				packageCombinations.map(writePackages),
			);
		}

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
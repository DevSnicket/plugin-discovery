require("array.prototype.flatmap")
.shim();

const
	createPackageCombinationsFromScope = require("./createPackageCombinationsFromScope"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	writeForwarder = require("./writeForwarder"),
	writePackage = require("./writePackage");

const
	makeDirectory = promisify(fs.mkdir),
	writeFile = promisify(fs.writeFile);

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
					[ writePluginPackage(), writeRepositoryPackage() ],
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

			async function writeRepositoryPackage() {
				await writePackage(
					packageCombination.repository.package,
				);

				await writeFile(
					path.join(
						packageCombination.repository.package.directory,
						packageCombination.repository.filename,
					),
					repositoryJavascript,
				);
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
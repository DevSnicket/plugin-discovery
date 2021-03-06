/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	createPackageCombinationsFromScope = require("./createPackageCombinationsFromScope"),
	path = require("path"),
	writeForwarder = require("./writeForwarder"),
	writePackage = require("./writePackage"),
	writePluginFiles = require("./writePluginFiles"),
	writeRepositoryPackage = require("../../../writeRepositoryPackage");

module.exports =
	/** @returns {import('../../TestCase').TestCase[]} */
	({
		directory,
		packagePluginDirectoryName,
		repositoryJavascript,
		scope,
	}) => {
		const packageCombinations =
			createPackageCombinationsFromScope({
				nodeModulesDirectory: path.join(directory, "node_modules"),
				scope,
			});

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

				await Promise.all(
					[
						writePluginFiles(
							packageCombination,
						),
						writeForwarder({
							directory:
								path.join(packageCombination.plugin.directory, packagePluginDirectoryName),
							pluginFilePathsRelativeToPackage:
								packageCombination.plugin.filePathsRelativeToPackage,
							repository:
								packageCombination.repository,
						}),
					],
				);
			}
		}

		function createTestCase(
			packageCombination,
		) {
			const repositoryRelativePath =
				getRepositoryPath(packageCombination.repository);

			return (
				{
					forwarderOrPluginPaths:
						[ getForwarderPath() ],
					name:
						packageCombination.plugin.name,
					repositoryPath:
						path.join("node_modules", repositoryRelativePath),
				}
			);

			function getForwarderPath() {
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
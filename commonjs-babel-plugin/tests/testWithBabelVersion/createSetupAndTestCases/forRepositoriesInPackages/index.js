const
	createPackageNamesAndPlugins = require("./createPackageNamesAndPlugins"),
	createTestCases = require("./createTestCases"),
	setup = require("./setup");

module.exports =
	/**
	 * @returns {import('../../../types').setupAndTestCases}
	 */
	() => {
		const packageNamesAndPluginsAndRepositoryRequires =
			createPackageNamesAndPlugins()
			.map(addRepositoryRequireFromPackageName);

		return (
			{
				setupInDirectory:
					directory =>
						setup({
							directory,
							packageNamesAndPluginsAndRepositoryRequires,
						}),
				testCases:
					createTestCases(
						packageNamesAndPluginsAndRepositoryRequires,
					),
			}
		);

		function addRepositoryRequireFromPackageName({
			packageName,
			plugin,
		}) {
			return (
				{
					packageName,
					plugin,
					repositoryRequire: `${packageName}/repositoryInPackage.js`,
				}
			);
		}
	};
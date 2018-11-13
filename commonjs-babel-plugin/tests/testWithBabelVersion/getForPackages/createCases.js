module.exports =
	() =>
		[
			{
				packageName:
					"plugin-discovery-test-repository-in-package",
				plugin:
					{
						filename: "pluginOfRepositoryInPackage.js",
						toRepositoryPathExpected: "../../",
					},
			},
			{
				packageName:
					"@devsnicket/plugin-discovery-test-repository-in-package",
				plugin:
					{
						filename: "pluginOfRepositoryInScopedPackage.js",
						toRepositoryPathExpected: "../../../",
					},
			},
		]
		.map(
			repositoryInPackage => (
				{
					...repositoryInPackage,
					repositoryPath: `${repositoryInPackage.packageName}/repositoryInScopedPackage.js`,
				}
			),
		);
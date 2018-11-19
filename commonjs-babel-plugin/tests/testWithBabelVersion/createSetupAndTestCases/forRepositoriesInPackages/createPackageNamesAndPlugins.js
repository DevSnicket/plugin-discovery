module.exports =
	() =>
		[
			{
				packageName:
					"repository",
				plugin:
					{
						filename: "pluginOfRepositoryInPackage.js",
						toRepositoryPathExpected: "../../",
					},
			},
			{
				packageName:
					"@devsnicket/repository-with-scope",
				plugin:
					{
						filename: "pluginOfRepositoryInPackageWithScope.js",
						toRepositoryPathExpected: "../../../",
					},
			},
		];
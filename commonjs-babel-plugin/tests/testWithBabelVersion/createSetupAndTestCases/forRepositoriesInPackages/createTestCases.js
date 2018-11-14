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
		.map(addRepository);

function addRepository(
	testCase,
) {
	const repositoryRequire = `${testCase.packageName}/repositoryInScopedPackage.js`;

	return (
		{
			...testCase,
			repositoryRequire,
		}
	);
}
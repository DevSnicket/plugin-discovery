module.exports =
	scope =>
		[
			{
				plugin:
					{
						filename: "pluginOfRepositoryInPackage.js",
						toRepositoryPathExpected: "../../",
					},
				repository:
					createRepositoryForPackage({
						nameInScope: "repository",
						scope: null,
					}),
			},
			{
				plugin:
					{
						filename: "pluginOfRepositoryInPackageWithScope.js",
						toRepositoryPathExpected: "../../../",
					},
				repository:
					createRepositoryForPackage({
						nameInScope: "repository-with-scope",
						scope,
					}),
			},
		];

function createRepositoryForPackage({
	nameInScope,
	scope,
}) {
	const packageName =
		scope
		?
		`${scope}/${nameInScope}`
		:
		nameInScope;

	const filename = "repositoryInPackage.js";

	return (
		{
			filename,
			package:
				{
					name: packageName,
					nameInScope,
					scope,
				},
			require:
				`${packageName}/${filename}`,
		}
	);
}
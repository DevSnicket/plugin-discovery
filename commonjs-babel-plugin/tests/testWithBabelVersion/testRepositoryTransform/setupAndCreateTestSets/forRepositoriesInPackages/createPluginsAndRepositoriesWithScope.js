module.exports =
	scope =>
		[
			{
				plugin:
					{
						filename: "pluginOfRepositoryInPackageTransformed.js",
						toRepositoryPathExpected: "../../",
					},
				repository:
					createRepositoryForPackage({
						nameInScope: "repository-transformed",
						scope: null,
					}),
			},
			{
				plugin:
					{
						filename: "pluginOfRepositoryInPackageWithScopeTransformed.js",
						toRepositoryPathExpected: "../../../",
					},
				repository:
					createRepositoryForPackage({
						nameInScope: "repository-transformed-for-plugin-with-scope",
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

	const filename = `${nameInScope}.js`;

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
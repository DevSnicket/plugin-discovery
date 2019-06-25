/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

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
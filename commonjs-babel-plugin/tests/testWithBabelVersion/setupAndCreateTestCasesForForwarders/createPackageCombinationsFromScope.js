const path = require("path");

module.exports =
	({
		nodeModulesDirectory,
		scope,
	}) => {
		return (
			[
				{
					pluginHasScope: false,
					repositoryHasScope: false,
				},
				{
					pluginHasScope: true,
					repositoryHasScope: false,
				},
				{
					pluginHasScope: false,
					repositoryHasScope: true,
				},
				{
					pluginHasScope: true,
					repositoryHasScope: true,
				},
			]
			.map(createPackageCombination)
		);

		function createPackageCombination({
			pluginHasScope,
			repositoryHasScope,
		}) {
			const nameElementsWithScope =
				{
					plugin: `plugin${getNameSuffixWhenHasScope(pluginHasScope)}`,
					repository: `repository${getNameSuffixWhenHasScope(repositoryHasScope)}`,
				};

			return (
				{
					plugin: createPlugin(),
					repository: createRepository(),
				}
			);

			function getNameSuffixWhenHasScope(
				hasScope,
			) {
				return hasScope ? "-with-scope" : "";
			}

			function createPlugin() {
				const nameInScope = `${nameElementsWithScope.plugin}-of-${nameElementsWithScope.repository}`;

				return (
					{
						directory:
							path.join(
								nodeModulesDirectory,
								pluginHasScope ? path.join(scope, nameInScope) : nameInScope,
							),
						filePathsRelativeToPackage:
							[
								`${nameInScope}.js`,
								`subdirectory/${nameInScope}-in-subdirectory.js`,
							],
						name:
							pluginHasScope ? `${scope}/${nameInScope}` : nameInScope,
					}
				);
			}

			function createRepository() {
				const nameInScope =
					`${nameElementsWithScope.repository}-for-${nameElementsWithScope.plugin}`;

				return (
					{
						filename:
							`${nameInScope}.js`,
						package:
							{
								directory:
									path.join(
										nodeModulesDirectory,
										repositoryHasScope ? path.join(scope, nameInScope) : nameInScope,
									),
								name:
									repositoryHasScope ? `${scope}/${nameInScope}` : nameInScope,
								nameInScope,
								scope:
									repositoryHasScope && scope,
							},
					}
				);
			}
		}
	};
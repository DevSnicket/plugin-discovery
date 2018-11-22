const path = require("path");

module.exports =
	({
		directory,
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
								directory,
								pluginHasScope ? path.join(scope, nameInScope) : nameInScope,
							),
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
							"repository.js",
						package:
							{
								directory:
									path.join(
										directory,
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
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
			.map(createPluginPackage)
		);

		function createPluginPackage({
			pluginHasScope,
			repositoryHasScope,
		}) {
			const nameElementsWithScope =
				{
					plugin: `plugin${getNameSuffixWhenHasScope(pluginHasScope)}`,
					repository: `repository${getNameSuffixWhenHasScope(repositoryHasScope)}`,
				};

			const nameInScope =
				`${nameElementsWithScope.plugin}-of-${nameElementsWithScope.repository}`;

			return (
				{
					directory:
						path.join(
							directory,
							pluginHasScope ? path.join(scope, nameInScope) : nameInScope,
						),
					name:
						pluginHasScope ? `${scope}/${nameInScope}` : nameInScope,
					repository:
						{
							filename:
								"repository.js",
							package:
								{
									name:
										`${nameElementsWithScope.repository}-for-${nameElementsWithScope.plugin}`,
									scope:
										repositoryHasScope ? scope : "",
								},
						},
				}
			);

			function getNameSuffixWhenHasScope(
				hasScope,
			) {
				return hasScope ? "-with-scope" : "";
			}
		}
	};
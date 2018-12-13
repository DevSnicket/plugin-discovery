const path = require("path");

module.exports =
	({
		nodeModulesDirectory,
		scope,
	}) => {
		return (
			[
				{
					pluginHasScope:
						false,
					repository:
						{
							hasScope: false,
							isDirectoryIndex: false,
						},
				},
				{
					pluginHasScope:
						true,
					repository:
						{
							hasScope: false,
							isDirectoryIndex: false,
						},
				},
				{
					pluginHasScope:
						false,
					repository:
						{
							hasScope: true,
							isDirectoryIndex: false,
						},
				},
				{
					pluginHasScope:
						true,
					repository:
						{
							hasScope: true,
							isDirectoryIndex: false,
						},
				},
				{
					pluginHasScope:
						false,
					repository:
						{
							hasScope: false,
							isDirectoryIndex: true,
						},
				},
			]
			.map(createPackageCombination)
		);

		function createPackageCombination({
			pluginHasScope,
			repository,
		}) {
			const nameElementsWithScope =
				{
					plugin: `plugin${getNameSuffixForHasScope(pluginHasScope)}`,
					repository: `repository${getRepositoryNameSuffix()}`,
				};

			return (
				{
					plugin: createPlugin(),
					repository: createRepository(),
				}
			);

			function getRepositoryNameSuffix() {
				return (
					`${getForHasScope()}${getForIsDirectoryIndex()}`
				);

				function getForHasScope() {
					return getNameSuffixForHasScope(repository.hasScope);
				}

				function getForIsDirectoryIndex() {
					return repository.isDirectoryIndex ? "-of-directory-index" : "";
				}
			}

			function getNameSuffixForHasScope(
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
					`${nameElementsWithScope.repository}-transformed-for-${nameElementsWithScope.plugin}`;

				return (
					{
						filename:
							repository.isDirectoryIndex
							?
							"index.js"
							:
							`${nameInScope}.js`,
						package:
							{
								directory:
									path.join(
										nodeModulesDirectory,
										repository.hasScope ? path.join(scope, nameInScope) : nameInScope,
									),
								name:
									repository.hasScope ? `${scope}/${nameInScope}` : nameInScope,
								nameInScope,
								scope:
									repository.hasScope && scope,
							},
					}
				);
			}
		}
	};
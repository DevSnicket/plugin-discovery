module.exports =
	pluginsAndRepositories => {
		return (
			pluginsAndRepositories.map(createTestCase)
		);

		function createTestCase({
			plugin,
			repository,
		}) {
			return (
				{
					name:
						repository.package.name,
					pluginPaths:
						[ `${plugin.toRepositoryPathExpected}${plugin.filename}` ],
					repositoryPath:
						`node_modules/${repository.require}`,
				}
			);
		}
	};
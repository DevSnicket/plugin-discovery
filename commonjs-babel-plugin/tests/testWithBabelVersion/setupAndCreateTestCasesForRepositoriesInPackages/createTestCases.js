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
					forwarderOrPluginPaths:
						[ `${plugin.toRepositoryPathExpected}${plugin.filename}` ],
					name:
						repository.package.name,
					repositoryPath:
						`node_modules/${repository.require}`,
				}
			);
		}
	};
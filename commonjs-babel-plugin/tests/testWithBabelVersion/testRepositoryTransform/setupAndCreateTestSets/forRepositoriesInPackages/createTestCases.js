/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

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
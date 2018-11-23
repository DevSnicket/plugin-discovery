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
					expected:
						formatExpectedForPlugin(plugin),
					name:
						repository.package.name,
					repositoryPath:
						`node_modules/${repository.require}`,
				}
			);
		}
	};

function formatExpectedForPlugin({
	filename,
	toRepositoryPathExpected,
}) {
	return `module.exports = require("@devsnicket/plugin-discovery-create-repository")();\n\nrequire("${toRepositoryPathExpected}${filename}")`;
}
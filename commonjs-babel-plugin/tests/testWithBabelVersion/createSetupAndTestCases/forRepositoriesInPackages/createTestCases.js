module.exports =
	packageNamesAndPluginsAndRepositoryRequires =>
		packageNamesAndPluginsAndRepositoryRequires
		.map(
			({
				packageName,
				plugin,
				repositoryRequire,
			}) => (
				{
					expected:
						formatExpectedForPlugin(plugin),
					name:
						packageName,
					repositoryPath:
						`/node_modules/${repositoryRequire}`,
				}
			),
		);

function formatExpectedForPlugin({
	filename,
	toRepositoryPathExpected,
}) {
	return `module.exports = require("@devsnicket/plugin-discovery-create-repository")();\n\nrequire("${toRepositoryPathExpected}${filename}")`;
}
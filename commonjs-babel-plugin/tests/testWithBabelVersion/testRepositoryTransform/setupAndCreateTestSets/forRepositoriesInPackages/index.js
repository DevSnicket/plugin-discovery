const
	createPluginsAndRepositoriesWithScope = require("./createPluginsAndRepositoriesWithScope"),
	createTestCases = require("./createTestCases"),
	setup = require("./setup");

module.exports =
	/** @returns {import('../../TestCase').TestCase[]} */
	({
		directory,
		repositoryJavascript,
		scope,
	}) => {
		const pluginsAndRepositories =
			createPluginsAndRepositoriesWithScope(
				scope,
			);

		beforeAll(
			() =>
				setup({
					directory,
					pluginsAndRepositories,
					repositoryJavascript,
				}),
		);

		return (
			createTestCases(
				pluginsAndRepositories,
			)
		);
	};
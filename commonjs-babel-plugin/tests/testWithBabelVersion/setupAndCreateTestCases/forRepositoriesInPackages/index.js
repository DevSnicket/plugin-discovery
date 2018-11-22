const
	createPluginsAndRepositories = require("./createPluginsAndRepositories"),
	createTestCases = require("./createTestCases"),
	setup = require("./setup");

module.exports =
	/**
	 * @returns {import('../../../types').testCase[]}
	 */
	({
		directory,
		repositoryJavascript,
	}) => {
		const pluginsAndRepositories =
			createPluginsAndRepositories();

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
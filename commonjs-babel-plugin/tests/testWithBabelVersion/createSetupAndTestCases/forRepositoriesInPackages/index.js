const
	createPluginsAndRepositories = require("./createPluginsAndRepositories"),
	createTestCases = require("./createTestCases"),
	setup = require("./setup");

module.exports =
	/**
	 * @returns {import('../../../types').setupAndTestCases}
	 */
	() => {
		const pluginsAndRepositories =
			createPluginsAndRepositories();

		return (
			{
				setup:
					({
						directory,
						repositoryJavascript,
					}) =>
						setup({
							directory,
							pluginsAndRepositories,
							repositoryJavascript,
						}),
				testCases:
					createTestCases(
						pluginsAndRepositories,
					),
			}
		);
	};
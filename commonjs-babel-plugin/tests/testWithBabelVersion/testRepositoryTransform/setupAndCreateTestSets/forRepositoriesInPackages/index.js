/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

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
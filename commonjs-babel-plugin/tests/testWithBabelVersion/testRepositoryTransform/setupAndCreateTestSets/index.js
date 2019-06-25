/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	forForwarders = require("./forForwarders"),
	forRelative = require("./forRelative"),
	forRepositoriesInPackages = require("./forRepositoriesInPackages");

module.exports =
	({
		directory,
		packagePluginDirectoryName,
		repositoryJavascript,
		scope,
	}) =>
		[
			{
				name:
					"relative",
				testCases:
					forRelative({
						directory,
						repositoryJavascript,
					}),
			},
			{
				name:
					"repositories in packages",
				testCases:
					forRepositoriesInPackages({
						directory,
						repositoryJavascript,
						scope,
					}),
			},
			{
				name:
					"forwarders",
				testCases:
					forForwarders({
						directory,
						packagePluginDirectoryName,
						repositoryJavascript,
						scope,
					}),
			},
		];
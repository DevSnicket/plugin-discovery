const
	forForwarders = require("./forForwarders"),
	forRelative = require("./forRelative"),
	forRepositoriesInPackages = require("./forRepositoriesInPackages");

module.exports =
	({
		directory,
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
						repositoryJavascript,
						scope,
					}),
			},
		];
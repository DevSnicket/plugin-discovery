/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

// cSpell:words devtool pathinfo

const path = require("path");

require("webpack")(
	{
		devtool:
			false,
		// A const will be prepended to this file is written into the test output
		// eslint-disable-next-line no-undef
		entry,
		mode:
			"development",
		module:
			{ rules: [ createBabelRule() ] },
		output:
			{
				// A const will be prepended to this file is written into the test output
				// eslint-disable-next-line no-undef
				filename: outputFileName,
				path: path.resolve("."),
				pathinfo: false,
			},
	},
	(error, statistics) => {
		if (error)
			throw error;
		else if (statistics.hasErrors())
			// To assist in the investigation of errors log to the console as Webpack normally would when run from CLI
			// eslint-disable-next-line no-console
			console.log(statistics.toString());
	},
);

function createBabelRule() {
	return (
		{
			exclude:
				/(node_modules\/(?!repository.*|@devsnicket\/repository.*)|plugin-discovery\/create-repository\/)/,
			test:
				/\.js$/,
			use:
				{
					loader:
						"babel-loader",
					options:
						{
							plugins:
								[
									// A const will be prepended to this file is written into the test output
									// eslint-disable-next-line no-undef
									[ babelPluginPath, { log: "warnings" } ],
								],
						},
				},
		}
	);
}
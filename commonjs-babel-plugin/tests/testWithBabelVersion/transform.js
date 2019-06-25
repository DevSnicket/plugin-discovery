/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const { readFileSync } = require("fs");

module.exports =
	({
		babelCorePackage,
		sourceFilePath,
		transformFunctionName,
	}) => {
		const transform =
			// eslint-disable-next-line global-require
			require(babelCorePackage)[transformFunctionName];

		return (
			transform(
				readFileSync(
					sourceFilePath,
					"utf-8",
				),
				{
					filename:
						sourceFilePath,
					plugins:
						[
							[
								"@devsnicket/plugin-discovery-commonjs-babel-plugin",
								{
									forwarderDirectoryClean: false,
									log: "warnings",
									outputDirectoryPath: process.cwd(),
								},
							],
						],
					sourceFileName:
						sourceFilePath,
				},
			)
			.code
		);
	};
/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	writeFile = promisify(fs.writeFile);

module.exports =
	({
		directory,
		...properties
	}) =>
		writeFile(
			path.join(directory, "package.json"),
			JSON.stringify(
				{
					...properties && properties,
					description: "test",
					license: "UNLICENSED",
					repository: "none",
				},
			),
		);
/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	readFile = promisify(fs.readFile);

module.exports =
	() =>
		readFile(
			path.join(__dirname, "repository.transformed.js"),
			{ encoding: "utf-8" },
		);
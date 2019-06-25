/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	fs = require("fs"),
	{ promisify } = require("util"),
	writePackageJsonFile = require("../../../../../../tests/writePackageJsonFile");

const makeDirectory = promisify(fs.mkdir);

module.exports =
	async({
		directory,
		name,
	}) => {
		await makeDirectory(
			directory,
		);

		await writePackageJsonFile({
			directory,
			name,
			version: "0.0.0",
		});
	};
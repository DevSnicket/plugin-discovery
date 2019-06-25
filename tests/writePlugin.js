/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	{ ensureDir, writeFile } = require("fs-extra"),
	path = require("path");

module.exports =
	async({
		filePath,
		javascript,
	}) => {
		await ensureDir(
			path.dirname(filePath),
		);

		await writeFile(filePath, javascript);
	};
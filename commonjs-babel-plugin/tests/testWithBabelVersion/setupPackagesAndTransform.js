/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	fs = require("fs"),
	path = require("path"),
	setupDirectoryWithPackages = require("../../../tests/setupDirectoryWithPackages"),
	{ promisify } = require("util");

const
	copyFile = promisify(fs.copyFile);

module.exports =
	async({
		babel,
		testDirectory,
		transformFilename,
	}) => {
		await setupDirectoryWithPackages({
			directory:
				testDirectory,
			packages:
				[
					`${babel.corePackage}@${babel.version}`,
					`${babel.cliPackage}@${babel.version}`,
					`babel-loader@${babel.loaderVersion}`,
					"webpack@4",
					"webpack-cli@3",
					path.join(__dirname, "..", ".."),
					path.join(__dirname, "..", "..", "..", "create-repository"),
				],
		});

		await copyFile(
			path.join(__dirname, transformFilename),
			path.join(testDirectory, transformFilename),
		);
	};
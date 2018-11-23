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
		packages,
		testDirectory,
		transformRepositoryFilename,
	}) => {
		await setupDirectoryWithPackages({
			directory:
				testDirectory,
			packages:
				[
					`${babel.corePackage}@${babel.version}`,
					`babel-loader@${babel.loaderVersion}`,
					"webpack@4",
					"webpack-cli@3",
					path.join(__dirname, "..", ".."),
					path.join(__dirname, "..", "..", "..", "create-repository"),
					...packages,
				],
		});

		await copyFile(
			path.join(__dirname, transformRepositoryFilename),
			path.join(testDirectory, transformRepositoryFilename),
		);
	};
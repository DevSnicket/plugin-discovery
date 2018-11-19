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
					path.join(__dirname, "..", ".."),
					...packages,
				],
		});

		await copyFile(
			path.join(__dirname, transformRepositoryFilename),
			path.join(testDirectory, transformRepositoryFilename),
		);
	};
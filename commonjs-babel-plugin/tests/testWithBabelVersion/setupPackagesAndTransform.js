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
		transformRepositoryFilename,
	}) => {
		await setupDirectoryWithPackages({
			directory:
				testDirectory,
			packages:
				[
					`${babel.corePackage}@${babel.version}`,
					path.join("..", "..", "commonjs-babel-plugin"),
				],
		});

		await copyFile(
			path.join(__dirname, transformRepositoryFilename),
			path.join(testDirectory, transformRepositoryFilename),
		);
	};
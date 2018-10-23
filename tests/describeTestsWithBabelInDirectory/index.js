const
	describeTestsOfRuntime = require("./describeTestsOfRuntime"),
	describeTestsOfTransform = require("./describeTestsOfTransform"),
	fs = require("fs"),
	getRepositoryForDirectoryAndTestDescription = require("./getRepositoryForDirectoryAndTestDescription"),
	path = require("path"),
	{ promisify } = require("util");

const makeDirectory = promisify(fs.mkdir);

module.exports =
	({
		babel,
		directory,
	}) => {
		describe(
			`babel ${babel.corePackage} ${babel.version}`,
			testBabel,
		);

		function testBabel() {
			const directoryForBabel =
				path.join(directory, `babel-${babel.version}`);

			beforeAll(
				() => makeDirectory(directoryForBabel),
			);

			describeTestsOfTransform({
				babel,
				getRepositoryForTestDescription,
			});

			describeTestsOfRuntime({
				babel,
				getRepositoryForTestDescription,
			});

			function getRepositoryForTestDescription(
				testDescription,
			) {
				return (
					getRepositoryForDirectoryAndTestDescription({
						directory: directoryForBabel,
						testDescription,
					})
				);
			}
		}
	};
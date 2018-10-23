const
	describeTestsOfRuntime = require("./describeTestsOfRuntime"),
	describeTestsOfTransform = require("./describeTestsOfTransform"),
	fs = require("fs"),
	path = require("path");

const repository =
	{
		filename:
			"repository.js",
		transformed:
			fs.readFileSync(
				path.join(__dirname, "repository.transformed.js"),
				{ encoding: "utf-8" },
			),
	};

module.exports =
	({
		babel,
		directory: outputDirectory,
	}) => {
		describe(
			`babel ${babel.corePackage} ${babel.version}`,
			testBabel,
		);

		function testBabel() {
			const outputDirectoryForBabelVersion =
				path.join(outputDirectory, `babel-${babel.version}`);

			fs.mkdirSync(outputDirectoryForBabelVersion);

			describeTestsOfTransform({
				babel,
				repository:
					{
						directories: getRepositoryDirectoriesFromTestDescription("transform"),
						...repository,
					},
			});

			describeTestsOfRuntime({
				babel,
				repository:
					{
						directories: getRepositoryDirectoriesFromTestDescription("runtime"),
						...repository,
					},
			});

			function getRepositoryDirectoriesFromTestDescription(
				testDescription,
			) {
				const root =
					path.join(
						outputDirectoryForBabelVersion,
						testDescription,
					);

				return (
					{
						root,
						sub: path.join(root, "repositoryInSubdirectory"),
					}
				);
			}
		}
	};
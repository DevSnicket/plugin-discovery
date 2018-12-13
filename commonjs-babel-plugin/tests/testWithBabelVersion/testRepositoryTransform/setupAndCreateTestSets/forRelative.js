const
	createRelativePluginsOfRepositoryFilename = require("../../../../../tests/createRelativePluginsOfRepositoryFilename"),
	fs = require("fs"),
	getPluginJavascript = require("../../../../../tests/getPluginJavascript"),
	path = require("path"),
	{ promisify } = require("util"),
	writePlugin = require("../../../../../tests/writePlugin");

const
	writeFile = promisify(fs.writeFile);

module.exports =
	/** @returns {import('../TestCase').TestCase[]} */
	({
		directory,
		repositoryJavascript,
	}) => {
		const testCases =
			[
				createTestCase({
					name:
						"root",
					repository:
						{
							directory: ".",
							filename: "repositoryInRoot.js",
							filenameForRequire: "repositoryInRoot.js",
						},
				}),
				createTestCase({
					name:
						"sub-directory",
					repository:
						{
							directory: "repositoryInSubdirectory",
							filename: "repositoryInSubdirectory.js",
							filenameForRequire: "repositoryInSubdirectory.js",
						},
				}),
				createTestCase({
					name:
						"file named index in sub-directory",
					repository:
						{
							directory: "repositoryIndexFileInSubdirectory",
							filename: "index.js",
							filenameForRequire: "index.js",
						},
				}),
				createTestCase({
					name:
						"index of sub-directory",
					repository:
						{
							directory: "repositoryIndexOfSubdirectory",
							filename: "index.js",
							filenameForRequire: "",
						},
				}),
			];

		beforeAll(setup);

		return (
			testCases.map(
				testCase => (
					{
						forwarderOrPluginPaths:
							testCase.plugins.map(plugin => `./${plugin.filePath}`),
						name:
							testCase.name,
						repositoryPath:
							path.join(testCase.repository.filePath),
					}
				),
			)
		);

		async function setup() {
			await Promise.all(
				testCases.map(setupTestCase),
			);
		}

		async function setupTestCase({
			plugins,
			repository,
		}) {
			await Promise.all(
				plugins.map(writePluginInRepositoryDirectory),
			);

			await writeRepository(repository);

			async function writePluginInRepositoryDirectory(
				plugin,
			) {
				await writePlugin({
					filePath:
						path.join(directory, repository.directory, plugin.filePath),
					javascript:
						getPluginJavascript({
							repositoryRequire:
								plugin.repositoryRequire,
							value:
								plugin.value,
						}),
				});
			}
		}

		async function writeRepository(
			repository,
		) {
			await writeFile(
				path.join(directory, repository.filePath),
				repositoryJavascript,
			);
		}
	};

function createTestCase({
	name,
	repository,
}) {
	return (
		{
			name,
			plugins:
				createRelativePluginsOfRepositoryFilename(
					repository.filenameForRequire,
				),
			repository:
				{
					...repository,
					filePath:
						path.join(
							repository.directory,
							repository.filename,
						),
				},
		}
	);
}
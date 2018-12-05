const
	getPluginJavascript = require("../../../tests/getPluginJavascript"),
	{ readFile } = require("fs-extra"),
	path = require("path"),
	writePlugin = require("../../../tests/writePlugin"),
	writeRepositoryPackage = require("./writeRepositoryPackage");

/**
 * @param {object} parameters
 * @param {string} parameters.packagePluginDirectoryName
 * @param {string} parameters.repositoryJavascript
 * @param {string} parameters.testDirectory
 * @param {function(string):Promise} parameters.transformFilePath
*/
module.exports =
	({
		packagePluginDirectoryName,
		repositoryJavascript,
		testDirectory,
		transformFilePath,
	}) => {
		const repository =
			{
				filename: "repositoryNotTransformed.js",
				packageName: "repository-not-transformed",
			};

		const plugins =
			createPlugins({
				repositoryRequire: `${repository.packageName}/${repository.filename}`,
				testDirectory,
			});

		beforeAll(
			() =>
				Promise.all(
					[
						setupRepository(),
						...plugins.map(writePlugin),
					],
				),
		);

		test(
			"plug-in transform/forwarder write",
			async() => {
				const pluginsTransformed = [];

				for (const plugin of plugins)
					pluginsTransformed.push(
						// plug-ins transformed in order to match expected forwarder file side-effect
						// eslint-disable-next-line no-await-in-loop
						await transformFilePath(plugin.filePath),
					);

				expect({
					forwarder:
						await readFile(getForwarderPath(), "UTF-8"),
					pluginsTransformed,
				})
				.toEqual({
					forwarder:
						getForwarderExpected(),
					pluginsTransformed:
						plugins.map(plugin => plugin.javascript),
				});
			},
		);

		async function setupRepository() {
			await writeRepositoryPackage({
				directory:
					path.join(testDirectory, "node_modules", repository.packageName),
				filename:
					repository.filename,
				javascript:
					repositoryJavascript,
				name:
					repository.packageName,
			});
		}

		function getForwarderPath() {
			return (
				path.join(
					testDirectory,
					packagePluginDirectoryName,
					repository.packageName,
					repository.filename,
				)
			);
		}

		function getForwarderExpected() {
			return (
				plugins
				.map(plugin => `require("../../${plugin.requirePath}")\n`)
				.join("")
			);
		}
	};

function createPlugins({
	repositoryRequire,
	testDirectory,
}) {
	return (
		[
			createPlugin({
				directory: null,
				filename: "pluginOfRepositoryInPackageNotTransformed.js",
				valueSuffix: "",
			}),
			createPlugin({
				directory: "pluginOfRepositoryInPackageNotTransformedSubdirectory",
				filename: "pluginOfRepositoryInPackageNotTransformedInSubdirectory.js",
				valueSuffix: " in subdirectory",
			}),
		]
	);

	function createPlugin({
		directory,
		filename,
		valueSuffix,
	}) {
		return (
			{
				filePath:
					path.join(testDirectory, directory || "", filename),
				javascript:
					getPluginJavascript({
						repositoryRequire,
						value: `test plug-in of repository in package not transformed${valueSuffix}`,
					}),
				requirePath:
					directory
					?
					`${directory}/${filename}`
					:
					filename,
			}
		);
	}
}
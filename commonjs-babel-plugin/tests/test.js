const
	{ emptyDir } = require("fs-extra"),
	path = require("path"),
	setupAndGetPluginPackagesAndCreateTestCases = require("./setupAndGetPluginPackagesAndCreateTestCases"),
	testWithBabelVersion = require("./testWithBabelVersion");

jest.setTimeout(5 * 60 * 1000);

const directory =
	path.join(__dirname, "output");

beforeAll(() => emptyDir(directory));

const repositoryJavascript =
	"module.exports = require(\"@devsnicket/plugin-discovery-create-repository\")();";

const pluginPackagesAndTestCases =
	setupAndGetPluginPackagesAndCreateTestCases({
		directory: path.join(directory, "node_modules"),
		repositoryJavascript,
	});

describeTestsUsingBabelVersion({
	corePackage: "babel-core",
	loaderVersion: 7,
	transformFunctionName: "transform",
	version: 6,
});

describeTestsUsingBabelVersion({
	corePackage: "@babel/core",
	loaderVersion: 8,
	transformFunctionName: "transformSync",
	version: 7,
});

/**
 * @param {import("./types").babel} babel
 */
function describeTestsUsingBabelVersion(
	babel,
) {
	const testDescription = `babel-${babel.version}`;

	describe(
		testDescription,
		() =>
			testWithBabelVersion({
				babel,
				pluginPackagesAndTestCases,
				repositoryJavascript,
				testDirectory: path.join(directory, testDescription),
			}),
	);
}
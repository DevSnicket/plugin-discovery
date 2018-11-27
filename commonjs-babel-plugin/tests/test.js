const
	{ emptyDir } = require("fs-extra"),
	path = require("path"),
	testWithBabelVersion = require("./testWithBabelVersion");

jest.setTimeout(5 * 60 * 1000);

const directory =
	path.join(__dirname, "output");

beforeAll(() => emptyDir(directory));

const repositoryJavascript =
	"module.exports = require(\"@devsnicket/plugin-discovery-create-repository\")();";

describeTestsUsingBabelVersion({
	cliPackage: "babel-cli",
	corePackage: "babel-core",
	loaderVersion: 7,
	transformFunctionName: "transform",
	version: 6,
});

describeTestsUsingBabelVersion({
	cliPackage: "@babel/cli",
	corePackage: "@babel/core",
	loaderVersion: 8,
	transformFunctionName: "transformSync",
	version: 7,
});

/**
 * @param {import("./Babel").Babel} babel
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
				repositoryJavascript,
				testDirectory: path.join(directory, testDescription),
			}),
	);
}
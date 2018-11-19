require("./types");

const
	createPluginPackageSetupAndPackagesAndTestCases = require("./createPluginPackageSetupAndPackagesAndTestCases"),
	{ emptyDir } = require("fs-extra"),
	path = require("path"),
	testWithBabelVersion = require("./testWithBabelVersion");

jest.setTimeout(5 * 60 * 1000);

const directory =
	path.join(__dirname, "output");

const
	pluginPackageSetupAndPackagesAndTestCases =
		createPluginPackageSetupAndPackagesAndTestCases(
			path.join(directory, "plugin-packages"),
		);

beforeAll(
	async() => {
		await emptyDir(directory);

		await pluginPackageSetupAndPackagesAndTestCases.setup();
	},
);

describeUsingBabelVersion({
	corePackage: "babel-core",
	transformFunctionName: "transform",
	version: 6,
});

describeUsingBabelVersion({
	corePackage: "@babel/core",
	transformFunctionName: "transformSync",
	version: 7,
});

/**
 * @param {import("./types").babel} babel
 */
function describeUsingBabelVersion(
	babel,
) {
	const testDescription = `babel-${babel.version}`;

	describe(
		testDescription,
		() =>
			testWithBabelVersion({
				babel,
				pluginPackagesAndTestCases: pluginPackageSetupAndPackagesAndTestCases,
				testDirectory: path.join(directory, testDescription),
			}),
	);
}
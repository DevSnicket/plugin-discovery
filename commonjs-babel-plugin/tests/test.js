const
	{ emptyDir } = require("fs-extra"),
	path = require("path"),
	testWithBabelVersion = require("./testWithBabelVersion");

jest.setTimeout(5 * 60 * 1000);

const testDirectory = path.join(__dirname, "output");

beforeAll(
	() => emptyDir(testDirectory),
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

function describeUsingBabelVersion(
	babel,
) {
	const testDescription = `babel-${babel.version}`;

	describe(
		testDescription,
		() =>
			testWithBabelVersion({
				babel,
				testDirectory: path.join(testDirectory, testDescription),
			}),
	);
}
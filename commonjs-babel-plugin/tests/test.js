const
	deleteDirectoryContents = require("../../tests/deleteDirectoryContents"),
	describeTestsWithBabelInDirectory = require("./describeTestsWithBabelInDirectory"),
	fs = require("fs"),
	path = require("path");

const directory = path.join(__dirname, "output");

if (fs.existsSync(directory))
	deleteDirectoryContents(directory);
else
	fs.mkdirSync(directory);

jest.setTimeout(5 * 60 * 1000);

describeTestsWithBabelInDirectory({
	corePackage: "babel-core",
	directory,
	transformFunctionName: "transform",
	version: 6,
});

describeTestsWithBabelInDirectory({
	corePackage: "@babel/core",
	directory,
	transformFunctionName: "transformSync",
	version: 7,
});
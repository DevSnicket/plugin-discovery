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
	babel:
		{
			corePackage: "babel-core",
			transformFunctionName: "transform",
			version: 6,
		},
	directory,
});

describeTestsWithBabelInDirectory({
	babel:
		{
			corePackage: "@babel/core",
			transformFunctionName: "transformSync",
			version: 7,
		},
	directory,
});
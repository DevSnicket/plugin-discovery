const
	fs = require("fs"),
	path = require("path");

module.exports =
	({
		babelVersion,
		directory,
	}) => {
		writeJsonTestFile({
			content: createPackageJson(),
			testFile: "package.json",
		});

		writeJsonTestFile({
			content: createBabelrc(),
			testFile: ".babelrc",
		});

		function writeJsonTestFile({
			content,
			testFile,
		}) {
			fs.writeFileSync(
				path.join(directory, testFile),
				JSON.stringify(content),
			);
		}

		function createPackageJson() {
			return (
				{
					description: `test for babel version ${babelVersion}`,
					license: "UNLICENSED",
					repository: "none",
				}
			);
		}
	};

function createBabelrc() {
	return (
		{
			plugins:
				[
					[
						path.join(__dirname, "..", "..", "..", "commonjs-babel-plugin", "index.js"),
						{ log: "warnings" },
					],
				],
		}
	);
}
const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const writeFile = promisify(fs.writeFile);

module.exports =
	async({
		babelVersion,
		directory,
	}) => {
		await writeJsonTestFile({
			content: createPackageJson(),
			testFile: "package.json",
		});

		await writeJsonTestFile({
			content: createBabelrc(),
			testFile: ".babelrc",
		});

		async function writeJsonTestFile({
			content,
			testFile,
		}) {
			await writeFile(
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
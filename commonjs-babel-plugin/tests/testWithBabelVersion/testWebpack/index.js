const
	createEntryJavascriptFromTestCases = require("./createEntryJavascriptFromTestCases"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	readFile = promisify(fs.readFile),
	writeFile = promisify(fs.writeFile);

module.exports =
	({
		directory,
		testCases,
	}) => {
		const entryFilename = "webpack-entry.js";

		test(
			"Webpack",
			async() => {
				await Promise.all(
					[
						writeEntryFile(),
						writeRunFile(),
					],
				);

				expect(true)
				.toBe(true);
			},
		);

		async function writeEntryFile() {
			await writeFile(
				path.join(directory, entryFilename),
				createEntryJavascriptFromTestCases(testCases),
			);
		}

		async function writeRunFile() {
			await writeFile(
				path.join(directory, "webpack-run.js"),
				await getRunJavascript(),
			);

			async function getRunJavascript() {
				return (
					[
						...formatValuesAsConsts({
							babelPluginPath: getBabelPluginPath(),
							entry: `./${entryFilename}`,
						}),
						await readRunJavascriptTemplate(),
					]
					.join("\n")
				);

				function getBabelPluginPath() {
					return (
						path.relative(
							directory,
							path.join(__dirname, "..", "..", ".."),
						)
					);
				}

				function formatValuesAsConsts(
					constants,
				) {
					return (
						Object.entries(constants)
						.map(
							([ name, value ]) =>
								`const ${name} = "${value}";`,
						)
					);
				}

				function readRunJavascriptTemplate() {
					return readFile(
						path.join(__dirname, "webpack-run.js"),
					);
				}
			}
		}
	};
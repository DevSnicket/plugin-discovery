const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	readFile = promisify(fs.readFile);

module.exports =
	async({
		directory,
		entryFilename,
		outputFileName,
	}) => {
		return (
			[
				...formatValuesAsConstants({
					babelPluginPath: getBabelPluginPath(),
					entry: `./${entryFilename}`,
					outputFileName,
				}),
				await readRunJavascriptTemplate(),
			]
			.join("\n")
		);

		function getBabelPluginPath() {
			return (
				path.relative(
					directory,
					path.join(__dirname, "..", "..", "..", "..", ".."),
				)
			);
		}

		function formatValuesAsConstants(
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
	};
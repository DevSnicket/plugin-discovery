const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	writePackageJsonFile = require("../../tests/writePackageJsonFile");

const
	makeDirectory = promisify(fs.mkdir),
	writeFile = promisify(fs.writeFile);

module.exports =
	async({
		directory,
		filename,
		javascript,
		name,
	}) => {
		await makeDirectory(
			directory,
		);

		await writePackageJsonFile({
			dependencies: getDependencies(),
			directory,
			name,
			version: "0.0.0",
		});

		await writeFile(
			path.join(
				directory,
				filename,
			),
			javascript,
		);

		function getDependencies() {
			return (
				{
					"@devsnicket/plugin-discovery-create-repository":
						`file:${getCreateRepositoryPath()}`,
				}
			);

			function getCreateRepositoryPath() {
				return (
					path.relative(
						directory,
						path.join(__dirname, "..", "..", "create-repository"),
					)
				);
			}
		}
	};
const
	callModuleInProcess = require("../../tests/callModuleInProcess"),
	createRelativePluginsOfRepositoryFilename = require("../../tests/createRelativePluginsOfRepositoryFilename"),
	fs = require("fs"),
	getPluginJavascript = require("../../tests/getPluginJavascript"),
	path = require("path"),
	{ promisify } = require("util"),
	readRepositoryTransformed = require("./readRepositoryTransformed"),
	setupDirectoryWithPackages = require("../../tests/setupDirectoryWithPackages"),
	writePlugin = require("../../tests/writePlugin");

const
	copyFile = promisify(fs.copyFile),
	writeFile = promisify(fs.writeFile);

jest.setTimeout(5 * 60 * 1000);

test(
	"iterate repository",
	testIterateRepository,
);

async function testIterateRepository() {
	const
		directory = path.join(__dirname, "output"),
		iterateRepositoryFilename = "iterateRepository.js";

	const repository =
		{
			filename: "repository.js",
			transformed: await readRepositoryTransformed(),
		};

	const plugins =
		createRelativePluginsOfRepositoryFilename(
			repository.filename,
		);

	await setupDirectoryWithPackages({
		directory,
		packages: [ path.join("..", "..", "create-repository") ],
	});

	await Promise.all(
		plugins.map(
			plugin =>
				writePlugin({
					filePath:
						path.join(directory, plugin.filePath),
					javascript:
						getPluginJavascript({
							repositoryRequire:
								plugin.repositoryRequire,
							value:
								plugin.value,
						}),
				}),
		),
	);

	await copyFile(
		path.join(__dirname, iterateRepositoryFilename),
		path.join(directory, iterateRepositoryFilename),
	);

	await writeFile(
		path.join(directory, repository.filename),
		repository.transformed,
	);

	expect(
		await callModuleInProcess({
			argument:
				path.join(directory, repository.filename),
			directory,
			moduleFile:
				iterateRepositoryFilename,
		}),
	)
	.toEqual(
		plugins.map(plugin => plugin.value),
	);
}
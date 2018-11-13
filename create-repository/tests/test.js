const
	callModuleInProcess = require("../../tests/callModuleInProcess"),
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util"),
	readRepositoryTransformed = require("../../tests/readRepositoryTransformed"),
	setupDirectoryWithPackages = require("../../tests/setupDirectoryWithPackages"),
	writePlugins = require("../../tests/writePlugins");

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

	await setupDirectoryWithPackages({
		directory,
		packages: [ path.join("..", "..", "create-repository") ],
	});

	await writePlugins({
		directory,
		repositoryFilename: repository.filename,
	});

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
		[
			"test plug-in",
			"test sub-directory plug-in of repository in parent directory",
		],
	);
}
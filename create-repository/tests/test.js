const
	callModuleInProcess = require("../../tests/callModuleInProcess"),
	fs = require("fs"),
	getRepositoryForDirectory = require("../../tests/getRepositoryForDirectory"),
	path = require("path"),
	{ promisify } = require("util"),
	setupForRepositoryDirectories = require("../../tests/setupForRepositoryDirectories");

const
	copyFile = promisify(fs.copyFile),
	writeFile = promisify(fs.writeFile);

jest.setTimeout(5 * 60 * 1000);

const iterateRepositoryFilename = "iterateRepository.js";

let repository = null;

beforeAll(
	async() => {
		repository =
			await getRepositoryForDirectory(
				path.join(__dirname, "output"),
			);

		await setupForRepositoryDirectories({
			packages: [ path.join("..", "..", "create-repository") ],
			repository,
		});

		await copyFile(
			path.join(__dirname, iterateRepositoryFilename),
			path.join(repository.directories.root, iterateRepositoryFilename),
		);
	},
);

test(
	"in root directory",
	() =>
		testRuntimeInDirectory(
			repository.directories.root,
		),
);

test(
	"in sub-directory",
	() =>
		testRuntimeInDirectory(
			repository.directories.sub,
		),
);

async function testRuntimeInDirectory(
	directory,
) {
	await writeFile(
		path.join(directory, repository.filename),
		repository.transformed,
	);

	expect(
		await callModuleInProcess({
			argument:
				path.join(directory, repository.filename),
			directory:
				repository.directories.root,
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
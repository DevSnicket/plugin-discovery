const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	deleteFile = promisify(fs.unlinkSync),
	getFileOrDirectoryStatistics = promisify(fs.lstat),
	readDirectory = promisify(fs.readdir),
	removeDirectory = promisify(fs.rmdir);

module.exports = deleteDirectoryContents;

async function deleteDirectoryContents(
	directory,
) {
	await Promise.all(
		(await readDirectory(directory))
		.map(
			fileOrDirectoryName =>
				deleteFileOrDirectory(
					path.join(directory, fileOrDirectoryName),
				),
		),
	);

	async function deleteFileOrDirectory(
		fileOrDirectory,
	) {
		if (await isDirectory())
			await deleteDirectory(fileOrDirectory);
		else
			await deleteFile(fileOrDirectory);

		async function isDirectory() {
			return (
				(await getFileOrDirectoryStatistics(fileOrDirectory))
				.isDirectory()
			);
		}
	}
}

async function deleteDirectory(
	directory,
) {
	await deleteDirectoryContents(directory);
	await removeDirectory(directory);
}
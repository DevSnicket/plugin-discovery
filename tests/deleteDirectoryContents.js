const
	fs = require("fs"),
	path = require("path");

module.exports = deleteDirectoryContents;

function deleteDirectoryContents(
	directory,
) {
	for (const fileOrDirectoryName of fs.readdirSync(directory))
		deleteFileOrDirectory(
			path.join(directory, fileOrDirectoryName),
		);

	function deleteFileOrDirectory(
		fileOrDirectory,
	) {
		if (isDirectory())
			deleteDirectory(fileOrDirectory);
		else
			fs.unlinkSync(fileOrDirectory);

		function isDirectory() {
			return (
				fs.lstatSync(fileOrDirectory)
				.isDirectory()
			);
		}
	}
}

function deleteDirectory(
	directory,
) {
	deleteDirectoryContents(directory);

	fs.rmdirSync(directory);
}
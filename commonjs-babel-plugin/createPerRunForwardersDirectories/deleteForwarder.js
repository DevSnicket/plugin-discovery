const
	fs = require("fs"),
	path = require("path");

module.exports =
	({
		forwarderFilePath,
		forwardersDirectoryPath,
	}) => {
		if (fs.existsSync(forwarderFilePath)) {
			fs.unlinkSync(forwarderFilePath);

			withRootDirectory(
				forwardersDirectoryPath,
			)
			.removeEmptyAncestorDirectoriesOf(
				forwarderFilePath,
			);
		}
	};

function withRootDirectory(
	rootDirectory,
) {
	return { removeEmptyAncestorDirectoriesOf };

	function removeEmptyAncestorDirectoriesOf(
		directoryPath,
	) {
		const parentDirectoryPath = path.dirname(directoryPath);

		if (isEmpty()) {
			fs.rmdirSync(parentDirectoryPath);

			if (!isRoot())
				removeEmptyAncestorDirectoriesOf(parentDirectoryPath);
		}

		function isRoot() {
			return parentDirectoryPath === rootDirectory;
		}

		function isEmpty() {
			return !fs.readdirSync(parentDirectoryPath).length;
		}
	}
}
/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

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
const
	deleteForwarder = require("./deleteForwarder"),
	{ removeSync } = require("fs-extra"),
	path = require("path");

module.exports =
	() => {
		const
			name = ".devsnicket-plugin-discovery",
			removedDirectories = new Set();

		return (
			{
				getFromPluginOptions,
				name,
			}
		);

		function getFromPluginOptions({
			forwarderParentDirectoryPath: parentDirectoryPath,
			forwarderDirectoryClean: isToBeRemoved,
		}) {
			const forwardersDirectoryPath =
				path.join(
					parentDirectoryPath || ".",
					name,
				);

			return (
				{
					deleteForwarderOfRepositoryPath,
					ensureRemovedOnce,
					getForwarderPathForRepositoryPath,
				}
			);

			function deleteForwarderOfRepositoryPath(
				repositoryPath,
			) {
				deleteForwarder({
					forwarderFilePath:
						getForwarderPathForRepositoryPath(
							repositoryPath,
						),
					forwardersDirectoryPath,
				});
			}

			function ensureRemovedOnce() {
				if (isToBeRemoved !== false && !hasBeenEmptied()) {
					removeSync(forwardersDirectoryPath);

					removedDirectories.add(forwardersDirectoryPath);
				}

				function hasBeenEmptied() {
					return removedDirectories.has(forwardersDirectoryPath);
				}
			}

			function getForwarderPathForRepositoryPath(
				repositoryPath,
			) {
				return (
					path.join(
						forwardersDirectoryPath,
						repositoryPath,
					)
				);
			}
		}
	};
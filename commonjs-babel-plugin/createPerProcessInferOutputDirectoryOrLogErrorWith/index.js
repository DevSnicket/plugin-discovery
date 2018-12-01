const inferFromProcessArgumentsOrGetError = require("./inferFromProcessArgumentsOrGetError");

module.exports =
	() => {
		let outputDirectoryPathOrError = null;

		return inferOutputDirectoryOrLogErrorWith;

		function inferOutputDirectoryOrLogErrorWith(
			logError,
		) {
			if (!outputDirectoryPathOrError) {
				outputDirectoryPathOrError = inferFromProcessArgumentsOrGetError(process.argv);

				if (outputDirectoryPathOrError.error)
					logError(outputDirectoryPathOrError.error);
			}

			return outputDirectoryPathOrError.path;
		}
	};
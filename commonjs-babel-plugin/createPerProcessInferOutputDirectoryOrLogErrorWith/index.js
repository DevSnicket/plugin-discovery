/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

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
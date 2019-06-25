/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const potentialParameters = [ "-d", "--out-dir" ];

module.exports =
	processArguments => {
		const parameterIndex =
			processArguments.findIndex(
				argument => potentialParameters.includes(argument),
			);

		return (
			parameterIndex >= 0
			?
			getArgumentAfterParameterIndex()
			:
			createParameterError(`parameters ${potentialParameters.join(" ")}`)
		);

		function getArgumentAfterParameterIndex() {
			const argumentIndex = parameterIndex + 1;

			return (
				argumentIndex < processArguments.length
				?
				{ path: processArguments[parameterIndex + 1] }
				:
				createParameterError(`parameter ${processArguments[parameterIndex]} as it was not followed by a value`)
			);
		}
	};

function createParameterError(
	parameterMessage,
) {
	return { error: `default output directory path could not be inferred from Babel process ${parameterMessage}.` };
}
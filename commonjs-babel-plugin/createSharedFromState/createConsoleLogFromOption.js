/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

/* eslint-disable no-console */

module.exports =
	option => (
		{
			detail:
				!option || option === "detail"
				?
				detail => console.log(formatLogMessage(detail))
				:
				() => null,
			warning:
				warning => console.warn(formatLogMessage(warning)),
		}
	);

function formatLogMessage(
	message,
) {
	return `DevSnicket plug-in discovery ${message}`;
}
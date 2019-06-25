/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

process.on(
	"message",
	({
		argument,
		moduleFile,
	}) =>
		Promise.resolve(
			// eslint-disable-next-line global-require
			require(moduleFile)(argument),
		)
		.then(
			sendWhenDefinedAndExit,
		),
);

function sendWhenDefinedAndExit(
	value,
) {
	// eslint-disable-next-line no-undefined
	if (value !== undefined)
		process.send(value);

	// eslint-disable-next-line no-process-exit
	process.exit();
}

const timeoutDurationInMilliseconds = 5 * 60 * 1000;

setTimeout(
	() => {
		throw Error(`Forked client process timeout ${timeoutDurationInMilliseconds} after milliseconds.`);
	},
	timeoutDurationInMilliseconds,
);
process.on(
	"message",
	({
		argument,
		moduleFile,
	}) =>
		// eslint-disable-next-line global-require
		require(
			moduleFile,
		)({
			...argument,
			callback,
		}),
);

function callback(
	result,
) {
	// eslint-disable-next-line no-undefined
	if (result !== undefined)
		process.send(result);

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
module.exports =
	({
		callback,
		repositoryFile,
	}) =>
		callback(
			// eslint-disable-next-line global-require
			[ ...require(repositoryFile) ],
		);
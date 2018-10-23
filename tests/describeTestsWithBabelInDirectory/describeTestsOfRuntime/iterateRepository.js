module.exports =
	repositoryFile =>
		// eslint-disable-next-line global-require
		[ ...require(repositoryFile) ];
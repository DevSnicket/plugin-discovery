module.exports =
	/** @param {string} require */
	require =>
		require[0] !== "."
		&&
		require[0] !== "/";
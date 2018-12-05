module.exports =
	({
		repositoryRequire,
		value,
	}) =>
		`require("${repositoryRequire}").plugIn("${value}");`;
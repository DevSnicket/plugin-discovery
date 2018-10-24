module.exports =
	({
		babelCorePackage,
		repositoryFile,
		transformFunctionName,
	}) => {
		const transform =
			// eslint-disable-next-line global-require
			require(babelCorePackage)[transformFunctionName];

		return (
			transform(
				"module.exports = require(\"@devsnicket/plugin-discovery-create-repository\")();",
				{
					filename: repositoryFile,
					sourceFileName: repositoryFile,
				},
			)
			.code
		);
	};
module.exports =
	({
		callback,
		babelCorePackage,
		repositoryFile,
		transformFunctionName,
	}) => {
		const transform =
			// eslint-disable-next-line global-require
			require(babelCorePackage)[transformFunctionName];

		callback(
			transform(
				"module.exports = require(\"@devsnicket/plugin-discovery-create-repository\")();",
				{
					filename: repositoryFile,
					sourceFileName: repositoryFile,
				},
			)
			.code,
		);
	};
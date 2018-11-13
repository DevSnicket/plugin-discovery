module.exports =
	({
		babelCorePackage,
		repositoryPath,
		transformFunctionName,
	}) => {
		const transform =
			// eslint-disable-next-line global-require
			require(babelCorePackage)[transformFunctionName];

		return (
			transform(
				"module.exports = require(\"@devsnicket/plugin-discovery-create-repository\")();",
				{
					filename:
						repositoryPath,
					plugins:
						[
							[
								"@devsnicket/plugin-discovery-commonjs-babel-plugin",
								{ log: "warnings" },
							],
						],
					sourceFileName:
						repositoryPath,
				},
			)
			.code
		);
	};
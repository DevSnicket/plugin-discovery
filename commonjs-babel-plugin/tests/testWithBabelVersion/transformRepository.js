const { readFileSync } = require("fs");

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
				readFileSync(
					repositoryPath,
					"utf-8",
				),
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
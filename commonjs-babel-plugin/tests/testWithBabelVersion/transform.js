const { readFileSync } = require("fs");

module.exports =
	({
		babelCorePackage,
		sourceFilePath,
		transformFunctionName,
	}) => {
		const transform =
			// eslint-disable-next-line global-require
			require(babelCorePackage)[transformFunctionName];

		return (
			transform(
				readFileSync(
					sourceFilePath,
					"utf-8",
				),
				{
					filename:
						sourceFilePath,
					plugins:
						[
							[
								"@devsnicket/plugin-discovery-commonjs-babel-plugin",
								{ log: "warnings" },
							],
						],
					sourceFileName:
						sourceFilePath,
				},
			)
			.code
		);
	};
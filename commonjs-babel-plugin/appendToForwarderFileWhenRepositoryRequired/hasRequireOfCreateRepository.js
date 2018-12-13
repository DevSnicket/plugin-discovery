const
	fsExtra = require("fs-extra"),
	getSingleRequireArgument = require("../getSingleRequireArgument"),
	isRequireCall = require("../isRequireCall");

module.exports =
	({
		isCreateRepositoryPackage,
		requireFilePath,
		walkCallExpressions,
	}) => {
		let found = false;

		walkCallExpressions({
			filePath:
				requireFilePath,
			javascript:
				fsExtra.readFileSync(
					requireFilePath,
					"UTF-8",
				),
			visit:
				visitCallExpression,
		});

		return found;

		function visitCallExpression(
			callExpression,
		) {
			if (!found)
				found = isRequireCreateRepository();

			function isRequireCreateRepository() {
				return (
					isRequireCall(
						callExpression,
					)
					&&
					isCreateRepositoryPackage(
						getSingleRequireArgument(
							callExpression,
						),
					)
				);
			}
		}
	};
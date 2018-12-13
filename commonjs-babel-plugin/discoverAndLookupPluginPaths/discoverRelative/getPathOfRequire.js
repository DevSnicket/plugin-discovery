const
	isRequireOfPackage = require("../../isRequireOfPackage"),
	path = require("path");

module.exports =
	({
		argument,
		filePath,
		nodeModulesPath,
	}) => {
		return (
			getWhenPackage()
			||
			getAsRelative()
		);

		function getWhenPackage() {
			return (
				isRequireOfPackage(argument)
				&&
				path.join(
					nodeModulesPath,
					argument,
				)
			);
		}

		function getAsRelative() {
			return (
				path.join(
					path.dirname(filePath),
					argument,
				)
			);
		}
	};
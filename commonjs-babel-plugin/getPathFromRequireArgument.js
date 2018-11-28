const path = require("path");

module.exports =
	({
		argument,
		filePath,
		javascriptFileExtension,
		nodeModulesPath,
	}) => {
		return (
			argument
			&&
			(getWhenRelative() || getAsPackage())
		);

		function getWhenRelative() {
			return (
				argument[0] === "."
				&&
				path.join(
					path.dirname(filePath),
					getPathWithoutExtension(),
				)
			);
		}

		function getAsPackage() {
			return (
				path.join(
					nodeModulesPath,
					getPathWithoutExtension(),
				)
			);
		}

		function getPathWithoutExtension() {
			return (
				argument.endsWith(javascriptFileExtension)
				?
				argument.substring(0, argument.length - javascriptFileExtension.length)
				:
				argument
			);
		}
	};
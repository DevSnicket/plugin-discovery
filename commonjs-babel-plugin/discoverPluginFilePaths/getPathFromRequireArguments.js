const path = require("path");

module.exports =
	({
		arguments: _arguments,
		filePath,
		nodeModulesPath,
	}) => {
		return (
			_arguments.length === 1
			&&
			getWhenArgumentHasValue(_arguments[0].value)
		);

		function getWhenArgumentHasValue(
			value,
		) {
			return (
				value
				&&
				(getWhenRelative() || getAsPackage())
			);

			function getWhenRelative() {
				return (
					value[0] === "."
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
				const extension = ".js";

				return (
					value.endsWith(extension)
					?
					value.substring(0, value.length - extension.length)
					:
					value
				);
			}
		}
	};
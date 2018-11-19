const path = require("path");

module.exports =
	({
		arguments: _arguments,
		filePath,
		javascriptFileExtension,
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
				return (
					value.endsWith(javascriptFileExtension)
					?
					value.substring(0, value.length - javascriptFileExtension.length)
					:
					value
				);
			}
		}
	};
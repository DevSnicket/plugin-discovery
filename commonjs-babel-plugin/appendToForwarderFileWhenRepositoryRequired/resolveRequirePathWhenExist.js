const
	fsExtra = require("fs-extra"),
	path = require("path");

module.exports =
	({
		javascriptFileExtension,
		nodeModulesDirectoryPath,
		requirePath,
	}) => {
		return (
			hasJavascriptExtension()
			?
			resolveWhenFileExists(requirePath)
			:
			getInferedWhenFileExists()
		);

		function hasJavascriptExtension() {
			return path.extname(requirePath) === javascriptFileExtension;
		}

		function getInferedWhenFileExists() {
			return (
				resolveWhenFileExists(
					`${requirePath}${javascriptFileExtension}`,
				)
				||
				resolveWhenFileExists(
					`${requirePath}/index.js`,
				)
			);
		}

		function resolveWhenFileExists(
			relativeToNodeModules,
		) {
			const absolute =
				path.join(
					nodeModulesDirectoryPath,
					relativeToNodeModules,
				);

			return (
				fsExtra.existsSync(absolute)
				&&
				{
					absolute,
					relativeToNodeModules,
				}
			);
		}
	};
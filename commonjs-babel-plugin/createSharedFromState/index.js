const
	createConsoleLogFromOption = require("./createConsoleLogFromOption"),
	createWalkCallExpressions = require("./createWalkCallExpressions"),
	path = require("path");

const nodeModulesDirectoryName = "node_modules";

module.exports =
	state => {
		const
			log = createLog(),
			sourceRootPath = resolveSourceRootPath();

		return (
			{
				log,
				nodeModulesDirectory:
					{
						name: nodeModulesDirectoryName,
						path: getNodeModulesPath(),
					},
				sourceRootPath,
				walkCallExpressions:
					createWalkCallExpressions({
						babylonParserOptions: state.file.parserOpts,
						logWarning: log.warning,
					}),
			}
		);

		function resolveSourceRootPath() {
			return (
				path.resolve(
					state.opts.rootDirectory
					||
					state.file.opts.sourceRoot
					||
					"./",
				)
			);
		}

		function createLog() {
			return createConsoleLogFromOption(state.opts.log);
		}

		function getNodeModulesPath() {
			return path.join(sourceRootPath, nodeModulesDirectoryName);
		}
	};
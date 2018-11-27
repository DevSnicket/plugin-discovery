const
	addCreateRepositoryRequireCalls = require("./addCreateRepositoryRequireCalls"),
	createConsoleLogFromOption = require("./createConsoleLogFromOption"),
	createWalkCallExpressions = require("./createWalkCallExpressions"),
	path = require("path");

module.exports =
	({ types }) => {
		const visitedRepositoryFilePaths = new Set();

		return { visitor: { CallExpression: visitCallExpression } };

		function visitCallExpression(
			nodePath,
			state,
		) {
			const log = createConsoleLogFromOption(state.opts.log);

			const walkCallExpressions =
				createWalkCallExpressions({
					babylonParserOptions: state.file.parserOpts,
					logWarning: log.warning,
				});

			if (nodePath.node.callee.name === "require") {
				const requireArgument = nodePath.node.arguments[0].value;

				const sourceFilePath = path.resolve(state.file.opts.filename);

				if (!visitedRepositoryFilePaths.has(sourceFilePath) && requireArgument === "@devsnicket/plugin-discovery-create-repository") {
					visitedRepositoryFilePaths.add(sourceFilePath);

					addCreateRepositoryRequireCalls({
						log,
						nodePath,
						sourceFilePath,
						state,
						types,
						walkCallExpressions,
					});
				}
			}
		}
	};
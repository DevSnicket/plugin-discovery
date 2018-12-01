const
	babylonParse = require("babylon").parse,
	babylonWalk = require("babylon-walk").simple;

module.exports =
	({
		babylonParserOptions,
		logWarning,
	}) => {
		const syntaxTreeByFilePathCache = new Map();

		return walkCallExpressions;

		function walkCallExpressions({
			filePath,
			javascript,
			visit,
		}) {
			const syntaxTree =
				cacheSyntaxTree({
					action:
						() =>
							parseJavascriptOrLogSyntaxError({
								javascript,
								logWarningForFile,
							}),
					filePath,
				});

			if (syntaxTree)
				babylonWalk(
					syntaxTree,
					{ CallExpression: visit },
					null,
				);

			function logWarningForFile(
				warning,
			) {
				logWarning(`${filePath}: ${warning}`);
			}
		}

		function parseJavascriptOrLogSyntaxError({
			javascript,
			logWarningForFile,
		}) {
			try {
				return (
					babylonParse(
						javascript,
						babylonParserOptions,
					)
				);
			} catch (error) {
				if (error instanceof SyntaxError) {
					logWarningForFile(error.message);

					return null;
				} else
					throw error;
			}
		}

		function cacheSyntaxTree({
			action,
			filePath,
		}) {
			return (
				syntaxTreeByFilePathCache.get(filePath)
				||
				callAndCache()
			);

			function callAndCache() {
				const syntaxTree = action();

				syntaxTreeByFilePathCache.set(filePath, syntaxTree);

				return syntaxTree;
			}
		}
	};
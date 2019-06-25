/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const getSingleOf = require("./getSingleOf");

module.exports =
	file =>
		getSingleArgumentsOfCallExpression(
			getExpressionFromStatement(
				getSingleNodeProgramBody(
					file,
				),
			),
		);

/** @param {import("babel-types").File} file */
function getSingleNodeProgramBody(
	file,
) {
	const body = file.program.body;

	return (
		getSingleOf({
			description: "node program body",
			items: body,
		})
	);
}

/** @param {import('babel-types').Statement} statement */
function getExpressionFromStatement(
	statement,
) {
	if (statement.type === "ExpressionStatement")
		return statement.expression;
	else
		throw Error(`ExpressionStatement not ${statement.type} expected.`);
}

/** @param {import('babel-types').Expression} expression */
function getSingleArgumentsOfCallExpression(
	expression,
) {
	if (expression.type === "CallExpression") {
		const callArguments =
			getSingleOf({
				description: "argument",
				items: expression.arguments,
			});

		if (callArguments.type === "ObjectExpression")
			return callArguments;
		else
			throw Error(`ObjectExpression expected not ${expression.type}.`);
	} else
		throw Error(`CallExpression not ${expression.type} expected.`);
}
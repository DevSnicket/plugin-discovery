/**
 * @typedef {import("babel-types").Expression} Expression
 * @typedef {import("babel-types").Statement} Statement
 */

module.exports =
	/** @param {Statement[]} statements */
	statements => statements.reduce(aggregate, []);

/**
 * @param {string[]} requirePaths
 * @param {Statement} statement
 */
function aggregate(
	requirePaths,
	statement,
) {
	const requirePath = getPathWhenRequireCall(statement);

	return (
		requirePath
		?
		[ ...requirePaths, requirePath ]
		:
		requirePaths
	);
}

/** @param {Statement} statement */
function getPathWhenRequireCall(
	statement,
) {
	return (
		statement.type === "ExpressionStatement"
		&&
		statement.expression.type === "CallExpression"
		&&
		isRequireCallee(statement.expression.callee)
		&&
		getValueWhenSingleStringLiteral(statement.expression.arguments)
	);
}

/** @param {Expression} expression */
function isRequireCallee(
	expression,
) {
	return (
		expression.type === "Identifier"
		&&
		expression.name === "__webpack_require__"
	);
}

/** @param {(Expression | import("babel-types").SpreadElement)[]} expressions */
function getValueWhenSingleStringLiteral(
	expressions,
) {
	return (
		expressions.length === 1
		&&
		getValueWhenStringLiteral(expressions[0])
	);
}

/** @param {Expression | import("babel-types").SpreadElement} expression */
function getValueWhenStringLiteral(
	expression,
) {
	return (
		expression.type === "StringLiteral"
		&&
		expression.value
	);
}
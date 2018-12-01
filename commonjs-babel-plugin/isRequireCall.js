module.exports =
	callExpression =>
		callExpression.callee.name === "require";
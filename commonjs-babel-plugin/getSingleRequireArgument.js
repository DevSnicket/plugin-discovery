module.exports =
	callExpression =>
		callExpression.arguments.length === 1
		&&
		callExpression.arguments[0].value;
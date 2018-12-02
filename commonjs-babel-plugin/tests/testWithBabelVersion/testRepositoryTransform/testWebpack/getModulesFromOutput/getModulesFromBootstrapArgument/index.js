const getRequirePaths = require("./getRequirePaths");

module.exports =
	/** @param {import('babel-types').ObjectExpression} objectExpression */
	objectExpression =>
		objectExpression
		.properties
		.map(getModuleFromProperty);

/** @param {import('babel-types').ObjectProperty} property */
function getModuleFromProperty(
	property,
) {
	if (property.type === "ObjectProperty")
		return (
			{
				path:
					getStringLiteralValue(property.key),
				requirePaths:
					getRequirePaths(
						getBodyOfFunction(property.value)
						.body,
					),
			}
		);
	else
		throw Error(`ObjectProperty expected not ${property.type}.`);
}

/** @param {import('babel-types').Expression} key */
function getStringLiteralValue(
	key,
) {
	if (key.type === "StringLiteral")
		return key.value;
	else
		throw Error(`StringLiteral expected not ${key.type}.`);
}

/** @param {import('babel-types').Expression} _function */
function getBodyOfFunction(
	_function,
) {
	if (_function.type === "FunctionExpression")
		return _function.body;
	else
		throw Error(`FunctionExpression expected not ${_function.type}.`);
}
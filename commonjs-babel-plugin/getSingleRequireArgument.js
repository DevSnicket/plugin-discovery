/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

module.exports =
	callExpression =>
		callExpression.arguments.length === 1
		&&
		callExpression.arguments[0].value;
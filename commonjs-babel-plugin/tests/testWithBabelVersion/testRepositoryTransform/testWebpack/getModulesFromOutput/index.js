/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	getBootstrapArgumentFromFile = require("./getBootstrapArgumentFromFile"),
	getModulesFromBootstrapArgument = require("./getModulesFromBootstrapArgument"),
	parseWithBabylon = require("babylon").parse;

module.exports =
	output =>
		getModulesFromBootstrapArgument(
			getBootstrapArgumentFromFile(
				parseWithBabylon(
					output,
				),
			),
		);
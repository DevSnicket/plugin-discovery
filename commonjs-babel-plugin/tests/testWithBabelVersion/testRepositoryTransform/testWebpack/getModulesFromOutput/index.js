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
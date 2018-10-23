const
	childProcess = require("child_process"),
	path = require("path");

module.exports =
	({
		argument,
		callback,
		directory,
		moduleFile,
	}) => {
		const process =
			childProcess.fork(
				path.join(__dirname, "inProcess"),
				[],
				{
					cwd: directory,
					execArgv: [],
				},
			);

		// eslint-disable-next-line init-declarations
		let result;

		process.on(
			"message",
			message => result = message,
		);

		process.on(
			"exit",
			() => callback(result),
		);

		process.send({
			argument,
			moduleFile: path.join(directory, moduleFile),
		});
	};
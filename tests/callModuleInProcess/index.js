/* Copyright (c) 2019 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

const
	childProcess = require("child_process"),
	path = require("path");

module.exports =
	({
		argument,
		directory,
		moduleFile,
	}) =>
		new Promise(
			resolve => {
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
					() => resolve(result),
				);

				process.send({
					argument,
					moduleFile: path.join(directory, moduleFile),
				});
			},
		);
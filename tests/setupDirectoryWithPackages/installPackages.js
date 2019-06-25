/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

module.exports =
	({
		directory,
		npmPath,
		packages,
	}) =>
		new Promise(
			(resolve, reject) => {
				log(`Installing NPM packages ${packages}`);

				// require must be called within function as path to NPM is passed into it
				// eslint-disable-next-line global-require
				const npm = require(npmPath);

				npm.load(
					{ prefix: directory },
					afterNpmLoad,
				);

				function afterNpmLoad(
					error,
				) {
					if (error)
						reject(error);
					else
						npm.on(
							"log",
							log,
						);

					npm.commands.install(
						packages,
						afterInstallCommand,
					);
				}

				function afterInstallCommand(
					error,
				) {
					if (error)
						reject(error);
					else
						resolve();
				}
			},
		);

function log(
	message,
) {
	// Console logging is helpful as this will be run in another process that can be hard to attach a debugger to
	// eslint-disable-next-line no-console
	console.log(message);
}
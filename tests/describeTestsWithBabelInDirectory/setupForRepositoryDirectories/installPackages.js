const npm = require("npm");

module.exports =
	({
		directory,
		packages,
	}) =>
		new Promise(
			(resolve, reject) => {
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
							// eslint-disable-next-line no-console
							console.log,
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
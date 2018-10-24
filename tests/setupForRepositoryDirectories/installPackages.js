module.exports =
	({
		directory,
		npmPath,
		packages,
	}) =>
		new Promise(
			(resolve, reject) => {
				console.log(`Installing NPM packages ${packages}`);

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
const npm = require("npm");

module.exports =
	({
		callback,
		directory,
		packages,
	}) => {
		npm.load(
			{ prefix: directory },
			afterNpmLoad,
		);

		function afterNpmLoad(
			error,
		) {
			if (error)
				throw error;
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
				throw error;
			else
				return callback();
		}
	};
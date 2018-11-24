const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	makeDirectory = promisify(fs.mkdir),
	writeFile = promisify(fs.writeFile);

module.exports =
	async({
		directory,
		repository,
	}) => {
		await makeDirectory(
			directory,
		);

		const directoryWithScope =
			path.join(
				directory,
				repository.package.scope || "",
			);

		if (repository.package.scope)
			await makeDirectory(directoryWithScope);

		const packageDirectory =
			path.join(
				directoryWithScope,
				repository.package.nameInScope,
			);

		await makeDirectory(packageDirectory);

		await writeFile(
			path.join(packageDirectory, repository.filename),
			`// ${repository.filename}`,
		);
	};
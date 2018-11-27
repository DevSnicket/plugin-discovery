const
	fs = require("fs"),
	path = require("path"),
	{ promisify } = require("util");

const
	writeFile = promisify(fs.writeFile);

module.exports =
	({
		plugin,
		repository,
	}) =>
		writeFile(
			getFilePath(plugin),
			`require("${getRequirePath(repository)}").plugIn("${plugin.name}");`,
		);

function getFilePath({
	directory,
	filename,
}) {
	return path.join(directory, filename);
}

function getRequirePath({
	filename,
	package: _package,
}) {
	return `${_package.name}/${filename}`;
}
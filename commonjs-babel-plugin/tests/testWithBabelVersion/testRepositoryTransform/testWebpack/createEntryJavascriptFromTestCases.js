module.exports =
	testCases =>
		testCases
		.map(getRequireCallFromTestCase)
		.join("\n");

function getRequireCallFromTestCase(
	{ repositoryPath },
) {
	return `require("${getRequirePathFromRepositoryPath(repositoryPath)}");`;
}

function getRequirePathFromRepositoryPath(
	repositoryPath,
) {
	const nodeModulesPrefix = "node_modules/";

	return (
		repositoryPath.startsWith(nodeModulesPrefix)
		?
		repositoryPath.substring(nodeModulesPrefix.length)
		:
		`./${repositoryPath}`
	);
}
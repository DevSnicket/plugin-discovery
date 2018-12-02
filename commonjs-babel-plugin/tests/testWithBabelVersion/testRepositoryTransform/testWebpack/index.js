const
	createEntryJavascriptFromTestCases = require("./createEntryJavascriptFromTestCases"),
	forkChildProcess = require("child_process").fork,
	fs = require("fs"),
	getModulesFromOutput = require("./getModulesFromOutput"),
	getRunJavascript = require("./getRunJavascript"),
	path = require("path"),
	{ promisify } = require("util");

const
	readFile = promisify(fs.readFile),
	writeFile = promisify(fs.writeFile);

/** @typedef {import("../TestCase.js").TestCase} TestCase */

/**
 * @param {object} parameter
 * @param {string} parameter.directory
 * @param {TestCase[]} parameter.testCases
*/
module.exports =
	({
		directory,
		testCases,
	}) => {
		const
			entryFilename = "webpack-entry.js",
			outputFileName = "webpack-output.js",
			runFilename = "webpack-run.js";

		describe(
			"Webpack",
			() => {
				let modulesInOutput = null;

				beforeAll(
					async() => {
						await setup();

						modulesInOutput =
							getModulesFromOutput(
								await readOutput(),
							);
					},
				);

				for (const testCase of testCases)
					testTestCase(testCase);

				/** @param {TestCase} testCase */
				function testTestCase(
					testCase,
				) {
					test(
						testCase.name,
						() =>
							expect(
								getActual(
									testCase,
								),
							)
							.toEqual(
								getExpected(
									testCase,
								),
							),
					);
				}

				function getActual(
					{ repositoryPath },
				) {
					return (
						modulesInOutput
						.find(module => module.path === `./${repositoryPath}`)
						.requirePaths
						.filter(requirePath => requirePath !== "./webpack-entry.js")
					);
				}

				function getExpected({
					forwarderOrPluginPaths,
					repositoryPath,
				}) {
					const repositoryDirectory = path.dirname(repositoryPath);

					return (
						forwarderOrPluginPaths.map(
							forwarderOrPluginPath =>
								forwarderOrPluginPath.startsWith(".")
								?
								`./${path.join(repositoryDirectory, forwarderOrPluginPath)}`
								:
								`./node_modules/${forwarderOrPluginPath}`,
						)
					);
				}
			},
		);

		function setup() {
			return (
				Promise.all(
					[
						writeEntryFile(),
						writeRunFile(),
						run(),
					],
				)
			);
		}

		async function writeEntryFile() {
			await writeFile(
				path.join(
					directory,
					entryFilename,
				),
				createEntryJavascriptFromTestCases(
					testCases,
				),
			);
		}

		async function writeRunFile() {
			await writeFile(
				path.join(
					directory,
					runFilename,
				),
				await getRunJavascript({
					directory,
					entryFilename,
					outputFileName,
				}),
			);
		}

		function run() {
			const childProcess =
				forkChildProcess(
					runFilename,
					[],
					{
						cwd: directory,
						execArgv: [],
					},
				);

			return (
				new Promise(
					(resolve, reject) => {
						childProcess.addListener("error", reject);
						childProcess.addListener("exit", resolve);
					},
				)
			);
		}

		function readOutput() {
			return (
				readFile(
					path.join(directory, outputFileName),
					"UTF8",
				)
			);
		}
	};
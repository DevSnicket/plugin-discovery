/* eslint-disable no-console */

module.exports =
	option => (
		{
			detail:
				!option || option === "detail"
				?
				detail => console.log(formatLogMessage(detail))
				:
				() => null,
			warning:
				warning => console.warn(formatLogMessage(warning)),
		}
	);

function formatLogMessage(
	message,
) {
	return `DevSnicket plug-in ${message}`;
}
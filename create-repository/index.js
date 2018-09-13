module.exports =
	() => {
		const plugins = [];

		return (
			{
				[Symbol.iterator]:
					() => plugins[Symbol.iterator](),

				/**
				 * Only works if the modules of the plug-ins are also imported.
				 * Plug-in modules can be discovered and imports added automatically (e.g. using a babel plug-in).
				 */
				plugIn:
					plugin => plugins.push(plugin),
			}
		);
	};
/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

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
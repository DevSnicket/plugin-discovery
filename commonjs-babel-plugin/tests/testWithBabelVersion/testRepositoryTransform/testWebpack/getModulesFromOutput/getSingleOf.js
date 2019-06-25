/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

module.exports =
	/**
	 * @param {object} parameter
	 * @param {string} parameter.description
	 * @param {T[]} parameter.items
	 * @return {T}
	 * @template T
	 */
	({
		description,
		items,
	}) => {
		if (items.length === 1)
			return items[0];
		else
			throw Error(`Single ${description} expected.`);
	};
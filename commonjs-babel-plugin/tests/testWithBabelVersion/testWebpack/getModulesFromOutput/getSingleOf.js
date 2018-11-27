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
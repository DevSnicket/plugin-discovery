/* Copyright (c) 2018 Graham Dyson. All Rights Reserved.
Licensed under the MIT license. See LICENSE file in the repository root for full license information. */

module.exports =
	repositoryFile =>
		// eslint-disable-next-line global-require
		[ ...require(repositoryFile) ];
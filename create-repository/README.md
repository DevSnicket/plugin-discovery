# Plug-in Discovery ![](https://raw.githubusercontent.com/DevSnicket/plugin-discovery/master/docs/icon.svg?sanitize=true)

[![Build Status](https://travis-ci.org/DevSnicket/plugin-discovery.svg?branch=master)](https://travis-ci.org/DevSnicket/plugin-discovery) [![Gitter chat](https://badges.gitter.im/devsnicket-plugin-discovery/gitter.png)](https://gitter.im/devsnicket-plugin-discovery)

DevSnicket Plug-in Discovery consists of a JavaScript repository object and a Babel plug-in that when used together can invert dependencies between modules and turn them into discovered plug-ins.

before | after
------ | -----
![](https://raw.githubusercontent.com/DevSnicket/plugin-discovery/master/before.svg?sanitize=true) | ![](https://raw.githubusercontent.com/DevSnicket/plugin-discovery/master/after.svg?sanitize=true)

Currently only CommonJS modules are supported (e.g. not ECMAScript ones).

Plug-in and repository files/modules in packages are supported (see "Forwarder lookup" in [@devsnicket/plugin-discovery-commonjs-babel-plugin](https://www.npmjs.com/package/@devsnicket/plugin-discovery-commonjs-babel-plugin)).

## Create repository factory function / package

[![NPM](https://img.shields.io/npm/v/@devsnicket/plugin-discovery-create-repository.svg)](https://www.npmjs.com/package/@devsnicket/plugin-discovery-create-repository
)

Install using [`npm`](https://www.npmjs.com/package/@devsnicket/plugin-discovery-create-repository):

```bash
npm install @devsnicket/plugin-discovery-create-repository
```
Or with [`yarn`](https://yarnpkg.com/en/package/@devsnicket/plugin-discovery-create-repository):

```bash
yarn add @devsnicket/plugin-discovery-create-repository
```
The create repository package contains a factory function. When this function is called and the return repository object is exported a plug-in contract is defined (in this example "someSortOfPlugins").

```javascript
// someSortOfPlugins.js
module.exports =
	require("@devsnicket/plugin-discovery-create-repository")
	();
```

This can then be plugged into by objects/functions etc from other files.

```javascript
// plugin1.js
require("./someSortOfPlugins")
.plugin("plug-in number 1");
```

The plug-ins can then be iterated and used from other files.

```javascript
// consoleLogPlugins.js
for (const plugin require("./someSortOfPlugins"))
	console.log(plugin);
// output:
// plug-in number 1
```

The code above alone won't work as there isn't a module require call to import the 2nd plug-in file from the 3rd file that iterates the plug-ins. The purpose of the repository object is so plug-ins can be identified by the [@devsnicket/plugin-discovery-commonjs-babel-plugin](https://www.npmjs.com/package/@devsnicket/plugin-discovery-commonjs-babel-plugin) package as it will automatically add the missing module require calls.

## Example

An example of Plug-in Discovery in use can be found in [Eunice](https://github.com/DevSnicket/Eunice). A plug-in repository is defined for its test harnesses ([Harnesses/processorPlugins.js](https://github.com/DevSnicket/Eunice/blob/master/Harnesses/processorPlugins.js)) so [processors](https://github.com/DevSnicket/Eunice/tree/master/Processors) can be discovered and included automatically.

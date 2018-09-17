# Plug-in Discovery

[![Build Status](https://travis-ci.org/DevSnicket/plugin-discovery.svg?branch=master)](https://travis-ci.org/DevSnicket/plugin-discovery)

Plug-in Discovery is a JavaScript factory function and a Babel plug-in that when used together can invert dependencies between modules and turn them into discovered plug-ins.

There is currently support for file-based CommonJS modules (i.e. not via packages).

## Create repository factory function / package

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

## CommonJS Babel plug-in / package

The code above alone won't work as there isn't a module require call to import the 2nd plug-in file from the 3rd file that iterates the plug-ins. The purpose of a repository object is so that plug-ins can be identified. 

The CommonJS Babel plug-in package discovers DevSnicket plug-in usage and will automatically add module require calls.

Install using [`npm`](https://www.npmjs.com/package/@devsnicket/plugin-discovery-commonjs-babel-plugin):

```bash
npm install --save-dev @devsnicket/plugin-discovery-commonjs-babel-plugin
```
Or with [`yarn`](https://yarnpkg.com/en/package/@devsnicket/plugin-discovery-commonjs-babel-plugin):

```bash
yarn add --dev @devsnicket/plugin-discovery-commonjs-babel-plugin
```

The Babel plug-in will need to be specified in your [Babel configuration](https://babeljs.io/docs/en/plugins#plugin-preset-paths), [WebPack Babel Loader configuration](https://github.com/babel/babel-loader#options) or equivalent.

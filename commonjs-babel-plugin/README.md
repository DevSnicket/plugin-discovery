# Plug-in Discovery ![](https://raw.githubusercontent.com/DevSnicket/plugin-discovery/master/icon.svg?sanitize=true)

[![Build Status](https://travis-ci.org/DevSnicket/plugin-discovery.svg?branch=master)](https://travis-ci.org/DevSnicket/plugin-discovery)

DevSnicket Plug-in Discovery consists of a JavaScript repository object and a Babel plug-in that when used together can invert dependencies between modules and turn them into discovered plug-ins.

before | after
------ | -----
![](https://raw.githubusercontent.com/DevSnicket/plugin-discovery/master/before.svg?sanitize=true) | ![](https://raw.githubusercontent.com/DevSnicket/plugin-discovery/master/after.svg?sanitize=true)

Currently CommonJS modules are only supported (e.g. not ECMAScript ones). There is partial support for modules in packages (see below).

## CommonJS Babel plug-in / package

[![NPM](https://img.shields.io/npm/v/@devsnicket/plugin-discovery-commonjs-babel-plugin.svg)](https://www.npmjs.com/package/@devsnicket/plugin-discovery-commonjs-babel-plugin
)

Install using [`npm`](https://www.npmjs.com/package/@devsnicket/plugin-discovery-commonjs-babel-plugin):

```bash
npm install --save-dev @devsnicket/plugin-discovery-commonjs-babel-plugin
```
Or with [`yarn`](https://yarnpkg.com/en/package/@devsnicket/plugin-discovery-commonjs-babel-plugin):

```bash
yarn add --dev @devsnicket/plugin-discovery-commonjs-babel-plugin
```

The CommonJS Babel plug-in package discovers DevSnicket plug-in references and will automatically add module require calls where the package [@devsnicket/plugin-discovery-create-repository](https://www.npmjs.com/package/@devsnicket/plugin-discovery-create-repository) has been used (see above).

The example above would be rewritten into:

```javascript
// someSortOfPlugins.js
module.exports =
	require("@devsnicket/plugin-discovery-create-repository")
	();
	
require("./plugin1.js")
```

The Babel plug-in will need to be specified in your [Babel configuration](https://babeljs.io/docs/en/plugins#plugin-preset-paths), [WebPack Babel Loader configuration](https://github.com/babel/babel-loader#options) or equivalent. It has a single parameter named ignoreDirectoryNames. When not specified the parameter defaults to node_modules. Scanning of the node_modules directory for plug-ins would be inefficient and likely to take a long time.

When using WebPack it will run Babel for the plug-in repository even if its in a node_modules directory. This means plug-ins will be discovered and rewritten into the output plug-in repository file so long as they aren't also in the node_modules directory (see above).

## Example

An example of Plug-in Discovery in use can be found in [Eunice](https://github.com/DevSnicket/Eunice). A plug-in repository is defined for its test harnesses ([Harnesses/processorPlugins.js](https://github.com/DevSnicket/Eunice/blob/master/Harnesses/processorPlugins.js)) so [processors](https://github.com/DevSnicket/Eunice/tree/master/Processors) can be discovered and included automatically.
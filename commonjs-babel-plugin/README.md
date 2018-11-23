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

The Babel plug-in will need to be specified in your [Babel configuration](https://babeljs.io/docs/en/plugins#plugin-preset-paths), [Webpack Babel Loader configuration](https://github.com/babel/babel-loader#options) or equivalent.

### Discovery (plug-ins with relative paths)

The Babel plug-in has a parameter ignoreDirectoryNames, when not specified this defaults to node_modules. Scanning of the node_modules directory for plug-ins would be inefficient and likely to take a long time.

Webpack can be configured to run Babel for plug-in repositories even when they are in a package and so in the node_modules directory. So long as the plug-ins for these repositories aren't also in packages/node_modules, they can be discovered and rewritten by Webpack/Babel in the output. Webpack is often also configured to not include or to exclude running Babel for the node_modules directory. So you will need to ensure that your Webpack configuration still includes the paths to repositories in packages/node_modules for this to work.

### Lookup (plug-ins in packages)

To support DevSnicket plug-ins that are in packages and so not discovered by default (see above) the Babel plug-in also looks up inside package / node_module directories for files that can forward onto the plug-ins efficiently. It does this using the following structure:

```
node_modules
└─plugin-package
  └─.devsnicket-plugin-discovery
    └─repository-package
      └─repositoryFileName.js (forwarder)
```

Scoped packages for either/both the plug-in and repository are also supported:

```
node_modules
├─@plugin-package-scope
| └─plugin-package-with-scope
|   └─.devsnicket-plugin-discovery
|     └─@plugin-package-scope
|       └─repository-package
|         └─repositoryFileName.js (forwarder)
```

The forwarders are JavaScript files that contain CommonJS require calls for the actual plugin files within the package. These need to be generated when the package is build and included in it when its packed.

## Example

An example of Plug-in Discovery in use can be found in [Eunice](https://github.com/DevSnicket/Eunice). A plug-in repository is defined for its test harnesses ([Harnesses/processorPlugins.js](https://github.com/DevSnicket/Eunice/blob/master/Harnesses/processorPlugins.js)) so [processors](https://github.com/DevSnicket/Eunice/tree/master/Processors) can be discovered and included automatically.
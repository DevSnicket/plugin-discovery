# Plug-in Discovery ![](https://raw.githubusercontent.com/DevSnicket/plugin-discovery/master/docs/icon.svg?sanitize=true)

[![Build Status](https://travis-ci.org/DevSnicket/plugin-discovery.svg?branch=master)](https://travis-ci.org/DevSnicket/plugin-discovery) [![Gitter chat](https://badges.gitter.im/devsnicket-plugin-discovery/gitter.png)](https://gitter.im/devsnicket-plugin-discovery)

DevSnicket Plug-in Discovery consists of a JavaScript repository object and a Babel plug-in that when used together can invert dependencies between modules and turn them into discovered plug-ins.

before | after
------ | -----
![](https://raw.githubusercontent.com/DevSnicket/plugin-discovery/master/docs/before.svg?sanitize=true) | ![](https://raw.githubusercontent.com/DevSnicket/plugin-discovery/master/docs/after.svg?sanitize=true)

Currently only CommonJS modules are supported (e.g. not ECMAScript ones).

Plug-in and repository files/modules in packages are supported (see "Forwarder lookup" below).

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

The code above alone won't work as there isn't a module require call to import the 2nd plug-in file from the 3rd file that iterates the plug-ins. The purpose of the repository object is so plug-ins can be identified by the [@devsnicket/plugin-discovery-create-repository](https://www.npmjs.com/package/@devsnicket/plugin-discovery-create-repository) package (see below) as it will automatically add the missing module require calls.

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

The Babel plug-in has a parameter ignoreDirectoryNames, when not specified this defaults to node_modules. Scanning of the node_modules directory for Devsnicket plug-ins would be inefficient and likely to take a long time.

Webpack can be configured to run Babel for repositories even when they are in a package and so in the node_modules directory. So long as the plug-ins for these repositories aren't also in packages/node_modules, they can be discovered and rewritten by Webpack/Babel in the output. Webpack is often also configured to not include or to exclude running Babel for the node_modules directory. So you will need to ensure that your Webpack configuration still includes the paths to repositories in packages/node_modules for this to work.

### Forwarder lookup (repositories and plug-ins in packages)

To support packages that contain DevSnicket plug-ins that won't be discovered by default (see above), the Babel plug-in also does a lookup inside the node_module directory. It expects the following structure:

```
node_modules
├─plugin-package
| └─.devsnicket-plugin-discovery
|   ├─repository-package
|   | ├─repositoryFileName.js (forwarder)
```

Scoped packages for either/both the plug-in and repository are also supported:

```
node_modules
├─@plugin-package-scope
| ├─plugin-package-with-scope
| | └─.devsnicket-plugin-discovery
| |   ├─@plugin-package-scope
| |   | ├─repository-package
| |   | | ├─repositoryFileName.js (forwarder)
```

Forwarders:
* JavaScript files that contain CommonJS require calls to the actual plug-in files within the package
* generated upon build (i.e. when Babel is run)
* included in the package
  
When Babel is run with the -d / --out-dir parameter the forwarder directories and files described above will be created automatically. Forwarders are written for plug-ins when the repository is both in a package and not transformed by Babel<sup>[[1]](#footnote1)</sup>. The following Babel plug-in parameters can override the default behavior:

| parameter | description | default 
| - | - | - |
| forwarderParentDirectoryPath | the parent directory of .devsnicket-plugin-discovery | current directory |
| forwarderDirectoryClean | will the .devsnicket-plugin-discovery directory be deleted / cleaned | true
| outputDirectoryPath | directory where Babel transformed files are being outputted to | Babel -d / --out-dir parameters if specified

<a name="footnote1"><sup>1</sup></a> If a plug-in is transformed by Babel first, a forwarder will be written for it, if its repository is transformed afterwards, the forwarder will be deleted (as its redundant).

#### Package versions

It is advised that repositories are not included in packages with other content that might frequently change and so require new package versions.

If there are multiple versions of a repository's package installed, this is likely to result in that one repository effectively becoming multiple separate repositories with the same name. When this is happens, something plugged into a repository package of one version won't be returned when iterating that same repository package of another version. If this happens it is due to the behavior of the package manager being used. Package managers such as NPM will install the same package multiple times, in multiple directories, to avoid version conflicts.

### Tests

There are automated tests that run Babel with the plug-in and check the transformed output. The tests are run for the latest versions of Babel 6 and 7. NPM is run by the tests to install Babel and test case packages which are generated. To isolate Babel it is run in a separate process.

For each version of Babel tested (see above), all test cases are repeated but with Babel run by Webpack 4.

Code coverage is not currently being run because of the additional work required to analyse across multiple processes.

## Example

An example of Plug-in Discovery in use can be found in [Eunice](https://github.com/DevSnicket/Eunice). A plug-in repository is defined for its test harnesses ([Harnesses/processorPlugins.js](https://github.com/DevSnicket/Eunice/blob/master/Harnesses/processorPlugins.js)) so [processors](https://github.com/DevSnicket/Eunice/tree/master/Processors) can be discovered and included automatically.

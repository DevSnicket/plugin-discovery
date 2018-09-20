# Plug-in Discovery

Plug-in Discovery is a JavaScript factory function and a Babel plug-in that when used together can invert dependencies between modules and turn them into discovered plug-ins.

There is currently support for file-based CommonJS modules (i.e. not via packages).

## CommonJS Babel plug-in / package

The CommonJS Babel plug-in package discovers DevSnicket plug-in usage and will automatically add module require calls where the package [@devsnicket/plugin-discovery-create-repository](https://www.npmjs.com/package/@devsnicket/plugin-discovery-create-repository) has been used.

Install using [`npm`](https://www.npmjs.com/package/@devsnicket/plugin-discovery-commonjs-babel-plugin):

```bash
npm install --save-dev @devsnicket/plugin-discovery-commonjs-babel-plugin
```
Or with [`yarn`](https://yarnpkg.com/en/package/@devsnicket/plugin-discovery-commonjs-babel-plugin):

```bash
yarn add --dev @devsnicket/plugin-discovery-commonjs-babel-plugin
```

The Babel plug-in will need to be specified in your [Babel configuration](https://babeljs.io/docs/en/plugins#plugin-preset-paths), [WebPack Babel Loader configuration](https://github.com/babel/babel-loader#options) or equivalent.
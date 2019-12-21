const { InitComponentsPlugin } = require("./src/plugins/InitComponentsPlugin");
const { InitSrcPlugin } = require('./src/plugins/InitSrcPlugin');
const { InitEmbeddedComponentsPlugin } = require("./src/plugins/InitEmbeddedComponentsPlugin")
const { PreRenderPlugin } = require("./src/plugins/PreRenderPlugin")
const { WriteDestFilesPlugin } = require("./src/plugins/WriteDestFilesPlugin");
const { ScopeStylesPlugin } = require("./src/plugins/ScopeStylesPlugin");
const { ScopeScriptsPlugin } = require("./src/plugins/ScopeScriptsPlugin");
const { OnceAttributePlugin } = require("./src/plugins/OnceAttributePlugin");

module.exports = {
    dest: "dest",
    defaultComponentWrapper: "div",
    maxRecursionLevel: 100,
    _plugins: [
        InitComponentsPlugin,
        InitSrcPlugin,
        new ScopeStylesPlugin(),
        ScopeScriptsPlugin(),
        InitEmbeddedComponentsPlugin,
        PreRenderPlugin,
        OnceAttributePlugin(),
        new WriteDestFilesPlugin()
    ]
}
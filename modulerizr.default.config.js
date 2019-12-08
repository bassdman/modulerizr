const { InitComponentsPlugin } = require("./src/plugins/InitComponentsPlugin");
const { InitSrcPlugin } = require('./src/plugins/InitSrcPlugin');
const { InitEmbeddedComponentsPlugin } = require("./src/plugins/InitEmbeddedComponentsPlugin")
const { PreRenderPlugin } = require("./src/plugins/PreRenderPlugin")
const { writeDestFilesPlugin } = require("./src/plugins/writeDestFilesPlugin");
const { ScopeStylesPlugin } = require("./src/plugins/ScopeStylesPlugin");



module.exports = {
    dest: "dest",
    defaultComponentWrapper: "div",
    maxRecursionLevel: 100,
    _plugins: [
        InitComponentsPlugin,
        ScopeStylesPlugin,
        InitSrcPlugin,
        InitEmbeddedComponentsPlugin,
        PreRenderPlugin,
        writeDestFilesPlugin
    ]
}
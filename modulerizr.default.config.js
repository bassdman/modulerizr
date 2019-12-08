const { InitComponentsPlugin } = require("./src/plugins/InitComponentsPlugin");
const { InitSrcPlugin } = require('./src/plugins/InitSrcPlugin');
const { findEmbeddedComponentsPlugin } = require("./src/plugins/findEmbeddedComponentsPlugin")
const { PreRenderPlugin } = require("./src/plugins/PreRenderPlugin")
const { writeDestFilesPlugin } = require("./src/plugins/writeDestFilesPlugin");



module.exports = {
    "src": "index.html",
    "components": "**/*.component.html",
    "dest": "dest",
    "defaultComponentWrapper": "div",
    _plugins: [
        InitComponentsPlugin,
        InitSrcPlugin,
        findEmbeddedComponentsPlugin,
        PreRenderPlugin,
        writeDestFilesPlugin
    ]
}
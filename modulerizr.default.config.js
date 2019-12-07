const { extractComponentInfoPlugin } = require("./src/plugins/extractComponentInfoPlugin");
const { extractSrcInfoPlugin } = require('./src/plugins/extractSrcInfoPlugin');
const { findEmbeddedComponentsPlugin } = require("./src/plugins/findEmbeddedComponentsPlugin")
const { renderComponentsPlugin } = require("./src/plugins/renderComponentsPlugin")
const { writeDestFilesPlugin } = require("./src/plugins/writeDestFilesPlugin");



module.exports = {
    "src": "index.html",
    "components": "**/*.component.html",
    "dest": "dest",
    "defaultComponentWrapper": "div",
    _plugins: [
        extractComponentInfoPlugin,
        extractSrcInfoPlugin,
        findEmbeddedComponentsPlugin,
        renderComponentsPlugin,
        writeDestFilesPlugin
    ]
}
const { logPlugin } = require('./src/plugins/logPlugin')

const { extractComponentInfoPlugin } = require("./src/plugins/extractComponentInfoPlugin");
const { extractSrcInfoPlugin } = require('./src/plugins/extractSrcInfoPlugin');
const { replaceComponentsInSrcFilesPlugin } = require("./src/plugins/replaceComponentsInSrcFilesPlugin");

module.exports = {
    "src": "index.html",
    "components": "**/*.component.html",
    "dest": "dest",
    "wrapperTag": "<div>",
    _beforePlugins: [],
    _componentPlugins: [extractComponentInfoPlugin],
    _srcPlugins: [extractSrcInfoPlugin, replaceComponentsInSrcFilesPlugin],
    _afterPlugins: [],
}
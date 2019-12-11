const { DebugPlugin } = require("modulerizr/src/plugins/DebugPlugin");

const debugPlugin = DebugPlugin({
    ignorePlugins: []
})
module.exports = {
    "src": "src/06*.html",
    "components": ["**/06*/*.component.html"],
    "dest": "./dest/",
    "debug": true,
    "plugins": [debugPlugin]
}
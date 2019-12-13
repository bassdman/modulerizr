const { DebugPlugin } = require("modulerizr/src/plugins/DebugPlugin");

const debugPlugin = DebugPlugin({
    ignorePlugins: []
})
module.exports = {
    "src": ["sample**/0*.html"],
    "components": ["**/*.component.html"],
    "dest": "./dest/",
    "debug": true,
    "plugins": [debugPlugin]
}
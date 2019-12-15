const { DebugPlugin } = require("modulerizr");

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
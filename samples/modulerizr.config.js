const { DebugPlugin } = require("modulerizr");
const { ModulerizrJsRenderPlugin } = require("modulerizr-jsrender-plugin");

module.exports = {
    "src": ["sample**/0*.html"],
    "components": ["**/*.component.html"],
    "dest": "./dest/",
    "debug": true,
    "plugins": [
        new DebugPlugin(),
        new ModulerizrJsRenderPlugin()
    ]
}
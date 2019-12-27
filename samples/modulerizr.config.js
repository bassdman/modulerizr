const { DebugPlugin } = require("modulerizr");
const { ModulerizrJsRenderPlugin } = require("modulerizr-jsrender-plugin");
const path = require('path');

module.exports = {
    "src": ["sample**/0*.html"],
    "components": ["**/*.component.html"],
    "dest": path.resolve(__dirname, "dest"),
    "debug": true,
    "plugins": [
        new DebugPlugin(),
        new ModulerizrJsRenderPlugin({ allowCode: true })
    ]
}
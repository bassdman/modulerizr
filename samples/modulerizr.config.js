const { ModulerizrJsRenderPlugin } = require("modulerizr-jsrender-plugin");
const path = require('path');

module.exports = {
    "src": ["sample**/0*.html"],
    "components": ["sample*/*.component.html"],
    "debug": true,
    "plugins": [
        new ModulerizrJsRenderPlugin({ allowCode: true, debugMode: false })
    ]
}
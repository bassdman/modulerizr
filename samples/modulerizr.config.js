const { DebugPlugin } = require("modulerizr");

module.exports = {
    "src": ["sample**/0*.html"],
    "components": ["**/*.component.html"],
    "dest": "./dest/",
    "debug": true,
    "plugins": [new DebugPlugin({
        apply(modulerizr) {
            /* modulerizr.plugins.on('afterRender', () => {
                 return modulerizr.store.each("$.src.*", (currentFile, currentPath, i) => {

                 });
             })*/
        }
    })]
}
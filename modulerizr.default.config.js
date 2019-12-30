const { InitComponentsPlugin } = require("./src/plugins/InitComponentsPlugin");
const { InitSrcPlugin } = require('./src/plugins/InitSrcPlugin');
const { InitEmbeddedComponentsPlugin } = require("./src/plugins/InitEmbeddedComponentsPlugin")
const { PreRenderPlugin } = require("./src/plugins/PreRenderPlugin")

const { ScopeStylesPlugin } = require("./src/plugins/ScopeStylesPlugin");
const { ScopeScriptsPlugin } = require("./src/plugins/ScopeScriptsPlugin");
const { OnceAttributePlugin } = require("./src/plugins/OnceAttributePlugin");
const { PrerenderScriptPlugin } = require("./src/plugins/PrerenderScriptPlugin");

module.exports = {
    dest: "dest",
    defaultComponentWrapper: "div",
    maxRecursionLevel: 100,
    _plugins: [
        new InitComponentsPlugin(),
        new InitSrcPlugin(),
        new InitEmbeddedComponentsPlugin(),
        new ScopeStylesPlugin(),
        new ScopeScriptsPlugin(),
        new PreRenderPlugin(),
        new OnceAttributePlugin(),
        new PrerenderScriptPlugin()
    ]
}
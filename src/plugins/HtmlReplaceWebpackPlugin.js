function HtmlReplaceWebpackPlugin(options) {
    options = Array.isArray(options) ? options : [options]

    options.forEach(option => {
        if (typeof option.pattern == 'undefined' || typeof option.replacement == 'undefined') {
            throw new Error('Both `pattern` and `replacement` options must be defined!')
        }
    })

    this.replace = function(htmlPluginData, callback) {
        const currentFilePath = htmlPluginData.plugin.options.template.split('!')[1];

        options.forEach(option => {
            if (option.filePath == undefined || option.filePath !== currentFilePath)
                return;

            if (option.pattern instanceof RegExp)
                htmlPluginData.html = htmlPluginData.html.replace(option.pattern, option.replacement)
            else htmlPluginData.html = htmlPluginData.html.split(option.pattern).join(option.replacement)
        })

        callback(null, htmlPluginData)
    }
}

HtmlReplaceWebpackPlugin.prototype.apply = function(compiler) {
    compiler.hooks.compilation.tap('HtmlReplaceWebpackPlugin', compilation => {
        if (compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) {
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('HtmlReplaceWebpackPlugin', this.replace)
        } else {
            var HtmlWebpackPlugin = require('html-webpack-plugin')

            if (!HtmlWebpackPlugin) {
                throw new Error('Please ensure that `html-webpack-plugin` was placed before `html-replace-webpack-plugin` in your Webpack config if you were working with Webpack 4.x!')
            }

            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('HtmlReplaceWebpackPlugin', this.replace)
        }
    })
}

exports.HtmlReplaceWebpackPlugin = HtmlReplaceWebpackPlugin
function logPlugin(text) {
    return function plugin(files) {
        files.src
        console.log(text || arguments)
    }
}

exports.logPlugin = logPlugin;
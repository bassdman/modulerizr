const colors = require('colors/safe');

const files = {
    components: {},
    src: {},
    embeddedComponents: {}
};

function Modulerizr(config) {
    return {
        set(type, name, obj) {
            if (type !== 'src' && type !== 'components' && type !== 'embeddedComponents')
                throw new Error('Modulerizr.set(type,name,config): Type is not correct. It must be either "components", "embeddedComponents" or "src". But it is "' + type + '".');

            if (name == null)
                throw new Error('Modulerizr.set(type,name,config): Name is not defined. Which Src-File do you mean?');

            if (!typeof obj == 'object')
                throw new Error('Modulerizr.set(type,name,config): config must be an object.');

            files[type][name] = Object.assign((files[type][name] || {}), obj);
        },
        get(type, name) {
            if (type !== 'src' && type !== 'components' && type !== 'embeddedComponents')
                throw new Error('Modulerizr.set(type,name,config): Type is not correct. It must be either "components", "embeddedComponents" or "src". But it is "' + type + '".');

            if (name == null) {
                return files[type];
            }


            return files[type][name];
        },
        log(text, color) {
            if (!config.debug)
                return;

            if (color) {
                if (colors[color] == null)
                    throw new Error(colors.red(`Error in function modulerizr.log(someText,color): Color "${color}" does not exist. Please look in package https://www.npmjs.com/package/colors which colors exist."`))
                console.log(colors[color](text));
            } else
                console.log(text);

        },
        config

    }
}

exports.Modulerizr = Modulerizr;
exports.components = files.components;
exports.src = files.src
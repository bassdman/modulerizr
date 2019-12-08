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
        log(text) {
            if (!config.debug)
                return;

            console.log(text);

        },
        config

    }
}

exports.Modulerizr = Modulerizr;
exports.components = files.components;
exports.src = files.src
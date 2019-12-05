const files = {
    components: {},
    src: {}
};

function Store() {
    return {
        setComponent(name, obj) {
            this.set('component', name, obj);
        },
        setSrc(name, obj) {
            this.set('src', name, obj);
        },
        getSrc(name) {
            if (name == null)
                throw new Error('Store.getSrc(name): Name is not defined. Which Src-File do you mean?');

            return this.get('src', name);
        },
        getComponent(name) {
            if (name == null)
                throw new Error('Store.getComponent(name): Name is not defined. Which Component do you mean?');

            return this.get('src', name);
        },
        set(type, name, obj) {
            if (type !== 'src' && type !== 'components')
                throw new Error('Store.set(type,name,config): Type is not correct. It must be either "components" or "src". But it is "' + type + '".');

            if (name == null)
                throw new Error('Store.set(type,name,config): Name is not defined. Which Src-File do you mean?');

            if (!typeof obj == 'object')
                throw new Error('Store.set(type,name,config): config must be an object.');

            files[type][name] = obj;
        },
        get(type, name) {
            if (type !== 'src' && type !== 'components')
                throw new Error('Store.set(type,name,config): Type is not correct. It must be either "components" or "src". But it is "' + type + '".');

            if (name == null) {
                return files[type];
            }


            return files[type][name];
        },
    }
}

exports.Store = Store;
exports.components = files.components;
exports.src = files.src
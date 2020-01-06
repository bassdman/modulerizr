const {
    StarWarsPluginV1,
    StarWarsPluginV2,
    StarWarsPluginV3,
    StarWarsPluginV4
} = require("./StarWarsPlugin");

/*
    Comment / uncomment the specific versions of the starwars-plugin to see how they behave.
    To run this config, type "npm run modulerizr_starwars"
*/
module.exports = {
    "src": ["/*.src.html"],
    "components": ["*.component.html"],
    plugins: [
        //    new StarWarsPluginV1(),
        //    new StarWarsPluginV2(),
        //    new StarWarsPluginV3(),
        new StarWarsPluginV4()
    ]
}
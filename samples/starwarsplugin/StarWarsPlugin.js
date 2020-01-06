const fetch = require('node-fetch');

/*
    Start StarwarsPlugin V1 - we created a basic webpack-plugin
*/
class StarWarsPluginV1 {
    constructor(pluginconfig = {}) {}
    apply(compiler) {
        console.log('StarWarsPlugin is executed')
    }
}

/*
    Start StarwarsPlugin V2 - we added a modulerizr-Hook
*/
class StarWarsPluginV2 {
    constructor(pluginconfig = {}) {}
    apply(compiler) {
        // We want the star wars data to be added on top of the rendered Data. So we use the "modulerizrFileRendered"-Hook
        compiler.hooks.modulerizrFileRendered.tap('StarWarsPlugin', ($el, srcFile, context) => {
            console.log('here we have to add our code');
        });
    }
}

/*
    Start StarwarsPlugin V2 - we modified the html
*/
class StarWarsPluginV3 {
    constructor(pluginconfig = {}) {}
    apply(compiler) {
        // We want the star wars data to be added on top of the rendered Data. So we use the "modulerizrFileRendered"-Hook
        compiler.hooks.modulerizrFileRendered.tap('StarWarsPlugin', ($, srcFile, context) => {
            const $body = $('head');
            $body.append("<script>console.log(`Let's add some starwars-data`);</script>");
            // or in short: $('body').append("<script>console.log('Let's add some starwars-data');</script>");
        });
    }
}

/*
    Start StarwarsPlugin V2 - we added an init-hook and render all starwars-characters to the src-file.
*/
class StarWarsPluginV4 {
    constructor(pluginconfig = {}) {}
    apply(compiler) {
        //We want the starwars-data to be fetched just on beginning - so we use the modulerizrInit-Hook
        compiler.hooks.modulerizrInit.tapPromise('StarWarsPlugin', async context => {
            const starwarsCharacters = await fetch('https://swapi.co/api/people/').then(res => res.json())
            context.starwarsCharacters = starwarsCharacters;
        });

        // We want the star wars data to be rendered in each file. So we use the "modulerizrFileRendered"-Hook
        compiler.hooks.modulerizrFileRendered.tap('StarWarsPlugin', ($, srcFile, context) => {
            const $body = $('head');
            const starwarsDataAsString = JSON.stringify(context.starwarsCharacters.results);
            $body.append(`<script>var starwarsdata = ${starwarsDataAsString};</script>`);
        });
    }
}

exports.StarWarsPluginV1 = StarWarsPluginV1;
exports.StarWarsPluginV2 = StarWarsPluginV2;
exports.StarWarsPluginV3 = StarWarsPluginV3;
exports.StarWarsPluginV4 = StarWarsPluginV4;
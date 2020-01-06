# Modulerizr

[![npm version](https://img.shields.io/npm/v/modulerizr.svg)](https://www.npmjs.com/package/modulerizr)
[![npm downloads](https://img.shields.io/npm/dt/modulerizr.svg)](https://www.npmjs.com/package/modulerizr)
[![npm downloads](https://img.shields.io/github/license/mashape/apistatus.svg)](https://www.npmjs.com/package/modulerizr)

Quick Links
- [Main page](https://github.com/bassdman/modulerizr/)
- [ModulerizrWebpackPlugin](https://www.npmjs.com/package/modulerizr-webpack-plugin)

## Create your own Plugins


A Modulerizr-Plugin is just a webpack-plugin. That means, a modulerizr-plugin is a webpack-plugin with some extra features. And every webpack plugin also works with modulerizr.
To learn how to create a webpack plugin, look up the  [webpack-documentation](https://webpack.js.org/contribute/writing-a-plugin/).

### Build up a custom Plugin
Let's imagine, you need some data of star wars characters available in every of your components. Let's create a star-wars-plugin for it.
You find the sources here: 
#### Create the basics
A webpack plugin is a class with an apply function. Let's create it for our star-wars-plugin.

File: StarWarsPlugin.js
```javascript
class StarWarsPlugin {
    constructor(pluginconfig = {}) {
    }
    apply(compiler) {
       console.log('StarWarsPlugin is executed')    
    }
}
exports.StarWarsPlugin = StarWarsPlugin;
```
We can embedd this plugin in our webpack or modulerizr-config:

Webpack: 
```javascript
const { ModulerizrWebpackPlugin } = require('modulerizr-webpack-plugin');
const { StarWarsPlugin } = require('./StarWarsPlugin');

const path = require('path');

module.exports = {
    output: {
        path: 'path/to/dest'
    },
    entry: './anEntryFile.js',
    plugins: [
        new ModulerizrWebpackPlugin({
            // your configuration here
        }),
        new StarWarsPlugin() 
    ]
};
```

Modulerizr:
``` javascript
const { modulerizr } = require("modulerizr");
const { StarWarsPlugin } = require('./StarWarsPlugin');

modulerizr.run({
    ...
    plugins: [new StarWarsPlugin()],
    //other configuration here
    ...
})
```

When we execut it, we will already have a log "Starwars plugin is executed". Yippeeee :)

#### Extend some hooks
Webpack uses hooks to modify the webpack context. There are default webpack-hooks that can be used, with modulerizr you have some extra hooks. Look up here for the [standard-webpack-hooks](https://webpack.js.org/api/compiler-hooks/).
With the [Modulerizr-Hooks](#modulerizr-hooks) you have the chance to modify the files in a simple way with jquery-syntax. Let's use a custom modulerizr-hook.

```javascript
class StarWarsPlugin {
    constructor(pluginconfig = {}) {
    }
    apply(compiler) {
        // We want the star wars data to be added on top of the rendered Data. So we use the "modulerizrFileRendered"-Hook
       compiler.hooks.modulerizrFileRendered.tap('StarWarsPlugin', ($el, srcFile, context) => {
            console.log('here we have to add our code');
        });   
    }
}
exports.StarWarsPlugin = StarWarsPlugin;
```
If you are familiar with jquery, you can just start modifying the html using the $el-Parameter.
In this hook it is the root-Element of the src-file. With it you can modify the html, get some Attributes, select subtags,..
See the documentation of [cheerio](https://github.com/cheeriojs/cheerio) (=jquery-library on server side) for details.

#### Modify HTML

Let's add a script to each source-file that logs "Let's add some starwars-data".
We want this script tag as last tag of the head
```javascript
class StarWarsPlugin {
    constructor(pluginconfig = {}) {
    }
    apply(compiler) {
        // We want the star wars data to be added on top of the rendered Data. So we use the "modulerizrFileRendered"-Hook
       compiler.hooks.modulerizrFileRendered.tap('StarWarsPlugin', ($, srcFile, context) => {
           const $body = $('head');
           $body.append("<script>console.log('Let's add some starwars-data');</script>");
            // or in short: $('body').append("<script>console.log('Let's add some starwars-data');</script>");
        });   
    }
}
exports.StarWarsPlugin = StarWarsPlugin;
```

#### Get StarWars-Characters
Luckily there is the [Swapi](https://swapi.co/) to get all relevant star wars data via api.
We want to fetch all characters, this can be done by the url https://swapi.co/api/people/ .

```javascript
const fetch = require('node-fetch');

class StarWarsPlugin {
    constructor(pluginconfig = {}) {
    }
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
exports.StarWarsPlugin = StarWarsPlugin;
```
That's it. Now we have added star wars data to every src-file. Of course this shouldn't be a real usecase. But it shows how to create new Plugins.
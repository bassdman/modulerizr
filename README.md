# Modulerizr

> Integrate a component based architecture to your legacy project in just a few steps

[![npm version](https://img.shields.io/npm/v/modulerizr.svg)](https://www.npmjs.com/package/modulerizr)
[![npm downloads](https://img.shields.io/npm/dt/modulerizr.svg)](https://www.npmjs.com/package/modulerizr)
[![npm downloads](https://img.shields.io/github/license/mashape/apistatus.svg)](https://www.npmjs.com/package/modulerizr)
## Install

``` shell
    npm install modulerizr --save-dev
```

<!-- - [Quicklink to the API](#api-description) -->

## The Problem
When designing larger websites you will end up in many problems you have to challenge, like 
- very large files imports 
- overwriting css-rules, 
- overwriting/global scoped javascript-variables,
- serverside syntax like php,jsp,... mixed with html-content
- ...
Let's consider the html below:
``` html
<html>
    <head>
        <title>Startpage</title>
        <!-- 
            This Stylesheet is 100kb large because it includes all the styles of your project.
            And you just need ****** 5% oft thes styles on this page 
        -->
        <link rel="stylesheet" type="text/css" href="path/to/your/css/allStyles.css">

        <!-- 
            This script all libraries you need in your project - again 95% that are not used.
        -->
        <script src="path/to/global-scripts.js"></script>

        <style>
            .aPseudoLocalClass{
                color: green
            }
        </style>
    </head>
    <body>
        <!-- 
            Many legacy projects have serverside syntax in the templates PHP, jsp,... most of the time.
            Here shown with the brackets.
        -->
        {+include-head}
            <!-- **** There is a selector with !important to class aPseudoLocalClass in the globalStyles. Now it's pink... -->
            <div class="aPseudoLocalClass">
                My color is pink, not green :D
            </div>
            <script>
                ...
                //oh, there was a global scoped variable. Now I have overwritten it an a onclick-script does does something wrong... *angry-smiley*
                {!testmode}
                    var color = '{{serversideColor}}';
                {/!testmode}
                {testmode}
                    var color = '{{anyOtherColor}}';
                {/testmode}
                ...
            </script>
        {+include-footer}
    </body>
</html>
```

Many solutions exist to reduce these problems in web projects, one of the most important ones is modularisation. 
With it you have many small components that don't affect any other - except you want it. There are many good frameworks that do a veeeery, very good job with it
 - Angular
 - Vue
 - React
 - ... many other ones

BUT: These Frameworks DON'T WORK GOOD WITHIN LEGACYPROJECTS. Have you ever seen Serverside-Syntax in Vue or Angular-Templates. No. That means you can not easily switch to modularisation when all your architecture is currently designed with php.

Here's is a solutionen - where you can have serverside syntax AND modularisation without big effort.

## The solution
Modulerizr.

While angular, react,... give you many great features from the scratch without having to think about it, Modulerizr does it vice versa. It gives you a simple infrastructure for modularisation and you can add the features you want.

Because of this, you can append it to almost every legacy project you can imagine. 

## Usage

Imagine the following html-page "startpage.hml": 

``` html
<html>
    <head>
        <title>Startpage</title>
        ...
    </head>
    <body>
        {+include-head}
            <!-- **** There is a selector with !important to class aPseudoLocalClass in the globalStyles. Now it's pink... -->
            <custom-component-1>Some Text from component1</custom-component1>
            <custom-component-2>{{serversideText}}</custom-component2>
        {+include-footer}
    </body>
</html>
```
>The Brackets { } show serverside syntax. You could also add php-syntax,...

The component "custom-component-1.component.hml":
``` html
<template name="custom-component1">
    <style scoped>
        .color{color:green}
    </style>
    <script scoped>
        var x = "a scoped variable";
    </script>
    <div class="color"><slot></slot></div>
</template>
```

And the component "custom-component-2.component.hml":
``` html
<template name="custom-component2">
    <style scoped>
        .color{color:red}
    </style>
    <script scoped>
        var x = "another scoped variable; was not defined before";
    </script>
    <div class="color"><slot></slot></div>
    {{Some serverside Syntax here}}
</template>
```

Then run modulerizr:
``` javascript
const { modulerizr } = require('modulerizr');

modulerizr.run({
    "src": ["startpage.html"],
    "components": ["*.component.html"],
    "dest": "./dest/",
});
```
> More ways to run modulerizr you see in the next section ["How to run modulerizr"](#how-to-run-modulerizr)

Voilà, your're done. This will be rendered to:
``` html
<html>
    <head>
        <title>Startpage</title>
        ...
    </head>
    <body>
        {+include-head}
            <div id="1e34329b" data-v-1e34329b data-component="custom-component1">
                <style>
                    .color[data-v-1e34329b]{color:red}
                </style>
                <script>
                    (function(){
                        var x = "a scoped variable";
                    })();   
                </script>
                <div class="color" data-v-1e34329b>Some Text from component1</div>
            </div>
            <div id="93d13c56" data-v-93d13c56  data-component="custom-component2">
                <style>
                    .color[data-v-93d13c56]{color:red}
                </style>
                <script>
                    (function(){
                        var x = "another scoped variable; was not defined before";
                    })();   
                </script>
                <div class="color" data-v-93d13c56>{{serversideText}}</div>
                {{Some serverside Syntax here}}
            </div>
        {+include-footer}
    </body>
</html>
```

If you need some more specials features, just [add a plugin](#plugins) that does what you need.


## How to run modulerizr
There are multiple ways to run it. With Terminal or with node.

### Run in Terminal
Before running it, add a modulerizr.config.js in the root-folder.
``` javascript
module.exports = {
    "src": ["**/*.src.html"],
    "components": ["*.component.html"],
    "dest": "./dest/",
}
```

##### Variant 1 - globally installed:
Install the package
``` shell
    npm install modulerizr --global
```
And run it
``` shell
    modulerizr run
```
##### Variant 2 - locally installed:
Install the package
``` shell
    npm install modulerizr --save-dev
```

Add a script to the package.json
``` javascript
{
    ...
    "scripts": {
        "modulerizr": "modulerizr run"
    }
    ...
}
```
and run it 
``` shell
    npm run modulerizr    
```

##### Commandline-Parameters
``` shell
    #both overwrites debug-Attribute in config
 
    #debug mode: shows logs; 
    modulerizr --debug 

    #production mode: hides logs; default;
    modulerizr --production 
```
#### Node
Here's how 
``` javascript
    const { modulerizr } = require('modulerizr');
    const config = {...} // some config
    modulerizr.run(config)  
```

### Modulerizr.config
You can run one config or an array of configs
``` javascript
    const { modulerizr } = require('modulerizr');
    const config1 = {...} // some config
    const config2 = {...} // some other config

    //executes one config
    modulerizr.run(config1);
    
    //executes multiple configs
    modulerizr.run([config1,config2]);
```
Config attributes
##### src
All src-files that will be prerendered. They will be copied into the destination-folder. [Glob-Syntax](https://www.npmjs.com/package/glob).
Type String or Array. Required.
``` javascript
{
    ...
    // it can be a string
    "src": "**/*.allsrcfiles.html",

    //or an array of strings
    "src": ["srcfile1.html","srcfile2.html","srcfile3.html"]
    ...
}
```

##### components
All component-files. [Glob-Syntax](https://www.npmjs.com/package/glob).
Type: String or Array. Required.
``` javascript
{
    ...
    // it can be a string
    "components": "**/*.component.html",

    //or an array of strings
    "components": ["comp1.component.html","comp2.component.html","comp3.component.html"]
    ...
}
```

##### dest
The folder where the files will be rendered to. 
Type: String. Required.
``` javascript
{
    ...
    "dest": "./dest",
    ...
}
```

##### debug
Debugmode. Shows logs if debug == true. 
Will be overwritten by the [--debug](#commandline-parameters) or [--production]((#commandline-parameters)) Parameter in command line.
Type: Boolean. Default: false. 
``` javascript
{
    ...
    "debug": true,
    ...
}
```

##### plugins
If you need a custom feature, you can add it via plugin.
Type: Array. 
``` javascript
const { modulerizr, DebugPlugin } = require("modulerizr");

modulerizr.run({
    ...
    //Add your plugins here
    "plugins": [DebugPlugin()],
    ...
})
```

##### defaultComponentWrapper
By Default, components are wrapped by a div-tag. To change this, a component needs a "wrapper"-attribute or you can you can use a default-wrapper-tag for each component.
This will be overwritten by the tag assigned in the component.

``` javascript
const { modulerizr, DebugPlugin } = require("modulerizr");

modulerizr.run({
    ...
    //Now all you components will be wrapped by a span
    "defaultComponentWrapper": "span",
    ...
})
```


##### maxRecursionLevel
What happens if you add component A in component A and the content does not change? We have an infinte-loop.

```html
<component-a>
    <component-a>
        <component-a>
            <component-a>
                <component-a>
                    <component-a>
                        ...
                    </component-a>
                </component-a>
            </component-a>
        </component-a>
    </component-a>
</component-a>
```

We assume this is not expected - that's why there is a maximum recursion level. This example above has a recurison level of 6 (until the three dots "...") because there are 6 levels of components.
By default ther is a maximumRecursionLevel of 100 - if you have more, there will be an error because we expect, that there is sth wrong.

Maybe there is a usecase where you need more levels. You can increase this level in the config with the maxRecursionLevel-attribute.

``` javascript
const { modulerizr, DebugPlugin } = require("modulerizr");

modulerizr.run({
    ...
    //Now you can have 500 component-levels. Yippeeee
    "maxRecursionLevel": "500",
    ...
})
```

## Features
To understand the the next features, it is good to know the differences between components and src-files:
- Src-Files: 
   - Any html how you already use it
   - They are the Root-Files that will be prerendered. 
   - The transpilation of these files will be added in the dest-folder
   - Many features like scoped variables,... don't work in src-files (if you don't change this via config)

- Components
   - Currently each component must have its own file - this will be changed in future
   - It is wrapped by a template-tag with some attributes
   - A component can include other components
   - All features like scoping,... work in components
   - A component by itself won't be rendered - it (or a parent component) must be included into a src-file

### Basics

Without one of the next features, a component is just outsourced html from the original file - like a php-include. So we make sure, that the rendering process does not affect legacy files.

Example:
src-file.html
``` html
<html>
    <head>...</head>
    <body>
        some text
        <component-1></component-1>
        some text
    </body>
</html>
```
component1.component.html
```html
<template name="component-1">
    This is component1
</template>
```
dest-file:
``` html
<html>
    <head>...</head>
    <body>
        some text
        This is component1
        some text
    </body>
</html>
```

To be honest: This feature by itself is not better then a php-include, it wouldn't make sense writing this package to add a feature that can be added without effort.

Let's add some more "magic":

### Components
Sorry, before adding "magic", we need the basics of components.
A component is always wrapped by a template-tag and has a uniqe name.
``` html
    <template name="xyz">
        here comes the content
    </template>
```
If the name is missing or a component with this name already exists, there will be an error.

#### Slots
The first "magic", well known from vue, web-components,...

> this readme will be continued pretty soon



### Plugins


### Features in future
- inline-templates in src-files, marked with a "inline-template"-Attribute.
- multiple components per file


> Hint: This readme is not finished yet. Wait a few days for more information.


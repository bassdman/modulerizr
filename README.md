# Modulerizr

> Integrate a configurable, component based architecture to your legacy project in just a few steps

[![npm version](https://img.shields.io/npm/v/modulerizr.svg)](https://www.npmjs.com/package/modulerizr)
[![npm downloads](https://img.shields.io/npm/dt/modulerizr.svg)](https://www.npmjs.com/package/modulerizr)
[![npm downloads](https://img.shields.io/github/license/mashape/apistatus.svg)](https://www.npmjs.com/package/modulerizr)
## Install

``` shell
    npm install modulerizr --save-dev
```

<!-- - [Quicklink to the API](#api-description) -->

## The Problem
When designing websites you will end up in many problems like very large files imports, overwriting css-rules, overwriting javascript-variables,...
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

Many of the problems existing in legacy projects can be solved with modularisation. 
With it you have many small components that don't affect any other - except you want it. There are many good frameworks that do a veeeery, very good job with it
 - Angular
 - Vue
 - React
 - ... many other ones

BUT: These Frameworks DON'T WORK GOOD WITHIN LEGACYPROJECTS. Have you ever seen Serverside-Syntax in Vue or Angular-Templates. No. That means you can not easily switch to modularisation when all your architecture is currently designed with php.

But there is a solutionen - where you can have serverside syntax AND modularisation without big effort.

## The solution
Modulerizr.

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

This will be rendered to:
``` html
<template name="custom-component2">
    <style scoped>
        .color{color:red}
    </style>
    <script scoped>
        var x = "another scoped variable; was not defined before";
    </script>
    <div class="color"><slot></slot></div>
</template>
<html>
    <head>
        <title>Startpage</title>
        ...
    </head>
    <body>
        {+include-head}
            <div id="1e34329b" data-v-1e34329b>
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
            <div id="93d13c56" data-v-93d13c56>
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

And if you prefer some specials, you just need to add a plugin.
And all you need is ca

This readme is not finished yet. Wait a few days for more information.
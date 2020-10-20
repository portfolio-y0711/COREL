Corel (kəˈrɑːl)
==================
Corel is a typescript library used for developing [my personal portfolio application][] (named as 'GET IT JOB') in a modular way.

![corelle-img]

_As stated above, this library is __part of a personal project__.  This package library is limited to the study level. You'd better find more refined one like [scaleApp](https://github.com/flosse/scaleApp) for your own project_

## Intent & limit

This library was basically written to illustrate how I wrote a scalable multi pages frontend app for my portfolio project.

Despite the drawbacks of the library, I decided to package it with the following intent: 

* Packaging itself will help to modularize my portfolio project

* Trying to explain how to use will make it easier to spot the absurdity of library

* One of main themes in my project is __continuous integration and delivery__, and packaging and sharing are very useful for their implementation.

This library has the following limitations:

* Containing only as much code as needed in my personal portolio project

* Not sufficiently refactored, I'm pretty sure it will contain unnecessary and less beautiful code.

* With a high probability, no further improvement of library is expected to happen once project completed (since it would be better to write whole new code than to improve)

## How to Use

Basic directory structure in my project is as follows: 

```javascript
.
├── main.ts
└── app
    ├── index.ts
    └── modules
        └── selector.ts

```

**Step 1**   

Install package via npm or yarn.

```
$ npm install corel
```

**Step 2**


Write a javascript object (eg selector_box) corresponding to __html code chunks__ _'as a module unit'_ according to the signature of the module-type.

```javascript
/* selector.ts */

import { DepType, LoaderType, SandboxType } from 'corel';

export const selector_box: ModuleType = {
  name: 'selector'  ,
  type:DepType.MODULE,
  loader: (sandbox: SandboxType)=> new (class _ implements LoaderType {
      dock: () => { };
      update: () => { };
      load: () => { };
      unload: () => { };
  })()
};

```

**Step 3**

Write an option to be injected into the application. (modules written above is to be included in the array named 'mods').

```javascript
/* app/index.ts */

import { selector_box } from './modules';

export const option: Option = {
    ShoppingCart: {
        "SHP": {
            libs: [ts_log, jquery_dom],
            mods: [selector_box, selected_box, tablebook_box]
        }
    }
};

```

**Step 4**

Inject the above option and the title of the html document in the outermost client code.

```javascript
/* main.ts */

import { Corel } from './lib';
import { option } from './app';

window.onload = () => {
    const page = document.getElementsByTagName('title')[0].text;
    Corel.set(option)
        .create(page)
        .start_all();
};

```

**Step 5**

Write the html document to import bundle.js that we will create as shown below in __Step 6__. The html document should have a title tag with a value __'ShoppingCart'__ later to be fetched by your application at the time of document loading.

```html
/* index.html */
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShoppingCart</title>
</head>

<body>

</body>
<script src="bundle.js"></script>

</html>
```

**Step 6**

Transpile code with tsc or any bundler which supports typescript compilation and name it as __bundle.js__.

```
/* tsconfig.json */
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": [
      "DOM",
      "ES5"
    ],
    "outDir": "./dist", 
    "types": [
      "node",
      "jQuery"
    ], 
  },
  "include": [
    "./index.ts"
  ]
}
```

Next, bundle the converted JavaScript files in the dist folder with browserify to suit your browser environment.(use npx if you don't have browserify installed in your global scope).

```sh

$ npx browserify dist/main.js -o bundle.js

```

## Background

The library architecture is mainly inspired by:

* Nicholas Zakas: 

  * Presentation on Scalable Javascript Application:  [https://www.youtube.com/watch?v=vXjVFPosQHw](https://www.youtube.com/watch?v=vXjVFPosQHw)

* scaleApp (a lightweight Javascript framework written in coffee script)

  * github repo: [https://github.com/flosse/scaleApp](https://github.com/flosse/scaleApp)


[corelle-img]: https://m.media-amazon.com/images/S/aplus-media/sc/456f4aef-e0ee-4b41-a17c-90fc9a1293bd.__CR0,0,3000,1856_PT0_SX970_V1___.jpg

[my personal portfolio application]: http://15.165.100.1:8081/mvnwebapp/
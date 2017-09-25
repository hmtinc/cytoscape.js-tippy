cytoscape-tippy
================================================================================


## Description

A Cytoscape.js extension for tooltips using Tippy.js


## Dependencies

 * Cytoscape.js ^3.2.0
 * <List your dependencies here please>


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-tippy`,
 * via bower: `bower install cytoscape-tippy`, or
 * via direct download in the repository (probably from a tag).

Import the library as appropriate for your project:

ES import:

```js
import cytoscape from 'cytoscape';
import tippy from 'cytoscape-tippy';

cytoscape.use( tippy );
```

CommonJS require:

```js
let cytoscape = require('cytoscape');
let tippy = require('cytoscape-tippy');

cytoscape.use( tippy ); // register extension
```

AMD:

```js
require(['cytoscape', 'cytoscape-tippy'], function( cytoscape, tippy ){
  tippy( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## API

cytoscape.js-tippy is a very lightweight wrapper which maps calls to tippy upon graph elements (i.e nodes and edges) to
correct tippy functions while ensuring the parameters match the selected element. 

#### Basic Usage

```js
  cy.tippy(selector, tippyOptions)
```

* (Required) selector may be a function or a string. 
* (Optional) tippyOptions is identical to the options object used in vanilla tippy. Please refer to [Tippy.js](https://atomiks.github.io/tippyjs/) for more info

#### Creating a basic tippy object

```js
  cy.nodes()[0].tippy("#object");
```

Since the core of tippy is reliant on DOM elements, you must still provide the id for a unique DOM element when creating a new tooltip for a node.
The internal modified version of tippy will use this DOM element as a reference to create a popper object whose position will be modified based on the node size/position. 

#### Using a function as a selector

```js 
  cy.nodes().tippy(function(ele) {return "tippy-obj" + ele.id;});
```

If you are creating a lot of tippy elements, unlike vanilla tippy, you may opt to provide a function instead of a string. This function must be formatted to take in a graph element and return an unique ID as a string with the correct selector prefix (i.e "." for classes) 


### Binding Events to tippy.js methods

```js
  //Bind mouse over event to tippy.show()
  cyElement.on('mouseover', function (evt) {
    var popperElement = evt.target.scratch('tippy-popper')
    evt.target.scratch('tippy').show(popperElement);
  });
```
Unlike tippy.js events are not automatically bound to internal tippy actions. If you wish to bind these events in different cases to tippy events, simply just use tippy as you normally would from the scratchpad within the cytoscape binding function.


### Basic HTML tippy tool tips 
```js
			cy.nodes()[1].tippy("#object2", {
				html: document.querySelector('#htmlTest'),
				arrow: false,
				animation: 'fade',
				duration: 3000
			})
```
HTML tool tips initialization is identical to vanilla tippy.js, Please refer to [Tippy.js](https://atomiks.github.io/tippyjs/) for more info


## Build targets

* `npm run test` : Run Mocha tests in `./test`
* `npm run build` : Build `./src/**` into `cytoscape-tippy.js`
* `npm run watch` : Automatically build on changes with live reloading (N.b. you must already have an HTTP server running)
* `npm run dev` : Automatically build on changes with live reloading with webpack dev server
* `npm run lint` : Run eslint on the source

N.b. all builds use babel, so modern ES features can be used in the `src`.


## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Build the extension : `npm run build`
1. Commit the build : `git commit -am "Build for release"`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Push to origin: `git push && git push --tags`
1. Publish to npm: `npm publish .`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-tippy https://github.com/cytoscape&#x2F;cytoscape.js-tippy.git`

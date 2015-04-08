# Ember-cli-bless [![Build Status][travis-badge]][travis-badge-url]

Blesses css files using [blesscss](http://blesscss.com/)

Options for bless can be setup in your `Brocfile.js` 

```js
var app = new EmberApp({
  bless: {
    enabled: true,
    cacheBuster: true,
    compress: false,
    force: false,
    imports: true
    // log: true  }
});
```

## Use in broccoli

```js
var bless = require('ember-cli-bless').blessCss;

tree = bless(inputTree, options);
```


## Installation

`ember install:npm ember-cli-bless`


## Running Tests

* `npm test`


[travis-badge]: https://travis-ci.org/jschilli/ember-cli-bless.svg?branch=master
[travis-badge-url]: https://travis-ci.org/jschilli/ember-cli-bless

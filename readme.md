Layout component
================

[![build status](https://img.shields.io/travis/magsdk/component-layout.svg?style=flat-square)](https://travis-ci.org/magsdk/component-layout)
[![npm version](https://img.shields.io/npm/v/mag-component-layout.svg?style=flat-square)](https://www.npmjs.com/package/mag-component-layout)
[![dependencies status](https://img.shields.io/david/magsdk/component-layout.svg?style=flat-square)](https://david-dm.org/magsdk/component-layout)
[![devDependencies status](https://img.shields.io/david/dev/magsdk/component-layout.svg?style=flat-square)](https://david-dm.org/magsdk/component-layout?type=dev)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/magsdk)


Layout is a component to build user interface, an instance of [Component](https://github.com/stbsdk/component) module.


## Installation ##

```bash
npm install mag-component-layout
```


## Usage ##

Add the constructor to the scope:

```js
var Layout = require('mag-component-layout');
```

Create layout instance:

```js
var layout = new Layout({
    data: [
        'Some text',
         {
            className: 'icon star',
            name: '$starIcon'
         },
         {
            value: new Button({value:'Ok'}),
            name: 'okButton'
         },
         new Button({value:'Cancel'})
    ]
});
```


## Development mode ##

> There is a global var `DEVELOP` which activates additional consistency checks and protection logic not available in release mode.


## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/magsdk/component-layout/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`mag-component-layout` is released under the [MIT License](license.md).

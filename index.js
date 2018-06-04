/**
 * @license The MIT License (MIT)
 * @copyright Boris Aleynikov <aleynikov.boris@gmail.com>
 */

/* eslint no-path-concat: 0 */

'use strict';

var Component = require('stb-component'),
    keys      = require('stb-keys');

/**
 * Layout component implementation
 *
 * @constructor
 * @extends Component
 *
 * @param {Object}   [config={}]          init parameters (all inherited from the parent)
 * @param {Array} [config.data] array of items to add to layout
 */
function Layout ( config ) {
    var self = this;

    // sanitize
    config = config || {};

    /**
     * Index of focused child component
     * @type {number}
     */
    this.focusIndex = 0;

    if ( DEVELOP ) {
        if ( typeof config !== 'object' ) {
            throw new Error(__filename + ': wrong config type');
        }
        // init parameters checks
        if ( 'className' in config && config.className !== undefined && typeof config.className !== 'string' ) {
            throw new Error(__filename + ': wrong or empty config.className');
        }
    }

    //config.className = 'layout ' + (config.className || '');

    /**
     * Component data
     * @type {Array}
     */
    this.data = [];

    Component.call(this, config);

    this.init(config);

    // add listener to move focus between children
    this.addListener('keydown', function ( event ) {
        switch ( event.code ) {
            case keys.right:
                if ( self.children.length && self.focusIndex < self.children.length - 1 ) {
                    self.children[++self.focusIndex].focus();
                }
                break;
            case keys.left:
                if ( self.children.length && self.focusIndex > 0 ) {
                    self.children[--self.focusIndex].focus();
                }
                break;
            case keys.back:
                // focus parent focused item if parent is layout list
                if ( self.parent ) {
                    self.parent.focus();
                    if ( self.$parentItem ) {
                        self.parent.focusItem(self.$parentItem);
                    }
                }
                break;
        }
    });
}


Layout.prototype = Object.create(Component.prototype);
Layout.prototype.constructor = Layout;

// set component name
Layout.prototype.name = 'mag-component-layout';


/**
 * Make all the data items identical.
 * Wrap to objects if necessary.
 *
 * @param {Array} data incoming array
 * @return {Array} reworked incoming data
 */
function normalize ( data ) {
    var index, item;

    if ( DEVELOP ) {
        if ( arguments.length !== 1 ) {
            throw new Error(__filename + ': wrong arguments number');
        }
        if ( !Array.isArray(data) ) {
            throw new Error(__filename + ': wrong data type');
        }
    }

    // rows
    for ( index = 0; index < data.length; index++ ) {
        // cell value
        item = data[index];
        // plain text
        if ( typeof item === 'object' ) {
            // HTML element or component
            if ( item instanceof Component || item instanceof HTMLElement ) {
                data[index] = {
                    value: item,
                    wrap: false
                };
            } else {
                data[index].wrap = true;
            }
        } else {
            // wrap with defaults
            data[index] = {
                value: data[index],
                wrap: true
            };
        }
    }

    return data;
}


/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} config init parameters (subset of constructor config params)
 */
Layout.prototype.init = function ( config ) {
    var self = this,
        data = normalize(config.data),
        item, $wrapper, index;

    // clear element if reinit
    while (this.$node.firstChild) {
        this.$node.removeChild(this.$node.firstChild);
    }

    this.data = data;

    /**
     * @this Component
     */
    function componentClickHandler (  ) {
        self.focusIndex = this.index;
    }

    for ( index = 0; index < data.length; index++ ) {
        item = data[index];
        // plain text
        if ( typeof item.value === 'string' ) {
            $wrapper = document.createElement('div');
            $wrapper.textContent = item.value;
            if ( item.className ) { $wrapper.className = item.className; }
            this.$node.appendChild($wrapper);
        } else if ( item.value instanceof HTMLElement ) {
            // HTML Element

            // if with wrapper
            if ( item.wrap ) {
                $wrapper = document.createElement('div');
                if ( item.className ) { $wrapper.className = item.className; }
                $wrapper.appendChild(item.value);
                this.$node.appendChild($wrapper);
            } else {
                // without wrapper
                this.$node.appendChild(item.value);
            }
        } else if ( item.value instanceof Component ) {
            // component
            // force propagate events
            item.value.propagate = true;

            // set index to current component
            item.value.index = this.children.length;

            // change layout focus index if click component
            item.value.addListener('click', componentClickHandler);

            // append component
            if ( item.wrap ) {
                // with wrapper
                $wrapper = document.createElement('div');
                if ( item.className ) { $wrapper.className = item.className; }
                $wrapper.appendChild(item.value.$node);
                this.$node.appendChild($wrapper);
                this.children.push(item.value);
                item.value.parent = this;
            } else {
                // without wrapper
                this.add(item.value);
            }
        } else {
            $wrapper = document.createElement('div');
            if ( item.className ) { $wrapper.className = item.className; }
            this.$node.appendChild($wrapper);
        }
    }
};


module.exports = Layout;

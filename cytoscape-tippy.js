(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeTippy"] = factory();
	else
		root["cytoscapeTippy"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tippyRenderer = __webpack_require__(2);

module.exports.core = function (selector, userOptions) {
  //Get cytoscape object and container
  var cy = this;

  //Create options object for current element
  var options = tippyRenderer.createTippyOptionsObject(userOptions);

  //Store temp data
  cy.scratch('tippy-opts', options);
  cy.scratch('tippy-target', selector);

  //Create a tippy object
  var tippy = tippyRenderer.createTippyObject(cy);
  cy.scratch('tippy', tippy);

  return this; // chainability
};

//Create a tippy object for all elements in a collection
module.exports.collection = function (selector, userOptions) {
  var elements = this;

  //Loop over each element in the current collection.
  elements.each(function (element, i) {
    //Create options object for current element
    var options = tippyRenderer.createTippyOptionsObject(userOptions);

    //Store temp data
    element.scratch('tippy-opts', options);
    element.scratch('tippy-target', selector);

    //Create a tippy object
    var tippy = tippyRenderer.createTippyObject(element);
    element.scratch('tippy', tippy);
  });

  return this; // chainability
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//Update tippy object
module.exports.updateTippyObjectPosition = function (cyElement) {
    var tippy = cyElement.scratch('tippy');
    tippy.update();
    return tippy;
};

//Return the bounding rectangle for the given element
module.exports.getPopperBoundingBox = function (cyElement, cy, isNode, dim) {
    var position;

    if (isNode) {
        position = cyElement.renderedPosition();
    } else {
        position = cyElement.midpoint();
    }

    //Use midpoint of the element as the desired position
    var widthAvg = cyElement.outerWidth() / 2;
    var heightAvg = cyElement.outerHeight() / 2;
    position.x -= widthAvg;
    position.y -= heightAvg;

    var cyOffset = cy.container().getBoundingClientRect();

    //Exit if position is invalid
    if (!position || position.x == null || isNaN(position.x)) {
        return;
    }

    //Return the bounding  box
    return {
        top: position.y + cyOffset.top + window.pageYOffset,
        left: position.x + cyOffset.left + window.pageXOffset,
        right: position.x + dim.w + cyOffset.left + window.pageXOffset,
        bottom: position.y + dim.h + cyOffset.top + window.pageYOffset,
        width: dim.w,
        height: dim.h
    };
};

//Return dimensions
module.exports.getTippyObjectDimensions = function (cyElement, isNode) {
    //Set Defaults
    var width = 1;
    var height = 1;

    //Overide with the outer-dimensions if the element is a node
    if (isNode) {
        width = cyElement.renderedOuterWidth();
        height = cyElement.renderedOuterHeight();
    }

    //Return a dimension object
    return { w: width, h: height };
};

//Return Popper Target (The element to bind popper to)
module.exports.getPopperObjectTarget = function (cyElement, targetOpt) {
    var target = null;

    //If target option is invalid, return error
    if (!targetOpt) {
        throw "Error : NULL Target";
    }
    //Execute function if user opted for a dyanamic target
    else if (typeof targetOpt === 'function') {
            target = targetOpt(cyElement);
        }
        //Treat target option as an ID if  user opted for a static target
        else if (typeof targetOpt === 'string') {
                target = targetOpt;
            } else {
                throw "Error : No Target";
            }

    //Check validity of parsed target
    if (target === null) {
        throw "Error : No Target";
    } else {
        return target;
    }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _tippy = __webpack_require__(3);

var _tippy2 = _interopRequireDefault(_tippy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Include helper functions and Tippy
var helper = __webpack_require__(1);

//Generate a options object to wrap the given user options
module.exports.createTippyOptionsObject = function (userOptions) {
    var options = Object.assign({}, userOptions);
    return options;
};

module.exports.createTippyObject = function (cyElement) {
    //If popper object already exists, update its position
    if (cyElement.scratch('popper')) {
        return helper.updateTippyObjectPosition(cyElement);
    }
    //Otherwise create a new popper object
    else {
            //Determine element properties to determine hoe to draw tippy object
            var isCy = cyElement.pan !== undefined && typeof cyElement.pan === 'function';
            var iscyElement = !isCy;
            var isNode = iscyElement && cyElement.isNode();
            var cy = isCy ? cyElement : cyElement.cy();

            //Get Values from scatchpad
            var userOptions = cyElement.scratch('tippy-opts');
            var selector = cyElement.scratch('tippy-target');
            var target = null;

            //Get Dimensions
            var dim = helper.getTippyObjectDimensions(cyElement, isNode);

            //Define popper refernce object
            var refObject = {
                getBoundingClientRect: function getBoundingClientRect() {
                    return helper.getPopperBoundingBox(cyElement, cy, isNode, dim);
                },
                get clientWidth() {
                    return dim.w;
                },
                get clientHeight() {
                    return dim.h;
                }
            };

            //Get target to bind popper to
            try {
                target = helper.getPopperObjectTarget(cyElement, selector);
            } catch (e) {
                //Error
                //Stop creating a popper for tippy
                return;;
            }

            //Create an actual tippy object and override the reference object.
            var tippy = (0, _tippy2.default)(target, userOptions, refObject);

            //Get the actual html tippy element
            var tippyElement = document.querySelector(target);

            //Get popper
            var popper = tippy.getPopperElement(tippyElement);

            //Store popper object in a scratch pad
            cyElement.scratch('tippy-popper', popper);

            return tippy;
        }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.tippy = factory();
})(undefined, function () {
  'use strict';

  var Browser = {};

  if (typeof window !== 'undefined') {
    Browser.SUPPORTED = 'requestAnimationFrame' in window;
    Browser.SUPPORTS_TOUCH = 'ontouchstart' in window;
    Browser.touch = false;
    Browser.dynamicInputDetection = true;
    // Chrome device/touch emulation can make this dynamic
    Browser.iOS = function () {
      return (/iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream
      );
    };
  }

  /**
  * The global storage array which holds all data reference objects
  * from every instance
  * This allows us to hide tooltips from all instances, finding the ref when
  * clicking on the body, and for followCursor
  */
  var Store = [];

  /**
  * Selector constants used for grabbing elements
  */
  var Selectors = {
    POPPER: '.tippy-popper',
    TOOLTIP: '.tippy-tooltip',
    CONTENT: '.tippy-tooltip-content',
    CIRCLE: '[x-circle]',
    ARROW: '[x-arrow]',
    TOOLTIPPED_EL: '[data-tooltipped]',
    CONTROLLER: '[data-tippy-controller]'

    /**
    * The default settings applied to each instance
    */
  };var Defaults = {
    html: false,
    position: 'top',
    animation: 'shift',
    animateFill: true,
    arrow: false,
    arrowSize: 'regular',
    delay: 0,
    trigger: 'mouseenter focus',
    duration: 350,
    interactive: false,
    interactiveBorder: 2,
    theme: 'dark',
    size: 'regular',
    distance: 10,
    offset: 0,
    hideOnClick: true,
    multiple: false,
    followCursor: false,
    inertia: false,
    flipDuration: 350,
    sticky: false,
    stickyDuration: 200,
    appendTo: function appendTo() {
      return document.body;
    },
    zIndex: 9999,
    touchHold: false,
    performance: false,
    dynamicTitle: false,
    popperOptions: {}

    /**
    * The keys of the defaults object for reducing down into a new object
    * Used in `getIndividualSettings()`
    */
  };var DefaultsKeys = Browser.SUPPORTED && Object.keys(Defaults);

  /**
  * Hides all poppers
  * @param {Object} exclude - refData to exclude if needed
  */
  function hideAllPoppers(exclude) {
    Store.forEach(function (refData) {
      var popper = refData.popper,
          tippyInstance = refData.tippyInstance,
          _refData$settings = refData.settings,
          appendTo = _refData$settings.appendTo,
          hideOnClick = _refData$settings.hideOnClick,
          trigger = _refData$settings.trigger;

      // Don't hide already hidden ones

      if (!appendTo.contains(popper)) return;

      // hideOnClick can have the truthy value of 'persistent', so strict check is needed
      var isHideOnClick = hideOnClick === true || trigger.indexOf('focus') !== -1;
      var isNotCurrentRef = !exclude || popper !== exclude.popper;

      if (isHideOnClick && isNotCurrentRef) {
        tippyInstance.hide(popper);
      }
    });
  }

  var e = Element.prototype;
  var matches = e.matches || e.matchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector || function (s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
    while (--i >= 0 && matches.item(i) !== this) {}
    return i > -1;
  };

  /**
  * Ponyfill to get the closest parent element
  * @param {Element} element - child of parent to be returned
  * @param {String} parentSelector - selector to match the parent if found
  * @return {Element}
  */
  function closest(element, parentSelector) {
    var _closest = Element.prototype.closest || function (selector) {
      var el = this;
      while (el) {
        if (matches.call(el, selector)) {
          return el;
        }
        el = el.parentElement;
      }
    };

    return _closest.call(element, parentSelector);
  }

  /**
  * Ponyfill for Array.prototype.find
  * @param {Array} arr
  * @param {Function} checkFn
  * @return item in the array
  */
  function find(arr, checkFn) {
    if (Array.prototype.find) {
      return arr.find(checkFn);
    }

    // use `filter` as fallback
    return arr.filter(checkFn)[0];
  }

  /**
  * Adds the needed event listeners
  */
  function bindEventListeners() {
    var touchHandler = function touchHandler() {
      Browser.touch = true;

      if (Browser.iOS()) {
        document.body.classList.add('tippy-touch');
      }

      if (Browser.dynamicInputDetection && window.performance) {
        document.addEventListener('mousemove', mousemoveHandler);
      }
    };

    var mousemoveHandler = function () {
      var time = void 0;

      return function () {
        var now = performance.now();

        // Chrome 60+ is 1 mousemove per rAF, use 20ms time difference
        if (now - time < 20) {
          Browser.touch = false;
          document.removeEventListener('mousemove', mousemoveHandler);
          if (!Browser.iOS()) {
            document.body.classList.remove('tippy-touch');
          }
        }

        time = now;
      };
    }();

    var clickHandler = function clickHandler(event) {
      // Simulated events dispatched on the document
      if (!(event.target instanceof Element)) {
        return hideAllPoppers();
      }

      var el = closest(event.target, Selectors.TOOLTIPPED_EL);
      var popper = closest(event.target, Selectors.POPPER);

      if (popper) {
        var ref = find(Store, function (ref) {
          return ref.popper === popper;
        });
        var interactive = ref.settings.interactive;

        if (interactive) return;
      }

      if (el) {
        var _ref = find(Store, function (ref) {
          return ref.el === el;
        });
        var _ref$settings = _ref.settings,
            hideOnClick = _ref$settings.hideOnClick,
            multiple = _ref$settings.multiple,
            trigger = _ref$settings.trigger;

        // Hide all poppers except the one belonging to the element that was clicked IF
        // `multiple` is false AND they are a touch user, OR
        // `multiple` is false AND it's triggered by a click

        if (!multiple && Browser.touch || !multiple && trigger.indexOf('click') !== -1) {
          return hideAllPoppers(_ref);
        }

        // If hideOnClick is not strictly true or triggered by a click don't hide poppers
        if (hideOnClick !== true || trigger.indexOf('click') !== -1) return;
      }

      // Don't trigger a hide for tippy controllers, and don't needlessly run loop
      if (closest(event.target, Selectors.CONTROLLER) || !document.querySelector(Selectors.POPPER)) return;

      hideAllPoppers();
    };

    var blurHandler = function blurHandler(event) {
      var _document = document,
          el = _document.activeElement;

      if (el && el.blur && matches.call(el, Selectors.TOOLTIPPED_EL)) {
        el.blur();
      }
    };

    // Hook events
    document.addEventListener('click', clickHandler);
    document.addEventListener('touchstart', touchHandler);
    window.addEventListener('blur', blurHandler);

    if (!Browser.SUPPORTS_TOUCH && (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)) {
      document.addEventListener('pointerdown', touchHandler);
    }
  }

  /**
  * To run a single time, once DOM is presumed to be ready
  * @return {Boolean} whether the function has run or not
  */
  function init() {
    if (init.done) return false;
    init.done = true;

    bindEventListeners();

    return true;
  }

  /**
  * Waits until next repaint to execute a fn
  * @param {Function} fn
  */
  function defer(fn) {
    window.requestAnimationFrame(function () {
      setTimeout(fn, 0);
    });
  }

  /**
  * Returns the supported prefixed property - only `webkit` is needed, `moz`, `ms` and `o` are obsolete
  * @param {String} property
  * @return {String} - browser supported prefixed property
  */
  function prefix(property) {
    var prefixes = [false, 'webkit'];
    var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (var i = 0; i < prefixes.length; i++) {
      var _prefix = prefixes[i];
      var prefixedProp = _prefix ? '' + _prefix + upperProp : property;
      if (typeof window.document.body.style[prefixedProp] !== 'undefined') {
        return prefixedProp;
      }
    }

    return null;
  }

  /**
  * Ponyfill for Array.prototype.findIndex
  * @param {Array} arr
  * @param {Function} checkFn
  * @return index of the item in the array
  */
  function findIndex(arr, checkFn) {
    if (Array.prototype.findIndex) {
      return arr.findIndex(checkFn);
    }

    // fallback
    return arr.indexOf(find(arr, checkFn));
  }

  /**
  * Removes the title from the tooltipped element, setting `data-original-title`
  * appropriately
  * @param {Element} el
  */
  function removeTitle(el) {
    var title = el.getAttribute('title');

    // Only set `data-original-title` attr if there is a title
    if (title) {
      el.setAttribute('data-original-title', title);
    }

    el.removeAttribute('title');
  }

  /**
  * Determines if an element is visible in the viewport
  * @param {Element} el
  * @return {Boolean}
  */
  function elementIsInViewport(el) {
    var rect = el.getBoundingClientRect();

    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }

  /**
  * Triggers a document repaint or reflow for CSS transition
  * @param {Element} tooltip
  * @param {Element} circle
  */
  function triggerReflow(tooltip, circle) {
    // Safari needs the specific 'transform' property to be accessed
    circle ? window.getComputedStyle(circle)[prefix('transform')] : window.getComputedStyle(tooltip).opacity;
  }

  /**
  * Modifies elements' class lists
  * @param {Element[]} els - Array of elements
  * @param {Function} callback
  */
  function modifyClassList(els, callback) {
    els.forEach(function (el) {
      if (!el) return;
      callback(el.classList);
    });
  }

  /**
  * Returns inner elements of the popper element
  * @param {Element} popper
  * @return {Object}
  */
  function getInnerElements(popper) {
    return {
      tooltip: popper.querySelector(Selectors.TOOLTIP),
      circle: popper.querySelector(Selectors.CIRCLE),
      content: popper.querySelector(Selectors.CONTENT)
    };
  }

  /**
  * Applies the transition duration to each element
  * @param {Element[]} els - Array of elements
  * @param {Number} duration
  */
  function applyTransitionDuration(els, duration) {
    els.forEach(function (el) {
      if (!el) return;

      var isContent = matches.call(el, Selectors.CONTENT);

      var _duration = isContent ? Math.round(duration / 1.3) : duration;

      el.style[prefix('transitionDuration')] = _duration + 'ms';
    });
  }

  /**
  * Determines if a popper is currently visible
  * @param {Element} popper
  * @return {Boolean}
  */
  function isVisible(popper) {
    return popper.style.visibility === 'visible';
  }

  function noop() {}

  /**
  * Returns the non-shifted placement (e.g., 'bottom-start' => 'bottom')
  * @param {String} placement
  * @return {String}
  */
  function getCorePlacement(placement) {
    return placement.replace(/-.+/, '');
  }

  /**
  * Mousemove event listener callback method for follow cursor setting
  * @param {MouseEvent} e
  */
  function followCursorHandler(e) {
    var _this = this;

    var refData = find(Store, function (refData) {
      return refData.el === _this;
    });

    var popper = refData.popper,
        offset = refData.settings.offset;

    var position = getCorePlacement(popper.getAttribute('x-placement'));
    var halfPopperWidth = Math.round(popper.offsetWidth / 2);
    var halfPopperHeight = Math.round(popper.offsetHeight / 2);
    var viewportPadding = 5;
    var pageWidth = document.documentElement.offsetWidth || document.body.offsetWidth;

    var pageX = e.pageX,
        pageY = e.pageY;

    var x = void 0,
        y = void 0;

    switch (position) {
      case 'top':
        x = pageX - halfPopperWidth + offset;
        y = pageY - 2.25 * halfPopperHeight;
        break;
      case 'left':
        x = pageX - 2 * halfPopperWidth - 10;
        y = pageY - halfPopperHeight + offset;
        break;
      case 'right':
        x = pageX + halfPopperHeight;
        y = pageY - halfPopperHeight + offset;
        break;
      case 'bottom':
        x = pageX - halfPopperWidth + offset;
        y = pageY + halfPopperHeight / 1.5;
        break;
    }

    var isRightOverflowing = pageX + viewportPadding + halfPopperWidth + offset > pageWidth;
    var isLeftOverflowing = pageX - viewportPadding - halfPopperWidth + offset < 0;

    // Prevent left/right overflow
    if (position === 'top' || position === 'bottom') {
      if (isRightOverflowing) {
        x = pageWidth - viewportPadding - 2 * halfPopperWidth;
      }

      if (isLeftOverflowing) {
        x = viewportPadding;
      }
    }

    popper.style[prefix('transform')] = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  }

  /**
  * Returns an array of elements based on the selector input
  * @param {String|Element|Element[]} selector
  * @return {Element[]}
  */
  function getArrayOfElements(selector) {
    if (selector instanceof Element) {
      return [selector];
    }

    if (Array.isArray(selector)) {
      return selector;
    }

    return [].slice.call(document.querySelectorAll(selector));
  }

  /**
  * Prepares the callback functions for `show` and `hide` methods
  * @param {Object} data
  * @param {Number} duration
  * @param {Function} callback - callback function to fire once transitions complete
  */
  function onTransitionEnd(data, duration, callback) {
    // Make callback synchronous if duration is 0
    if (!duration) {
      return callback();
    }

    var _getInnerElements = getInnerElements(data.popper),
        tooltip = _getInnerElements.tooltip;

    var transitionendFired = false;

    var listenerCallback = function listenerCallback(e) {
      if (e.target === tooltip && !transitionendFired) {
        transitionendFired = true;
        callback();
      }
    };

    // Fire callback upon transition completion
    tooltip.addEventListener('webkitTransitionEnd', listenerCallback);
    tooltip.addEventListener('transitionend', listenerCallback);

    // Fallback: transitionend listener sometimes may not fire
    clearTimeout(data._transitionendTimeout);
    data._transitionendTimeout = setTimeout(function () {
      if (!transitionendFired) {
        callback();
      }
    }, duration);
  }

  /**!
   * @fileOverview Kickass library to create and place poppers near their reference elements.
   * @version 1.12.5
   * @license
   * Copyright (c) 2016 Federico Zivolo and contributors
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */
  var nativeHints = ['native code', '[object MutationObserverConstructor]'];

  /**
   * Determine if a function is implemented natively (as opposed to a polyfill).
   * @method
   * @memberof Popper.Utils
   * @argument {Function | undefined} fn the function to check
   * @returns {Boolean}
   */
  var isNative = function isNative(fn) {
    return nativeHints.some(function (hint) {
      return (fn || '').toString().indexOf(hint) > -1;
    });
  };

  var isBrowser = typeof window !== 'undefined';
  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
  var timeoutDuration = 0;
  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      timeoutDuration = 1;
      break;
    }
  }

  function microtaskDebounce(fn) {
    var scheduled = false;
    var i = 0;
    var elem = document.createElement('span');

    // MutationObserver provides a mechanism for scheduling microtasks, which
    // are scheduled *before* the next task. This gives us a way to debounce
    // a function but ensure it's called *before* the next paint.
    var observer = new MutationObserver(function () {
      fn();
      scheduled = false;
    });

    observer.observe(elem, { attributes: true });

    return function () {
      if (!scheduled) {
        scheduled = true;
        elem.setAttribute('x-index', i);
        i = i + 1; // don't use compund (+=) because it doesn't get optimized in V8
      }
    };
  }

  function taskDebounce(fn) {
    var scheduled = false;
    return function () {
      if (!scheduled) {
        scheduled = true;
        setTimeout(function () {
          scheduled = false;
          fn();
        }, timeoutDuration);
      }
    };
  }

  // It's common for MutationObserver polyfills to be seen in the wild, however
  // these rely on Mutation Events which only occur when an element is connected
  // to the DOM. The algorithm used in this module does not use a connected element,
  // and so we must ensure that a *native* MutationObserver is available.
  var supportsNativeMutationObserver = isBrowser && isNative(window.MutationObserver);

  /**
  * Create a debounced version of a method, that's asynchronously deferred
  * but called in the minimum time possible.
  *
  * @method
  * @memberof Popper.Utils
  * @argument {Function} fn
  * @returns {Function}
  */
  var debounce = supportsNativeMutationObserver ? microtaskDebounce : taskDebounce;

  /**
   * Check if the given variable is a function
   * @method
   * @memberof Popper.Utils
   * @argument {Any} functionToCheck - variable to check
   * @returns {Boolean} answer to: is a function?
   */
  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  /**
   * Get CSS computed property of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Eement} element
   * @argument {String} property
   */
  function getStyleComputedProperty(element, property) {
    if (element.nodeType !== 1) {
      return [];
    }
    // NOTE: 1 DOM access here
    var css = window.getComputedStyle(element, null);
    return property ? css[property] : css;
  }

  /**
   * Returns the parentNode or the host of the element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} parent
   */
  function getParentNode(element) {
    if (element.nodeName === 'HTML') {
      return element;
    }
    return element.parentNode || element.host;
  }

  /**
   * Returns the scrolling parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} scroll parent
   */
  function getScrollParent(element) {
    // Return body, `getScroll` will take care to get the correct `scrollTop` from it
    if (!element || ['HTML', 'BODY', '#document'].indexOf(element.nodeName) !== -1) {
      return window.document.body;
    }

    // Firefox want us to check `-x` and `-y` variations as well

    var _getStyleComputedProp = getStyleComputedProperty(element),
        overflow = _getStyleComputedProp.overflow,
        overflowX = _getStyleComputedProp.overflowX,
        overflowY = _getStyleComputedProp.overflowY;

    if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
      return element;
    }

    return getScrollParent(getParentNode(element));
  }

  /**
   * Returns the offset parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} offset parent
   */
  function getOffsetParent(element) {
    // NOTE: 1 DOM access here
    var offsetParent = element && element.offsetParent;
    var nodeName = offsetParent && offsetParent.nodeName;

    if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
      return window.document.documentElement;
    }

    // .offsetParent will return the closest TD or TABLE in case
    // no offsetParent is present, I hate this job...
    if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
      return getOffsetParent(offsetParent);
    }

    return offsetParent;
  }

  function isOffsetContainer(element) {
    var nodeName = element.nodeName;

    if (nodeName === 'BODY') {
      return false;
    }
    return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
  }

  /**
   * Finds the root node (document, shadowDOM root) of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} node
   * @returns {Element} root node
   */
  function getRoot(node) {
    if (node.parentNode !== null) {
      return getRoot(node.parentNode);
    }

    return node;
  }

  /**
   * Finds the offset parent common to the two provided nodes
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element1
   * @argument {Element} element2
   * @returns {Element} common offset parent
   */
  function findCommonOffsetParent(element1, element2) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
      return window.document.documentElement;
    }

    // Here we make sure to give as "start" the element that comes first in the DOM
    var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
    var start = order ? element1 : element2;
    var end = order ? element2 : element1;

    // Get common ancestor container
    var range = document.createRange();
    range.setStart(start, 0);
    range.setEnd(end, 0);
    var commonAncestorContainer = range.commonAncestorContainer;

    // Both nodes are inside #document

    if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
      if (isOffsetContainer(commonAncestorContainer)) {
        return commonAncestorContainer;
      }

      return getOffsetParent(commonAncestorContainer);
    }

    // one of the nodes is inside shadowDOM, find which one
    var element1root = getRoot(element1);
    if (element1root.host) {
      return findCommonOffsetParent(element1root.host, element2);
    } else {
      return findCommonOffsetParent(element1, getRoot(element2).host);
    }
  }

  /**
   * Gets the scroll value of the given element in the given side (top and left)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {String} side `top` or `left`
   * @returns {number} amount of scrolled pixels
   */
  function getScroll(element) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

    var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    var nodeName = element.nodeName;

    if (nodeName === 'BODY' || nodeName === 'HTML') {
      var html = window.document.documentElement;
      var scrollingElement = window.document.scrollingElement || html;
      return scrollingElement[upperSide];
    }

    return element[upperSide];
  }

  /*
   * Sum or subtract the element scroll values (left and top) from a given rect object
   * @method
   * @memberof Popper.Utils
   * @param {Object} rect - Rect object you want to change
   * @param {HTMLElement} element - The element from the function reads the scroll values
   * @param {Boolean} subtract - set to true if you want to subtract the scroll values
   * @return {Object} rect - The modifier rect object
   */
  function includeScroll(rect, element) {
    var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var scrollTop = getScroll(element, 'top');
    var scrollLeft = getScroll(element, 'left');
    var modifier = subtract ? -1 : 1;
    rect.top += scrollTop * modifier;
    rect.bottom += scrollTop * modifier;
    rect.left += scrollLeft * modifier;
    rect.right += scrollLeft * modifier;
    return rect;
  }

  /*
   * Helper to detect borders of a given element
   * @method
   * @memberof Popper.Utils
   * @param {CSSStyleDeclaration} styles
   * Result of `getStyleComputedProperty` on the given element
   * @param {String} axis - `x` or `y`
   * @return {number} borders - The borders size of the given axis
   */

  function getBordersSize(styles, axis) {
    var sideA = axis === 'x' ? 'Left' : 'Top';
    var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

    return +styles['border' + sideA + 'Width'].split('px')[0] + +styles['border' + sideB + 'Width'].split('px')[0];
  }

  /**
   * Tells if you are running Internet Explorer 10
   * @method
   * @memberof Popper.Utils
   * @returns {Boolean} isIE10
   */
  var isIE10 = undefined;

  var isIE10$1 = function isIE10$1() {
    if (isIE10 === undefined) {
      isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;
    }
    return isIE10;
  };

  function getSize(axis, body, html, computedStyle) {
    return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE10$1() ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
  }

  function getWindowSizes() {
    var body = window.document.body;
    var html = window.document.documentElement;
    var computedStyle = isIE10$1() && window.getComputedStyle(html);

    return {
      height: getSize('Height', body, html, computedStyle),
      width: getSize('Width', body, html, computedStyle)
    };
  }

  var classCallCheck = function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defineProperty = function defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  /**
   * Given element offsets, generate an output similar to getBoundingClientRect
   * @method
   * @memberof Popper.Utils
   * @argument {Object} offsets
   * @returns {Object} ClientRect like output
   */
  function getClientRect(offsets) {
    return _extends({}, offsets, {
      right: offsets.left + offsets.width,
      bottom: offsets.top + offsets.height
    });
  }

  /**
   * Get bounding client rect of given element
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} element
   * @return {Object} client rect
   */
  function getBoundingClientRect(element) {
    var rect = {};

    // IE10 10 FIX: Please, don't ask, the element isn't
    // considered in DOM in some circumstances...
    // This isn't reproducible in IE10 compatibility mode of IE11
    if (isIE10$1()) {
      try {
        rect = element.getBoundingClientRect();
        var scrollTop = getScroll(element, 'top');
        var scrollLeft = getScroll(element, 'left');
        rect.top += scrollTop;
        rect.left += scrollLeft;
        rect.bottom += scrollTop;
        rect.right += scrollLeft;
      } catch (err) {}
    } else {
      rect = element.getBoundingClientRect();
    }

    var result = {
      left: rect.left,
      top: rect.top,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };

    // subtract scrollbar size from sizes
    var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
    var width = sizes.width || element.clientWidth || result.right - result.left;
    var height = sizes.height || element.clientHeight || result.bottom - result.top;

    var horizScrollbar = element.offsetWidth - width;
    var vertScrollbar = element.offsetHeight - height;

    // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
    // we make this check conditional for performance reasons
    if (horizScrollbar || vertScrollbar) {
      var styles = getStyleComputedProperty(element);
      horizScrollbar -= getBordersSize(styles, 'x');
      vertScrollbar -= getBordersSize(styles, 'y');

      result.width -= horizScrollbar;
      result.height -= vertScrollbar;
    }

    return getClientRect(result);
  }

  function getOffsetRectRelativeToArbitraryNode(children, parent) {
    var isIE10 = isIE10$1();
    var isHTML = parent.nodeName === 'HTML';
    var childrenRect = getBoundingClientRect(children);
    var parentRect = getBoundingClientRect(parent);
    var scrollParent = getScrollParent(children);

    var styles = getStyleComputedProperty(parent);
    var borderTopWidth = +styles.borderTopWidth.split('px')[0];
    var borderLeftWidth = +styles.borderLeftWidth.split('px')[0];

    var offsets = getClientRect({
      top: childrenRect.top - parentRect.top - borderTopWidth,
      left: childrenRect.left - parentRect.left - borderLeftWidth,
      width: childrenRect.width,
      height: childrenRect.height
    });
    offsets.marginTop = 0;
    offsets.marginLeft = 0;

    // Subtract margins of documentElement in case it's being used as parent
    // we do this only on HTML because it's the only element that behaves
    // differently when margins are applied to it. The margins are included in
    // the box of the documentElement, in the other cases not.
    if (!isIE10 && isHTML) {
      var marginTop = +styles.marginTop.split('px')[0];
      var marginLeft = +styles.marginLeft.split('px')[0];

      offsets.top -= borderTopWidth - marginTop;
      offsets.bottom -= borderTopWidth - marginTop;
      offsets.left -= borderLeftWidth - marginLeft;
      offsets.right -= borderLeftWidth - marginLeft;

      // Attach marginTop and marginLeft because in some circumstances we may need them
      offsets.marginTop = marginTop;
      offsets.marginLeft = marginLeft;
    }

    if (isIE10 ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
      offsets = includeScroll(offsets, parent);
    }

    return offsets;
  }

  function getViewportOffsetRectRelativeToArtbitraryNode(element) {
    var html = window.document.documentElement;
    var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
    var width = Math.max(html.clientWidth, window.innerWidth || 0);
    var height = Math.max(html.clientHeight, window.innerHeight || 0);

    var scrollTop = getScroll(html);
    var scrollLeft = getScroll(html, 'left');

    var offset = {
      top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
      left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
      width: width,
      height: height
    };

    return getClientRect(offset);
  }

  /**
   * Check if the given element is fixed or is inside a fixed parent
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {Element} customContainer
   * @returns {Boolean} answer to "isFixed?"
   */
  function isFixed(element) {
    var nodeName = element.nodeName;
    if (nodeName === 'BODY' || nodeName === 'HTML') {
      return false;
    }
    if (getStyleComputedProperty(element, 'position') === 'fixed') {
      return true;
    }
    return isFixed(getParentNode(element));
  }

  /**
   * Computed the boundaries limits and return them
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} popper
   * @param {HTMLElement} reference
   * @param {number} padding
   * @param {HTMLElement} boundariesElement - Element used to define the boundaries
   * @returns {Object} Coordinates of the boundaries
   */
  function getBoundaries(popper, reference, padding, boundariesElement) {
    // NOTE: 1 DOM access here
    var boundaries = { top: 0, left: 0 };
    var offsetParent = findCommonOffsetParent(popper, reference);

    // Handle viewport case
    if (boundariesElement === 'viewport') {
      boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent);
    } else {
      // Handle other cases based on DOM element used as boundaries
      var boundariesNode = void 0;
      if (boundariesElement === 'scrollParent') {
        boundariesNode = getScrollParent(getParentNode(popper));
        if (boundariesNode.nodeName === 'BODY') {
          boundariesNode = window.document.documentElement;
        }
      } else if (boundariesElement === 'window') {
        boundariesNode = window.document.documentElement;
      } else {
        boundariesNode = boundariesElement;
      }

      var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent);

      // In case of HTML, we need a different computation
      if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
        var _getWindowSizes = getWindowSizes(),
            height = _getWindowSizes.height,
            width = _getWindowSizes.width;

        boundaries.top += offsets.top - offsets.marginTop;
        boundaries.bottom = height + offsets.top;
        boundaries.left += offsets.left - offsets.marginLeft;
        boundaries.right = width + offsets.left;
      } else {
        // for all the other DOM elements, this one is good
        boundaries = offsets;
      }
    }

    // Add paddings
    boundaries.left += padding;
    boundaries.top += padding;
    boundaries.right -= padding;
    boundaries.bottom -= padding;

    return boundaries;
  }

  function getArea(_ref) {
    var width = _ref.width,
        height = _ref.height;

    return width * height;
  }

  /**
   * Utility used to transform the `auto` placement to the placement with more
   * available space.
   * @method
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
    var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    if (placement.indexOf('auto') === -1) {
      return placement;
    }

    var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

    var rects = {
      top: {
        width: boundaries.width,
        height: refRect.top - boundaries.top
      },
      right: {
        width: boundaries.right - refRect.right,
        height: boundaries.height
      },
      bottom: {
        width: boundaries.width,
        height: boundaries.bottom - refRect.bottom
      },
      left: {
        width: refRect.left - boundaries.left,
        height: boundaries.height
      }
    };

    var sortedAreas = Object.keys(rects).map(function (key) {
      return _extends({
        key: key
      }, rects[key], {
        area: getArea(rects[key])
      });
    }).sort(function (a, b) {
      return b.area - a.area;
    });

    var filteredAreas = sortedAreas.filter(function (_ref2) {
      var width = _ref2.width,
          height = _ref2.height;
      return width >= popper.clientWidth && height >= popper.clientHeight;
    });

    var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

    var variation = placement.split('-')[1];

    return computedPlacement + (variation ? '-' + variation : '');
  }

  /**
   * Get offsets to the reference element
   * @method
   * @memberof Popper.Utils
   * @param {Object} state
   * @param {Element} popper - the popper element
   * @param {Element} reference - the reference element (the popper will be relative to this)
   * @returns {Object} An object containing the offsets which will be applied to the popper
   */
  function getReferenceOffsets(state, popper, reference) {
    var commonOffsetParent = findCommonOffsetParent(popper, reference);
    return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent);
  }

  /**
   * Get the outer sizes of the given element (offset size + margins)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Object} object containing width and height properties
   */
  function getOuterSizes(element) {
    var styles = window.getComputedStyle(element);
    var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    var result = {
      width: element.offsetWidth + y,
      height: element.offsetHeight + x
    };
    return result;
  }

  /**
   * Get the opposite placement of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement
   * @returns {String} flipped placement
   */
  function getOppositePlacement(placement) {
    var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash[matched];
    });
  }

  /**
   * Get offsets to the popper
   * @method
   * @memberof Popper.Utils
   * @param {Object} position - CSS position the Popper will get applied
   * @param {HTMLElement} popper - the popper element
   * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
   * @param {String} placement - one of the valid placement options
   * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
   */
  function getPopperOffsets(popper, referenceOffsets, placement) {
    placement = placement.split('-')[0];

    // Get popper node sizes
    var popperRect = getOuterSizes(popper);

    // Add position, width and height to our offsets object
    var popperOffsets = {
      width: popperRect.width,
      height: popperRect.height
    };

    // depending by the popper placement we have to compute its offsets slightly differently
    var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    var mainSide = isHoriz ? 'top' : 'left';
    var secondarySide = isHoriz ? 'left' : 'top';
    var measurement = isHoriz ? 'height' : 'width';
    var secondaryMeasurement = !isHoriz ? 'height' : 'width';

    popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
    if (placement === secondarySide) {
      popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
    } else {
      popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
    }

    return popperOffsets;
  }

  /**
   * Mimics the `find` method of Array
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function find$1(arr, check) {
    // use native find if supported
    if (Array.prototype.find) {
      return arr.find(check);
    }

    // use `filter` to obtain the same behavior of `find`
    return arr.filter(check)[0];
  }

  /**
   * Return the index of the matching object
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function findIndex$1(arr, prop, value) {
    // use native findIndex if supported
    if (Array.prototype.findIndex) {
      return arr.findIndex(function (cur) {
        return cur[prop] === value;
      });
    }

    // use `find` + `indexOf` if `findIndex` isn't supported
    var match = find$1(arr, function (obj) {
      return obj[prop] === value;
    });
    return arr.indexOf(match);
  }

  /**
   * Loop trough the list of modifiers and run them in order,
   * each of them will then edit the data object.
   * @method
   * @memberof Popper.Utils
   * @param {dataObject} data
   * @param {Array} modifiers
   * @param {String} ends - Optional modifier name used as stopper
   * @returns {dataObject}
   */
  function runModifiers(modifiers, data, ends) {
    var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex$1(modifiers, 'name', ends));

    modifiersToRun.forEach(function (modifier) {
      if (modifier.function) {
        console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
      }
      var fn = modifier.function || modifier.fn;
      if (modifier.enabled && isFunction(fn)) {
        // Add properties to offsets to make them a complete clientRect object
        // we do this before each modifier to make sure the previous one doesn't
        // mess with these values
        data.offsets.popper = getClientRect(data.offsets.popper);
        data.offsets.reference = getClientRect(data.offsets.reference);

        data = fn(data, modifier);
      }
    });

    return data;
  }

  /**
   * Updates the position of the popper, computing the new offsets and applying
   * the new style.<br />
   * Prefer `scheduleUpdate` over `update` because of performance reasons.
   * @method
   * @memberof Popper
   */
  function update() {
    // if popper is destroyed, don't perform any further update
    if (this.state.isDestroyed) {
      return;
    }

    var data = {
      instance: this,
      styles: {},
      arrowStyles: {},
      attributes: {},
      flipped: false,
      offsets: {}
    };

    // compute reference element offsets
    data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

    // store the computed placement inside `originalPlacement`
    data.originalPlacement = data.placement;

    // compute the popper offsets
    data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
    data.offsets.popper.position = 'absolute';

    // run the modifiers
    data = runModifiers(this.modifiers, data);

    // the first `update` will call `onCreate` callback
    // the other ones will call `onUpdate` callback
    if (!this.state.isCreated) {
      this.state.isCreated = true;
      this.options.onCreate(data);
    } else {
      this.options.onUpdate(data);
    }
  }

  /**
   * Helper used to know if the given modifier is enabled.
   * @method
   * @memberof Popper.Utils
   * @returns {Boolean}
   */
  function isModifierEnabled(modifiers, modifierName) {
    return modifiers.some(function (_ref) {
      var name = _ref.name,
          enabled = _ref.enabled;
      return enabled && name === modifierName;
    });
  }

  /**
   * Get the prefixed supported property name
   * @method
   * @memberof Popper.Utils
   * @argument {String} property (camelCase)
   * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
   */
  function getSupportedPropertyName(property) {
    var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
    var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (var i = 0; i < prefixes.length - 1; i++) {
      var prefix = prefixes[i];
      var toCheck = prefix ? '' + prefix + upperProp : property;
      if (typeof window.document.body.style[toCheck] !== 'undefined') {
        return toCheck;
      }
    }
    return null;
  }

  /**
   * Destroy the popper
   * @method
   * @memberof Popper
   */
  function destroy() {
    this.state.isDestroyed = true;

    // touch DOM only if `applyStyle` modifier is enabled
    if (isModifierEnabled(this.modifiers, 'applyStyle')) {
      this.popper.removeAttribute('x-placement');
      this.popper.style.left = '';
      this.popper.style.position = '';
      this.popper.style.top = '';
      this.popper.style[getSupportedPropertyName('transform')] = '';
    }

    this.disableEventListeners();

    // remove the popper if user explicity asked for the deletion on destroy
    // do not use `remove` because IE11 doesn't support it
    if (this.options.removeOnDestroy) {
      this.popper.parentNode.removeChild(this.popper);
    }
    return this;
  }

  function attachToScrollParents(scrollParent, event, callback, scrollParents) {
    var isBody = scrollParent.nodeName === 'BODY';
    var target = isBody ? window : scrollParent;
    target.addEventListener(event, callback, { passive: true });

    if (!isBody) {
      attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
    }
    scrollParents.push(target);
  }

  /**
   * Setup needed event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function setupEventListeners(reference, options, state, updateBound) {
    // Resize event listener on window
    state.updateBound = updateBound;
    window.addEventListener('resize', state.updateBound, { passive: true });

    // Scroll event listener on scroll parents
    var scrollElement = getScrollParent(reference);
    attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
    state.scrollElement = scrollElement;
    state.eventsEnabled = true;

    return state;
  }

  /**
   * It will add resize/scroll events and start recalculating
   * position of the popper element when they are triggered.
   * @method
   * @memberof Popper
   */
  function enableEventListeners() {
    if (!this.state.eventsEnabled) {
      this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
    }
  }

  /**
   * Remove event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function removeEventListeners(reference, state) {
    // Remove resize event listener on window
    window.removeEventListener('resize', state.updateBound);

    // Remove scroll event listener on scroll parents
    state.scrollParents.forEach(function (target) {
      target.removeEventListener('scroll', state.updateBound);
    });

    // Reset state
    state.updateBound = null;
    state.scrollParents = [];
    state.scrollElement = null;
    state.eventsEnabled = false;
    return state;
  }

  /**
   * It will remove resize/scroll events and won't recalculate popper position
   * when they are triggered. It also won't trigger onUpdate callback anymore,
   * unless you call `update` method manually.
   * @method
   * @memberof Popper
   */
  function disableEventListeners() {
    if (this.state.eventsEnabled) {
      window.cancelAnimationFrame(this.scheduleUpdate);
      this.state = removeEventListeners(this.reference, this.state);
    }
  }

  /**
   * Tells if a given input is a number
   * @method
   * @memberof Popper.Utils
   * @param {*} input to check
   * @return {Boolean}
   */
  function isNumeric(n) {
    return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * Set the style to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the style to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setStyles(element, styles) {
    Object.keys(styles).forEach(function (prop) {
      var unit = '';
      // add unit if the value is numeric and is one of the following
      if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
        unit = 'px';
      }
      element.style[prop] = styles[prop] + unit;
    });
  }

  /**
   * Set the attributes to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the attributes to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(function (prop) {
      var value = attributes[prop];
      if (value !== false) {
        element.setAttribute(prop, attributes[prop]);
      } else {
        element.removeAttribute(prop);
      }
    });
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} data.styles - List of style properties - values to apply to popper element
   * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The same data object
   */
  function applyStyle(data) {
    // any property present in `data.styles` will be applied to the popper,
    // in this way we can make the 3rd party modifiers add custom styles to it
    // Be aware, modifiers could override the properties defined in the previous
    // lines of this modifier!
    setStyles(data.instance.popper, data.styles);

    // any property present in `data.attributes` will be applied to the popper,
    // they will be set as HTML attributes of the element
    setAttributes(data.instance.popper, data.attributes);

    // if arrowElement is defined and arrowStyles has some properties
    if (data.arrowElement && Object.keys(data.arrowStyles).length) {
      setStyles(data.arrowElement, data.arrowStyles);
    }

    return data;
  }

  /**
   * Set the x-placement attribute before everything else because it could be used
   * to add margins to the popper margins needs to be calculated to get the
   * correct popper offsets.
   * @method
   * @memberof Popper.modifiers
   * @param {HTMLElement} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper.
   * @param {Object} options - Popper.js options
   */
  function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
    // compute reference element offsets
    var referenceOffsets = getReferenceOffsets(state, popper, reference);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

    popper.setAttribute('x-placement', placement);

    // Apply `position` to popper before anything else because
    // without the position applied we can't guarantee correct computations
    setStyles(popper, { position: 'absolute' });

    return options;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeStyle(data, options) {
    var x = options.x,
        y = options.y;
    var popper = data.offsets.popper;

    // Remove this legacy support in Popper.js v2

    var legacyGpuAccelerationOption = find$1(data.instance.modifiers, function (modifier) {
      return modifier.name === 'applyStyle';
    }).gpuAcceleration;
    if (legacyGpuAccelerationOption !== undefined) {
      console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
    }
    var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

    var offsetParent = getOffsetParent(data.instance.popper);
    var offsetParentRect = getBoundingClientRect(offsetParent);

    // Styles
    var styles = {
      position: popper.position
    };

    // floor sides to avoid blurry text
    var offsets = {
      left: Math.floor(popper.left),
      top: Math.floor(popper.top),
      bottom: Math.floor(popper.bottom),
      right: Math.floor(popper.right)
    };

    var sideA = x === 'bottom' ? 'top' : 'bottom';
    var sideB = y === 'right' ? 'left' : 'right';

    // if gpuAcceleration is set to `true` and transform is supported,
    //  we use `translate3d` to apply the position to the popper we
    // automatically use the supported prefixed version if needed
    var prefixedProperty = getSupportedPropertyName('transform');

    // now, let's make a step back and look at this code closely (wtf?)
    // If the content of the popper grows once it's been positioned, it
    // may happen that the popper gets misplaced because of the new content
    // overflowing its reference element
    // To avoid this problem, we provide two options (x and y), which allow
    // the consumer to define the offset origin.
    // If we position a popper on top of a reference element, we can set
    // `x` to `top` to make the popper grow towards its top instead of
    // its bottom.
    var left = void 0,
        top = void 0;
    if (sideA === 'bottom') {
      top = -offsetParentRect.height + offsets.bottom;
    } else {
      top = offsets.top;
    }
    if (sideB === 'right') {
      left = -offsetParentRect.width + offsets.right;
    } else {
      left = offsets.left;
    }
    if (gpuAcceleration && prefixedProperty) {
      styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
      styles[sideA] = 0;
      styles[sideB] = 0;
      styles.willChange = 'transform';
    } else {
      // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
      var invertTop = sideA === 'bottom' ? -1 : 1;
      var invertLeft = sideB === 'right' ? -1 : 1;
      styles[sideA] = top * invertTop;
      styles[sideB] = left * invertLeft;
      styles.willChange = sideA + ', ' + sideB;
    }

    // Attributes
    var attributes = {
      'x-placement': data.placement
    };

    // Update `data` attributes, styles and arrowStyles
    data.attributes = _extends({}, attributes, data.attributes);
    data.styles = _extends({}, styles, data.styles);
    data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

    return data;
  }

  /**
   * Helper used to know if the given modifier depends from another one.<br />
   * It checks if the needed modifier is listed and enabled.
   * @method
   * @memberof Popper.Utils
   * @param {Array} modifiers - list of modifiers
   * @param {String} requestingName - name of requesting modifier
   * @param {String} requestedName - name of requested modifier
   * @returns {Boolean}
   */
  function isModifierRequired(modifiers, requestingName, requestedName) {
    var requesting = find$1(modifiers, function (_ref) {
      var name = _ref.name;
      return name === requestingName;
    });

    var isRequired = !!requesting && modifiers.some(function (modifier) {
      return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
    });

    if (!isRequired) {
      var _requesting = '`' + requestingName + '`';
      var requested = '`' + requestedName + '`';
      console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
    }
    return isRequired;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function arrow(data, options) {
    // arrow depends on keepTogether in order to work
    if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
      return data;
    }

    var arrowElement = options.element;

    // if arrowElement is a string, suppose it's a CSS selector
    if (typeof arrowElement === 'string') {
      arrowElement = data.instance.popper.querySelector(arrowElement);

      // if arrowElement is not found, don't run the modifier
      if (!arrowElement) {
        return data;
      }
    } else {
      // if the arrowElement isn't a query selector we must check that the
      // provided DOM node is child of its popper node
      if (!data.instance.popper.contains(arrowElement)) {
        console.warn('WARNING: `arrow.element` must be child of its popper element!');
        return data;
      }
    }

    var placement = data.placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var isVertical = ['left', 'right'].indexOf(placement) !== -1;

    var len = isVertical ? 'height' : 'width';
    var sideCapitalized = isVertical ? 'Top' : 'Left';
    var side = sideCapitalized.toLowerCase();
    var altSide = isVertical ? 'left' : 'top';
    var opSide = isVertical ? 'bottom' : 'right';
    var arrowElementSize = getOuterSizes(arrowElement)[len];

    //
    // extends keepTogether behavior making sure the popper and its
    // reference have enough pixels in conjuction
    //

    // top/left side
    if (reference[opSide] - arrowElementSize < popper[side]) {
      data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
    }
    // bottom/right side
    if (reference[side] + arrowElementSize > popper[opSide]) {
      data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
    }

    // compute center of the popper
    var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

    // Compute the sideValue using the updated popper offsets
    // take popper margin in account because we don't have this info available
    var popperMarginSide = getStyleComputedProperty(data.instance.popper, 'margin' + sideCapitalized).replace('px', '');
    var sideValue = center - getClientRect(data.offsets.popper)[side] - popperMarginSide;

    // prevent arrowElement from being placed not contiguously to its popper
    sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

    data.arrowElement = arrowElement;
    data.offsets.arrow = {};
    data.offsets.arrow[side] = Math.round(sideValue);
    data.offsets.arrow[altSide] = ''; // make sure to unset any eventual altSide value from the DOM node

    return data;
  }

  /**
   * Get the opposite placement variation of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement variation
   * @returns {String} flipped placement variation
   */
  function getOppositeVariation(variation) {
    if (variation === 'end') {
      return 'start';
    } else if (variation === 'start') {
      return 'end';
    }
    return variation;
  }

  /**
   * List of accepted placements to use as values of the `placement` option.<br />
   * Valid placements are:
   * - `auto`
   * - `top`
   * - `right`
   * - `bottom`
   * - `left`
   *
   * Each placement can have a variation from this list:
   * - `-start`
   * - `-end`
   *
   * Variations are interpreted easily if you think of them as the left to right
   * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
   * is right.<br />
   * Vertically (`left` and `right`), `start` is top and `end` is bottom.
   *
   * Some valid examples are:
   * - `top-end` (on top of reference, right aligned)
   * - `right-start` (on right of reference, top aligned)
   * - `bottom` (on bottom, centered)
   * - `auto-right` (on the side with more space available, alignment depends by placement)
   *
   * @static
   * @type {Array}
   * @enum {String}
   * @readonly
   * @method placements
   * @memberof Popper
   */
  var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

  // Get rid of `auto` `auto-start` and `auto-end`
  var validPlacements = placements.slice(3);

  /**
   * Given an initial placement, returns all the subsequent placements
   * clockwise (or counter-clockwise).
   *
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement - A valid placement (it accepts variations)
   * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
   * @returns {Array} placements including their variations
   */
  function clockwise(placement) {
    var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var index = validPlacements.indexOf(placement);
    var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
    return counter ? arr.reverse() : arr;
  }

  var BEHAVIORS = {
    FLIP: 'flip',
    CLOCKWISE: 'clockwise',
    COUNTERCLOCKWISE: 'counterclockwise'
  };

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function flip(data, options) {
    // if `inner` modifier is enabled, we can't use the `flip` modifier
    if (isModifierEnabled(data.instance.modifiers, 'inner')) {
      return data;
    }

    if (data.flipped && data.placement === data.originalPlacement) {
      // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
      return data;
    }

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement);

    var placement = data.placement.split('-')[0];
    var placementOpposite = getOppositePlacement(placement);
    var variation = data.placement.split('-')[1] || '';

    var flipOrder = [];

    switch (options.behavior) {
      case BEHAVIORS.FLIP:
        flipOrder = [placement, placementOpposite];
        break;
      case BEHAVIORS.CLOCKWISE:
        flipOrder = clockwise(placement);
        break;
      case BEHAVIORS.COUNTERCLOCKWISE:
        flipOrder = clockwise(placement, true);
        break;
      default:
        flipOrder = options.behavior;
    }

    flipOrder.forEach(function (step, index) {
      if (placement !== step || flipOrder.length === index + 1) {
        return data;
      }

      placement = data.placement.split('-')[0];
      placementOpposite = getOppositePlacement(placement);

      var popperOffsets = data.offsets.popper;
      var refOffsets = data.offsets.reference;

      // using floor because the reference offsets may contain decimals we are not going to consider here
      var floor = Math.floor;
      var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

      var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
      var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
      var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
      var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

      var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

      // flip the variation if required
      var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
      var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

      if (overlapsRef || overflowsBoundaries || flippedVariation) {
        // this boolean to detect any flip loop
        data.flipped = true;

        if (overlapsRef || overflowsBoundaries) {
          placement = flipOrder[index + 1];
        }

        if (flippedVariation) {
          variation = getOppositeVariation(variation);
        }

        data.placement = placement + (variation ? '-' + variation : '');

        // this object contains `position`, we want to preserve it along with
        // any additional property we may add in the future
        data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

        data = runModifiers(data.instance.modifiers, data, 'flip');
      }
    });
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function keepTogether(data) {
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var placement = data.placement.split('-')[0];
    var floor = Math.floor;
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var side = isVertical ? 'right' : 'bottom';
    var opSide = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    if (popper[side] < floor(reference[opSide])) {
      data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
    }
    if (popper[opSide] > floor(reference[side])) {
      data.offsets.popper[opSide] = floor(reference[side]);
    }

    return data;
  }

  /**
   * Converts a string containing value + unit into a px value number
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} str - Value + unit string
   * @argument {String} measurement - `height` or `width`
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @returns {Number|String}
   * Value in pixels, or original string if no values were extracted
   */
  function toValue(str, measurement, popperOffsets, referenceOffsets) {
    // separate value from unit
    var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
    var value = +split[1];
    var unit = split[2];

    // If it's not a number it's an operator, I guess
    if (!value) {
      return str;
    }

    if (unit.indexOf('%') === 0) {
      var element = void 0;
      switch (unit) {
        case '%p':
          element = popperOffsets;
          break;
        case '%':
        case '%r':
        default:
          element = referenceOffsets;
      }

      var rect = getClientRect(element);
      return rect[measurement] / 100 * value;
    } else if (unit === 'vh' || unit === 'vw') {
      // if is a vh or vw, we calculate the size based on the viewport
      var size = void 0;
      if (unit === 'vh') {
        size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      } else {
        size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      }
      return size / 100 * value;
    } else {
      // if is an explicit pixel unit, we get rid of the unit and keep the value
      // if is an implicit unit, it's px, and we return just the value
      return value;
    }
  }

  /**
   * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} offset
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @argument {String} basePlacement
   * @returns {Array} a two cells array with x and y offsets in numbers
   */
  function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
    var offsets = [0, 0];

    // Use height if placement is left or right and index is 0 otherwise use width
    // in this way the first offset will use an axis and the second one
    // will use the other one
    var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

    // Split the offset string to obtain a list of values and operands
    // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
    var fragments = offset.split(/(\+|\-)/).map(function (frag) {
      return frag.trim();
    });

    // Detect if the offset string contains a pair of values or a single one
    // they could be separated by comma or space
    var divider = fragments.indexOf(find$1(fragments, function (frag) {
      return frag.search(/,|\s/) !== -1;
    }));

    if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
      console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
    }

    // If divider is found, we divide the list of values and operands to divide
    // them by ofset X and Y.
    var splitRegex = /\s*,\s*|\s+/;
    var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

    // Convert the values with units to absolute pixels to allow our computations
    ops = ops.map(function (op, index) {
      // Most of the units rely on the orientation of the popper
      var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
      var mergeWithPrevious = false;
      return op
      // This aggregates any `+` or `-` sign that aren't considered operators
      // e.g.: 10 + +5 => [10, +, +5]
      .reduce(function (a, b) {
        if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
          a[a.length - 1] = b;
          mergeWithPrevious = true;
          return a;
        } else if (mergeWithPrevious) {
          a[a.length - 1] += b;
          mergeWithPrevious = false;
          return a;
        } else {
          return a.concat(b);
        }
      }, [])
      // Here we convert the string values into number values (in px)
      .map(function (str) {
        return toValue(str, measurement, popperOffsets, referenceOffsets);
      });
    });

    // Loop trough the offsets arrays and execute the operations
    ops.forEach(function (op, index) {
      op.forEach(function (frag, index2) {
        if (isNumeric(frag)) {
          offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
        }
      });
    });
    return offsets;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @argument {Number|String} options.offset=0
   * The offset value as described in the modifier description
   * @returns {Object} The data object, properly modified
   */
  function offset(data, _ref) {
    var offset = _ref.offset;
    var placement = data.placement,
        _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var basePlacement = placement.split('-')[0];

    var offsets = void 0;
    if (isNumeric(+offset)) {
      offsets = [+offset, 0];
    } else {
      offsets = parseOffset(offset, popper, reference, basePlacement);
    }

    if (basePlacement === 'left') {
      popper.top += offsets[0];
      popper.left -= offsets[1];
    } else if (basePlacement === 'right') {
      popper.top += offsets[0];
      popper.left += offsets[1];
    } else if (basePlacement === 'top') {
      popper.left += offsets[0];
      popper.top -= offsets[1];
    } else if (basePlacement === 'bottom') {
      popper.left += offsets[0];
      popper.top += offsets[1];
    }

    data.popper = popper;
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function preventOverflow(data, options) {
    var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

    // If offsetParent is the reference element, we really want to
    // go one step up and use the next offsetParent as reference to
    // avoid to make this modifier completely useless and look like broken
    if (data.instance.reference === boundariesElement) {
      boundariesElement = getOffsetParent(boundariesElement);
    }

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement);
    options.boundaries = boundaries;

    var order = options.priority;
    var popper = data.offsets.popper;

    var check = {
      primary: function primary(placement) {
        var value = popper[placement];
        if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
          value = Math.max(popper[placement], boundaries[placement]);
        }
        return defineProperty({}, placement, value);
      },
      secondary: function secondary(placement) {
        var mainSide = placement === 'right' ? 'left' : 'top';
        var value = popper[mainSide];
        if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
          value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
        }
        return defineProperty({}, mainSide, value);
      }
    };

    order.forEach(function (placement) {
      var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
      popper = _extends({}, popper, check[side](placement));
    });

    data.offsets.popper = popper;

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function shift(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var shiftvariation = placement.split('-')[1];

    // if shift shiftvariation is specified, run the modifier
    if (shiftvariation) {
      var _data$offsets = data.offsets,
          reference = _data$offsets.reference,
          popper = _data$offsets.popper;

      var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
      var side = isVertical ? 'left' : 'top';
      var measurement = isVertical ? 'width' : 'height';

      var shiftOffsets = {
        start: defineProperty({}, side, reference[side]),
        end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
      };

      data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function hide(data) {
    if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
      return data;
    }

    var refRect = data.offsets.reference;
    var bound = find$1(data.instance.modifiers, function (modifier) {
      return modifier.name === 'preventOverflow';
    }).boundaries;

    if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === true) {
        return data;
      }

      data.hide = true;
      data.attributes['x-out-of-boundaries'] = '';
    } else {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === false) {
        return data;
      }

      data.hide = false;
      data.attributes['x-out-of-boundaries'] = false;
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function inner(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

    var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

    popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

    data.placement = getOppositePlacement(placement);
    data.offsets.popper = getClientRect(popper);

    return data;
  }

  /**
   * Modifier function, each modifier can have a function of this type assigned
   * to its `fn` property.<br />
   * These functions will be called on each update, this means that you must
   * make sure they are performant enough to avoid performance bottlenecks.
   *
   * @function ModifierFn
   * @argument {dataObject} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {dataObject} The data object, properly modified
   */

  /**
   * Modifiers are plugins used to alter the behavior of your poppers.<br />
   * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
   * needed by the library.
   *
   * Usually you don't want to override the `order`, `fn` and `onLoad` props.
   * All the other properties are configurations that could be tweaked.
   * @namespace modifiers
   */
  var modifiers = {
    /**
     * Modifier used to shift the popper on the start or end of its reference
     * element.<br />
     * It will read the variation of the `placement` property.<br />
     * It can be one either `-end` or `-start`.
     * @memberof modifiers
     * @inner
     */
    shift: {
      /** @prop {number} order=100 - Index used to define the order of execution */
      order: 100,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: shift
    },

    /**
     * The `offset` modifier can shift your popper on both its axis.
     *
     * It accepts the following units:
     * - `px` or unitless, interpreted as pixels
     * - `%` or `%r`, percentage relative to the length of the reference element
     * - `%p`, percentage relative to the length of the popper element
     * - `vw`, CSS viewport width unit
     * - `vh`, CSS viewport height unit
     *
     * For length is intended the main axis relative to the placement of the popper.<br />
     * This means that if the placement is `top` or `bottom`, the length will be the
     * `width`. In case of `left` or `right`, it will be the height.
     *
     * You can provide a single value (as `Number` or `String`), or a pair of values
     * as `String` divided by a comma or one (or more) white spaces.<br />
     * The latter is a deprecated method because it leads to confusion and will be
     * removed in v2.<br />
     * Additionally, it accepts additions and subtractions between different units.
     * Note that multiplications and divisions aren't supported.
     *
     * Valid examples are:
     * ```
     * 10
     * '10%'
     * '10, 10'
     * '10%, 10'
     * '10 + 10%'
     * '10 - 5vh + 3%'
     * '-10px + 5vh, 5px - 6%'
     * ```
     * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
     * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
     * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
     *
     * @memberof modifiers
     * @inner
     */
    offset: {
      /** @prop {number} order=200 - Index used to define the order of execution */
      order: 200,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: offset,
      /** @prop {Number|String} offset=0
       * The offset value as described in the modifier description
       */
      offset: 0
    },

    /**
     * Modifier used to prevent the popper from being positioned outside the boundary.
     *
     * An scenario exists where the reference itself is not within the boundaries.<br />
     * We can say it has "escaped the boundaries" — or just "escaped".<br />
     * In this case we need to decide whether the popper should either:
     *
     * - detach from the reference and remain "trapped" in the boundaries, or
     * - if it should ignore the boundary and "escape with its reference"
     *
     * When `escapeWithReference` is set to`true` and reference is completely
     * outside its boundaries, the popper will overflow (or completely leave)
     * the boundaries in order to remain attached to the edge of the reference.
     *
     * @memberof modifiers
     * @inner
     */
    preventOverflow: {
      /** @prop {number} order=300 - Index used to define the order of execution */
      order: 300,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: preventOverflow,
      /**
       * @prop {Array} [priority=['left','right','top','bottom']]
       * Popper will try to prevent overflow following these priorities by default,
       * then, it could overflow on the left and on top of the `boundariesElement`
       */
      priority: ['left', 'right', 'top', 'bottom'],
      /**
       * @prop {number} padding=5
       * Amount of pixel used to define a minimum distance between the boundaries
       * and the popper this makes sure the popper has always a little padding
       * between the edges of its container
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='scrollParent'
       * Boundaries used by the modifier, can be `scrollParent`, `window`,
       * `viewport` or any DOM element.
       */
      boundariesElement: 'scrollParent'
    },

    /**
     * Modifier used to make sure the reference and its popper stay near eachothers
     * without leaving any gap between the two. Expecially useful when the arrow is
     * enabled and you want to assure it to point to its reference element.
     * It cares only about the first axis, you can still have poppers with margin
     * between the popper and its reference element.
     * @memberof modifiers
     * @inner
     */
    keepTogether: {
      /** @prop {number} order=400 - Index used to define the order of execution */
      order: 400,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: keepTogether
    },

    /**
     * This modifier is used to move the `arrowElement` of the popper to make
     * sure it is positioned between the reference element and its popper element.
     * It will read the outer size of the `arrowElement` node to detect how many
     * pixels of conjuction are needed.
     *
     * It has no effect if no `arrowElement` is provided.
     * @memberof modifiers
     * @inner
     */
    arrow: {
      /** @prop {number} order=500 - Index used to define the order of execution */
      order: 500,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: arrow,
      /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
      element: '[x-arrow]'
    },

    /**
     * Modifier used to flip the popper's placement when it starts to overlap its
     * reference element.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     *
     * **NOTE:** this modifier will interrupt the current update cycle and will
     * restart it if it detects the need to flip the placement.
     * @memberof modifiers
     * @inner
     */
    flip: {
      /** @prop {number} order=600 - Index used to define the order of execution */
      order: 600,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: flip,
      /**
       * @prop {String|Array} behavior='flip'
       * The behavior used to change the popper's placement. It can be one of
       * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
       * placements (with optional variations).
       */
      behavior: 'flip',
      /**
       * @prop {number} padding=5
       * The popper will flip if it hits the edges of the `boundariesElement`
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='viewport'
       * The element which will define the boundaries of the popper position,
       * the popper will never be placed outside of the defined boundaries
       * (except if keepTogether is enabled)
       */
      boundariesElement: 'viewport'
    },

    /**
     * Modifier used to make the popper flow toward the inner of the reference element.
     * By default, when this modifier is disabled, the popper will be placed outside
     * the reference element.
     * @memberof modifiers
     * @inner
     */
    inner: {
      /** @prop {number} order=700 - Index used to define the order of execution */
      order: 700,
      /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
      enabled: false,
      /** @prop {ModifierFn} */
      fn: inner
    },

    /**
     * Modifier used to hide the popper when its reference element is outside of the
     * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
     * be used to hide with a CSS selector the popper when its reference is
     * out of boundaries.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     * @memberof modifiers
     * @inner
     */
    hide: {
      /** @prop {number} order=800 - Index used to define the order of execution */
      order: 800,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: hide
    },

    /**
     * Computes the style that will be applied to the popper element to gets
     * properly positioned.
     *
     * Note that this modifier will not touch the DOM, it just prepares the styles
     * so that `applyStyle` modifier can apply it. This separation is useful
     * in case you need to replace `applyStyle` with a custom implementation.
     *
     * This modifier has `850` as `order` value to maintain backward compatibility
     * with previous versions of Popper.js. Expect the modifiers ordering method
     * to change in future major versions of the library.
     *
     * @memberof modifiers
     * @inner
     */
    computeStyle: {
      /** @prop {number} order=850 - Index used to define the order of execution */
      order: 850,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: computeStyle,
      /**
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3d transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties.
       */
      gpuAcceleration: true,
      /**
       * @prop {string} [x='bottom']
       * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
       * Change this if your popper should grow in a direction different from `bottom`
       */
      x: 'bottom',
      /**
       * @prop {string} [x='left']
       * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
       * Change this if your popper should grow in a direction different from `right`
       */
      y: 'right'
    },

    /**
     * Applies the computed styles to the popper element.
     *
     * All the DOM manipulations are limited to this modifier. This is useful in case
     * you want to integrate Popper.js inside a framework or view library and you
     * want to delegate all the DOM manipulations to it.
     *
     * Note that if you disable this modifier, you must make sure the popper element
     * has its position set to `absolute` before Popper.js can do its work!
     *
     * Just disable this modifier and define you own to achieve the desired effect.
     *
     * @memberof modifiers
     * @inner
     */
    applyStyle: {
      /** @prop {number} order=900 - Index used to define the order of execution */
      order: 900,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: applyStyle,
      /** @prop {Function} */
      onLoad: applyStyleOnLoad,
      /**
       * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3d transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties.
       */
      gpuAcceleration: undefined
    }
  };

  /**
   * The `dataObject` is an object containing all the informations used by Popper.js
   * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
   * @name dataObject
   * @property {Object} data.instance The Popper.js instance
   * @property {String} data.placement Placement applied to popper
   * @property {String} data.originalPlacement Placement originally defined on init
   * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
   * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
   * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
   * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.boundaries Offsets of the popper boundaries
   * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
   * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
   */

  /**
   * Default options provided to Popper.js constructor.<br />
   * These can be overriden using the `options` argument of Popper.js.<br />
   * To override an option, simply pass as 3rd argument an object with the same
   * structure of this object, example:
   * ```
   * new Popper(ref, pop, {
   *   modifiers: {
   *     preventOverflow: { enabled: false }
   *   }
   * })
   * ```
   * @type {Object}
   * @static
   * @memberof Popper
   */
  var Defaults$1 = {
    /**
     * Popper's placement
     * @prop {Popper.placements} placement='bottom'
     */
    placement: 'bottom',

    /**
     * Whether events (resize, scroll) are initially enabled
     * @prop {Boolean} eventsEnabled=true
     */
    eventsEnabled: true,

    /**
     * Set to true if you want to automatically remove the popper when
     * you call the `destroy` method.
     * @prop {Boolean} removeOnDestroy=false
     */
    removeOnDestroy: false,

    /**
     * Callback called when the popper is created.<br />
     * By default, is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onCreate}
     */
    onCreate: function onCreate() {},

    /**
     * Callback called when the popper is updated, this callback is not called
     * on the initialization/creation of the popper, but only on subsequent
     * updates.<br />
     * By default, is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onUpdate}
     */
    onUpdate: function onUpdate() {},

    /**
     * List of modifiers used to modify the offsets before they are applied to the popper.
     * They provide most of the functionalities of Popper.js
     * @prop {modifiers}
     */
    modifiers: modifiers
  };

  /**
   * @callback onCreate
   * @param {dataObject} data
   */

  /**
   * @callback onUpdate
   * @param {dataObject} data
   */

  // Utils
  // Methods
  var Popper = function () {
    /**
     * Create a new Popper.js instance
     * @class Popper
     * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
     * @param {HTMLElement} popper - The HTML element used as popper.
     * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
     * @return {Object} instance - The generated Popper.js instance
     */
    function Popper(reference, popper) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      classCallCheck(this, Popper);

      this.scheduleUpdate = function () {
        return requestAnimationFrame(_this.update);
      };

      // make update() debounced, so that it only runs at most once-per-tick
      this.update = debounce(this.update.bind(this));

      // with {} we create a new object with the options inside it
      this.options = _extends({}, Popper.Defaults, options);

      // init state
      this.state = {
        isDestroyed: false,
        isCreated: false,
        scrollParents: []
      };

      // get reference and popper elements (allow jQuery wrappers)
      this.reference = reference.jquery ? reference[0] : reference;
      this.popper = popper.jquery ? popper[0] : popper;

      // Deep merge modifiers options
      this.options.modifiers = {};
      Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
        _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
      });

      // Refactoring modifiers' list (Object => Array)
      this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
        return _extends({
          name: name
        }, _this.options.modifiers[name]);
      })
      // sort the modifiers by order
      .sort(function (a, b) {
        return a.order - b.order;
      });

      // modifiers have the ability to execute arbitrary code when Popper.js get inited
      // such code is executed in the same order of its modifier
      // they could add new properties to their options configuration
      // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
      this.modifiers.forEach(function (modifierOptions) {
        if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
          modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
        }
      });

      // fire the first update to position the popper in the right place
      this.update();

      var eventsEnabled = this.options.eventsEnabled;
      if (eventsEnabled) {
        // setup event listeners, they will take care of update the position in specific situations
        this.enableEventListeners();
      }

      this.state.eventsEnabled = eventsEnabled;
    }

    // We can't use class properties because they don't get listed in the
    // class prototype and break stuff like Sinon stubs


    createClass(Popper, [{
      key: 'update',
      value: function update$$1() {
        return update.call(this);
      }
    }, {
      key: 'destroy',
      value: function destroy$$1() {
        return destroy.call(this);
      }
    }, {
      key: 'enableEventListeners',
      value: function enableEventListeners$$1() {
        return enableEventListeners.call(this);
      }
    }, {
      key: 'disableEventListeners',
      value: function disableEventListeners$$1() {
        return disableEventListeners.call(this);
      }

      /**
       * Schedule an update, it will run on the next UI update available
       * @method scheduleUpdate
       * @memberof Popper
       */

      /**
       * Collection of utilities useful when writing custom modifiers.
       * Starting from version 1.7, this method is available only if you
       * include `popper-utils.js` before `popper.js`.
       *
       * **DEPRECATION**: This way to access PopperUtils is deprecated
       * and will be removed in v2! Use the PopperUtils module directly instead.
       * Due to the high instability of the methods contained in Utils, we can't
       * guarantee them to follow semver. Use them at your own risk!
       * @static
       * @private
       * @type {Object}
       * @deprecated since version 1.8
       * @member Utils
       * @memberof Popper
       */

    }]);
    return Popper;
  }();

  /**
   * The `referenceObject` is an object that provides an interface compatible with Popper.js
   * and lets you use it as replacement of a real DOM node.<br />
   * You can use this method to position a popper relatively to a set of coordinates
   * in case you don't have a DOM node to use as reference.
   *
   * ```
   * new Popper(referenceObject, popperNode);
   * ```
   *
   * NB: This feature isn't supported in Internet Explorer 10
   * @name referenceObject
   * @property {Function} data.getBoundingClientRect
   * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
   * @property {number} data.clientWidth
   * An ES6 getter that will return the width of the virtual reference element.
   * @property {number} data.clientHeight
   * An ES6 getter that will return the height of the virtual reference element.
   */

  Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
  Popper.placements = placements;
  Popper.Defaults = Defaults$1;

  /**
  * Returns the distance taking into account the default distance due to
  * the transform: translate setting in CSS
  * @param {Number} distance
  * @return {String}
  */
  function getOffsetDistanceInPx(distance) {
    return -(distance - Defaults.distance) + 'px';
  }

  var classCallCheck$1 = function classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass$1 = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  /**
  * Creates a new popper instance
  * @param {Object} data
  * @return {Object} - the popper instance
  */
  function createPopperInstance(data) {
    var el = data.el,
        popper = data.popper,
        _data$settings = data.settings,
        position = _data$settings.position,
        popperOptions = _data$settings.popperOptions,
        offset = _data$settings.offset,
        distance = _data$settings.distance,
        flipDuration = _data$settings.flipDuration,
        refObject = data.refObject;

    var _getInnerElements = getInnerElements(popper),
        tooltip = _getInnerElements.tooltip;

    var config = _extends$1({
      placement: position
    }, popperOptions || {}, {
      modifiers: _extends$1({}, popperOptions ? popperOptions.modifiers : {}, {
        flip: _extends$1({
          padding: distance + 5 /* 5px from viewport boundary */
        }, popperOptions && popperOptions.modifiers ? popperOptions.modifiers.flip : {}),
        offset: _extends$1({
          offset: offset
        }, popperOptions && popperOptions.modifiers ? popperOptions.modifiers.offset : {})
      }),
      onUpdate: function onUpdate() {
        var styles = tooltip.style;
        styles.top = '';
        styles.bottom = '';
        styles.left = '';
        styles.right = '';
        styles[getCorePlacement(popper.getAttribute('x-placement'))] = getOffsetDistanceInPx(distance);
      }
    });

    // Update the popper's position whenever its content changes
    // Not supported in IE10 unless polyfilled
    if (window.MutationObserver) {
      var styles = popper.style;

      var observer = new MutationObserver(function () {
        styles[prefix('transitionDuration')] = '0ms';
        data.popperInstance.update();
        defer(function () {
          styles[prefix('transitionDuration')] = flipDuration + 'ms';
        });
      });

      observer.observe(popper, {
        childList: true,
        subtree: true,
        characterData: true
      });

      data._mutationObserver = observer;
    }

    //Update Popper's reference object if one is provided
    if (refObject === null) {
      return new Popper(el, popper, config);
    } else {
      return new Popper(refObject, popper, config);
    }
  }

  /**
  * Appends the popper and creates a popper instance if one does not exist
  * Also updates its position if need be and enables event listeners
  * @param {Object} data -  the element/popper reference data
  */
  function mountPopper(data) {
    var el = data.el,
        popper = data.popper,
        _data$settings = data.settings,
        appendTo = _data$settings.appendTo,
        followCursor = _data$settings.followCursor;

    // Already on the DOM

    if (appendTo.contains(popper)) return;

    appendTo.appendChild(popper);

    if (!data.popperInstance) {
      data.popperInstance = createPopperInstance(data);
    } else {
      data.popperInstance.update();
      if (!followCursor || Browser.touch) {
        data.popperInstance.enableEventListeners();
      }
    }

    // Since touch is determined dynamically, followCursor is set on mount
    if (followCursor && !Browser.touch) {
      el.addEventListener('mousemove', followCursorHandler);
      data.popperInstance.disableEventListeners();
    }
  }

  /**
  * Updates a popper's position on each animation frame to make it stick to a moving element
  * @param {Object} refData
  */
  function makeSticky(refData) {
    var popper = refData.popper,
        popperInstance = refData.popperInstance,
        stickyDuration = refData.settings.stickyDuration;

    var applyTransitionDuration = function applyTransitionDuration() {
      return popper.style[prefix('transitionDuration')] = stickyDuration + 'ms';
    };

    var removeTransitionDuration = function removeTransitionDuration() {
      return popper.style[prefix('transitionDuration')] = '';
    };

    var updatePosition = function updatePosition() {
      popperInstance && popperInstance.scheduleUpdate();

      applyTransitionDuration();

      isVisible(popper) ? window.requestAnimationFrame(updatePosition) : removeTransitionDuration();
    };

    // Wait until Popper's position has been updated initially
    defer(updatePosition);
  }

  /**
  * Returns an object of settings to override global settings
  * @param {Element} el - the tooltipped element
  * @param {Object} instanceSettings
  * @return {Object} - individual settings
  */
  function getIndividualSettings(el, instanceSettings) {
    var settings = DefaultsKeys.reduce(function (acc, key) {
      var val = el.getAttribute('data-' + key.toLowerCase()) || instanceSettings[key];

      // Convert strings to booleans
      if (val === 'false') val = false;
      if (val === 'true') val = true;

      // Convert number strings to true numbers
      if (isFinite(val) && !isNaN(parseFloat(val))) {
        val = parseFloat(val);
      }

      // Convert array strings to actual arrays
      if (typeof val === 'string' && val.trim().charAt(0) === '[') {
        val = JSON.parse(val);
      }

      acc[key] = val;

      return acc;
    }, {});

    return _extends$1({}, instanceSettings, settings);
  }

  /**
  * Creates a popper element then returns it
  * @param {Number} id - the popper id
  * @param {String} title - the tooltip's `title` attribute
  * @param {Object} settings - individual settings
  * @return {Element} - the popper element
  */
  function createPopperElement(id, title, settings) {
    var position = settings.position,
        distance = settings.distance,
        arrow = settings.arrow,
        animateFill = settings.animateFill,
        inertia = settings.inertia,
        animation = settings.animation,
        arrowSize = settings.arrowSize,
        size = settings.size,
        theme = settings.theme,
        html = settings.html,
        zIndex = settings.zIndex,
        interactive = settings.interactive;

    var popper = document.createElement('div');
    popper.setAttribute('class', 'tippy-popper');
    popper.setAttribute('role', 'tooltip');
    popper.setAttribute('aria-hidden', 'true');
    popper.setAttribute('id', 'tippy-tooltip-' + id);
    popper.style.zIndex = zIndex;

    var tooltip = document.createElement('div');
    tooltip.setAttribute('class', 'tippy-tooltip tippy-tooltip--' + size + ' leave');
    tooltip.setAttribute('data-animation', animation);

    theme.split(' ').forEach(function (t) {
      tooltip.classList.add(t + '-theme');
    });

    if (arrow) {
      // Add an arrow
      var _arrow = document.createElement('div');
      _arrow.setAttribute('class', 'arrow-' + arrowSize);
      _arrow.setAttribute('x-arrow', '');
      tooltip.appendChild(_arrow);
    }

    if (animateFill) {
      // Create animateFill circle element for animation
      tooltip.setAttribute('data-animatefill', '');
      var circle = document.createElement('div');
      circle.setAttribute('class', 'leave');
      circle.setAttribute('x-circle', '');
      tooltip.appendChild(circle);
    }

    if (inertia) {
      // Change transition timing function cubic bezier
      tooltip.setAttribute('data-inertia', '');
    }

    if (interactive) {
      tooltip.setAttribute('data-interactive', '');
    }

    // Tooltip content (text or HTML)
    var content = document.createElement('div');
    content.setAttribute('class', 'tippy-tooltip-content');

    if (html) {
      var templateId = void 0;

      if (html instanceof Element) {
        content.appendChild(html);
        templateId = '#' + html.id || 'tippy-html-template';
      } else {
        content.innerHTML = document.getElementById(html.replace('#', '')).innerHTML;
        templateId = html;
      }

      popper.classList.add('html-template');
      interactive && popper.setAttribute('tabindex', '-1');
      tooltip.setAttribute('data-template-id', templateId);
    } else {
      content.innerHTML = title;
    }

    // Init distance. Further updates are made in the popper instance's `onUpdate()` method
    tooltip.style[getCorePlacement(position)] = getOffsetDistanceInPx(distance);

    tooltip.appendChild(content);
    popper.appendChild(tooltip);

    return popper;
  }

  /**
  * Creates a trigger
  * @param {Object} event - the custom event specified in the `trigger` setting
  * @param {Element} el - tooltipped element
  * @param {Object} handlers - the handlers for each listener
  * @param {Boolean} touchHold
  * @return {Array} - array of listener objects
  */
  function createTrigger(event, el, handlers, touchHold) {
    var listeners = [];

    if (event === 'manual') return listeners;

    // Enter
    el.addEventListener(event, handlers.handleTrigger);
    listeners.push({
      event: event,
      handler: handlers.handleTrigger
    });

    // Leave
    if (event === 'mouseenter') {
      if (Browser.SUPPORTS_TOUCH && touchHold) {
        el.addEventListener('touchstart', handlers.handleTrigger);
        listeners.push({
          event: 'touchstart',
          handler: handlers.handleTrigger
        });
        el.addEventListener('touchend', handlers.handleMouseleave);
        listeners.push({
          event: 'touchend',
          handler: handlers.handleMouseleave
        });
      }

      el.addEventListener('mouseleave', handlers.handleMouseleave);
      listeners.push({
        event: 'mouseleave',
        handler: handlers.handleMouseleave
      });
    }

    if (event === 'focus') {
      el.addEventListener('blur', handlers.handleBlur);
      listeners.push({
        event: 'blur',
        handler: handlers.handleBlur
      });
    }

    return listeners;
  }

  /**
  * Determines if the mouse's cursor is outside the interactive border
  * @param {MouseEvent} event
  * @param {Element} popper
  * @param {Object} settings
  * @return {Boolean}
  */
  function cursorIsOutsideInteractiveBorder(event, popper, settings) {
    if (!popper.getAttribute('x-placement')) return true;

    var x = event.clientX,
        y = event.clientY;
    var interactiveBorder = settings.interactiveBorder,
        distance = settings.distance;

    var rect = popper.getBoundingClientRect();
    var corePosition = getCorePlacement(popper.getAttribute('x-placement'));
    var borderWithDistance = interactiveBorder + distance;

    var exceeds = {
      top: rect.top - y > interactiveBorder,
      bottom: y - rect.bottom > interactiveBorder,
      left: rect.left - x > interactiveBorder,
      right: x - rect.right > interactiveBorder
    };

    switch (corePosition) {
      case 'top':
        exceeds.top = rect.top - y > borderWithDistance;
        break;
      case 'bottom':
        exceeds.bottom = y - rect.bottom > borderWithDistance;
        break;
      case 'left':
        exceeds.left = rect.left - x > borderWithDistance;
        break;
      case 'right':
        exceeds.right = x - rect.right > borderWithDistance;
        break;
    }

    return exceeds.top || exceeds.bottom || exceeds.left || exceeds.right;
  }

  /**
  * Returns relevant listener callbacks for each ref
  * @param {Element} el
  * @param {Element} popper
  * @param {Object} settings
  * @return {Object} - relevant listener handlers
  */
  function getEventListenerHandlers(el, popper, settings) {
    var _this = this;

    var position = settings.position,
        delay = settings.delay,
        duration = settings.duration,
        interactive = settings.interactive,
        interactiveBorder = settings.interactiveBorder,
        distance = settings.distance,
        hideOnClick = settings.hideOnClick,
        trigger = settings.trigger,
        touchHold = settings.touchHold,
        touchWait = settings.touchWait;

    var showDelay = void 0,
        hideDelay = void 0;

    var clearTimeouts = function clearTimeouts() {
      clearTimeout(showDelay);
      clearTimeout(hideDelay);
    };

    var _show = function _show() {
      clearTimeouts();

      // Not hidden. For clicking when it also has a `focus` event listener
      if (isVisible(popper)) return;

      var _delay = Array.isArray(delay) ? delay[0] : delay;

      if (delay) {
        showDelay = setTimeout(function () {
          return _this.show(popper);
        }, _delay);
      } else {
        _this.show(popper);
      }
    };

    var show = function show(event) {
      return _this.callbacks.wait ? _this.callbacks.wait.call(popper, _show, event) : _show();
    };

    var hide = function hide() {
      clearTimeouts();

      var _delay = Array.isArray(delay) ? delay[1] : delay;

      if (delay) {
        hideDelay = setTimeout(function () {
          return _this.hide(popper);
        }, _delay);
      } else {
        _this.hide(popper);
      }
    };

    var handleTrigger = function handleTrigger(event) {
      var mouseenterTouch = event.type === 'mouseenter' && Browser.SUPPORTS_TOUCH && Browser.touch;

      if (mouseenterTouch && touchHold) return;

      // Toggle show/hide when clicking click-triggered tooltips
      var isClick = event.type === 'click';
      var isNotPersistent = hideOnClick !== 'persistent';

      isClick && isVisible(popper) && isNotPersistent ? hide() : show(event);

      if (mouseenterTouch && Browser.iOS() && el.click) {
        el.click();
      }
    };

    var handleMouseleave = function handleMouseleave(event) {

      // Don't fire 'mouseleave', use the 'touchend'
      if (event.type === 'mouseleave' && Browser.SUPPORTS_TOUCH && Browser.touch && touchHold) {
        return;
      }

      if (interactive) {
        // Temporarily handle mousemove to check if the mouse left somewhere
        // other than its popper
        var handleMousemove = function handleMousemove(event) {

          var triggerHide = function triggerHide() {
            document.body.removeEventListener('mouseleave', hide);
            document.removeEventListener('mousemove', handleMousemove);
            hide();
          };

          var closestTooltippedEl = closest(event.target, Selectors.TOOLTIPPED_EL);

          var isOverPopper = closest(event.target, Selectors.POPPER) === popper;
          var isOverEl = closestTooltippedEl === el;
          var isClickTriggered = trigger.indexOf('click') !== -1;
          var isOverOtherTooltippedEl = closestTooltippedEl && closestTooltippedEl !== el;

          if (isOverOtherTooltippedEl) {
            return triggerHide();
          }

          if (isOverPopper || isOverEl || isClickTriggered) return;

          if (cursorIsOutsideInteractiveBorder(event, popper, settings)) {
            triggerHide();
          }
        };

        document.body.addEventListener('mouseleave', hide);
        document.addEventListener('mousemove', handleMousemove);

        return;
      }

      // If it's not interactive, just hide it
      hide();
    };

    var handleBlur = function handleBlur(event) {
      // Ignore blur on touch devices, if there is no `relatedTarget`, hide
      // If the related target is a popper, ignore
      if (!event.relatedTarget || Browser.touch) return;
      if (closest(event.relatedTarget, Selectors.POPPER)) return;

      hide();
    };

    return {
      handleTrigger: handleTrigger,
      handleMouseleave: handleMouseleave,
      handleBlur: handleBlur
    };
  }

  /**
  * Evaluates/modifies the settings object for appropriate behavior
  * @param {Object} settings
  * @return {Object} modified/evaluated settings
  */
  function evaluateSettings(settings) {
    // animateFill is disabled if an arrow is true
    if (settings.arrow) {
      settings.animateFill = false;
    }

    // reassign appendTo into the result of evaluating appendTo
    // if it's set as a function instead of Element
    if (settings.appendTo && typeof settings.appendTo === 'function') {
      settings.appendTo = settings.appendTo();
    }

    return settings;
  }

  var idCounter = 1;

  /**
  * Creates tooltips for all el elements that match the instance's selector
  * @param {Element[]} els
  * @return {Object[]} Array of ref data objects
  */
  function createTooltips(els) {
    var _this = this;

    return els.reduce(function (a, el) {
      var id = idCounter;

      var settings = evaluateSettings(_this.settings.performance ? _this.settings : getIndividualSettings(el, _this.settings));

      var refObject = _this.refObject;

      var html = settings.html,
          trigger = settings.trigger,
          touchHold = settings.touchHold;

      var title = el.getAttribute('title');
      if (!title && !html) return a;

      el.setAttribute('data-tooltipped', '');
      el.setAttribute('aria-describedby', 'tippy-tooltip-' + id);
      removeTitle(el);

      var popper = createPopperElement(id, title, settings);
      var handlers = getEventListenerHandlers.call(_this, el, popper, settings);

      var listeners = [];

      trigger.trim().split(' ').forEach(function (event) {
        return listeners = listeners.concat(createTrigger(event, el, handlers, touchHold));
      });

      a.push({
        id: id,
        el: el,
        popper: popper,
        settings: settings,
        listeners: listeners,
        tippyInstance: _this,
        refObject: refObject
      });

      idCounter++;

      return a;
    }, []);
  }

  /* Utility functions */
  /* Core library functions */
  /**
  * @param {String|Element|Element[]} selector
  * @param {Object} settings (optional) - the object of settings to be applied to the instance
  * @param {Object} refObject (optional) - override for popper reference object
  */

  var Tippy = function () {
    function Tippy(selector) {
      var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var refObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      classCallCheck$1(this, Tippy);

      // Use default browser tooltip on unsupported browsers
      if (!Browser.SUPPORTED) return;

      init();

      this.state = {
        destroyed: false
      };

      this.selector = selector;

      this.refObject = refObject;

      this.settings = _extends$1({}, Defaults, settings);

      if (settings.show || settings.shown || settings.hide || settings.hidden) {
        console.warn('Callbacks without the `on` prefix are deprecated (with the exception of `wait`).' + ' Use onShow, onShown, onHide, and onHidden instead.');
      }

      this.callbacks = {
        wait: settings.wait,
        show: settings.onShow || settings.show || noop,
        shown: settings.onShown || settings.shown || noop,
        hide: settings.onHide || settings.hide || noop,
        hidden: settings.onHidden || settings.hidden || noop
      };

      this.store = createTooltips.call(this, getArrayOfElements(selector));
      Store.push.apply(Store, this.store);
    }

    /**
    * Returns the reference element's popper element
    * @param {Element} el
    * @return {Element}
    */

    createClass$1(Tippy, [{
      key: 'getPopperElement',
      value: function getPopperElement(el) {
        try {
          return find(this.store, function (data) {
            return data.el === el;
          }).popper;
        } catch (e) {
          console.error('[getPopperElement]: Element passed as the argument does not exist in the instance');
        }
      }

      /**
      * Returns a popper's reference element
      * @param {Element} popper
      * @return {Element}
      */

    }, {
      key: 'getReferenceElement',
      value: function getReferenceElement(popper) {
        try {
          return find(this.store, function (data) {
            return data.popper === popper;
          }).el;
        } catch (e) {
          console.error('[getReferenceElement]: Popper passed as the argument does not exist in the instance');
        }
      }

      /**
      * Returns the reference data object from either the reference element or popper element
      * @param {Element} x (reference element or popper)
      * @return {Object}
      */

    }, {
      key: 'getReferenceData',
      value: function getReferenceData(x) {
        return find(this.store, function (data) {
          return data.el === x || data.popper === x;
        });
      }

      /**
      * Shows a popper
      * @param {Element} popper
      * @param {Number} customDuration (optional)
      */

    }, {
      key: 'show',
      value: function show(popper, customDuration) {
        var _this = this;

        if (this.state.destroyed) return;

        var data = find(this.store, function (data) {
          return data.popper === popper;
        });

        var _getInnerElements = getInnerElements(popper),
            tooltip = _getInnerElements.tooltip,
            circle = _getInnerElements.circle,
            content = _getInnerElements.content;

        if (!document.body.contains(data.el)) {
          this.destroy(popper);
          return;
        }

        this.callbacks.show.call(popper);

        var el = data.el,
            _data$settings = data.settings,
            appendTo = _data$settings.appendTo,
            sticky = _data$settings.sticky,
            interactive = _data$settings.interactive,
            followCursor = _data$settings.followCursor,
            flipDuration = _data$settings.flipDuration,
            duration = _data$settings.duration,
            dynamicTitle = _data$settings.dynamicTitle,
            refObject = data.refObject;

        if (dynamicTitle) {
          var title = el.getAttribute('title');
          if (title) {
            content.innerHTML = title;
            removeTitle(el);
          }
        }

        var _duration = customDuration !== undefined ? customDuration : Array.isArray(duration) ? duration[0] : duration;

        // Prevent a transition when popper changes position
        applyTransitionDuration([popper, tooltip, circle], 0);

        mountPopper(data);

        popper.style.visibility = 'visible';
        popper.setAttribute('aria-hidden', 'false');

        // Wait for popper's position to update
        defer(function () {
          // Sometimes the arrow will not be in the correct position, force another update
          if (!followCursor || Browser.touch) {
            data.popperInstance.update();
            applyTransitionDuration([popper], flipDuration);
          }

          // Re-apply transition durations
          applyTransitionDuration([tooltip, circle], _duration);

          // Make content fade out a bit faster than the tooltip if `animateFill`
          if (circle) content.style.opacity = 1;

          // Interactive tooltips receive a class of 'active'
          interactive && el.classList.add('active');

          // Update popper's position on every animation frame
          sticky && makeSticky(data);

          // Repaint/reflow is required for CSS transition when appending
          triggerReflow(tooltip, circle);

          modifyClassList([tooltip, circle], function (list) {
            list.contains('tippy-notransition') && list.remove('tippy-notransition');
            list.remove('leave');
            list.add('enter');
          });

          // Wait for transitions to complete
          onTransitionEnd(data, _duration, function () {
            if (!isVisible(popper) || data._onShownFired) return;

            // Focus interactive tooltips only
            interactive && popper.focus();
            // Remove transitions from tooltip
            tooltip.classList.add('tippy-notransition');
            // Prevents shown() from firing more than once from early transition cancellations
            data._onShownFired = true;

            _this.callbacks.shown.call(popper);
          });
        });
      }

      /**
      * Hides a popper
      * @param {Element} popper
      * @param {Number} customDuration (optional)
      */

    }, {
      key: 'hide',
      value: function hide(popper, customDuration) {
        var _this2 = this;

        if (this.state.destroyed) return;

        this.callbacks.hide.call(popper);

        var data = find(this.store, function (data) {
          return data.popper === popper;
        });

        var _getInnerElements2 = getInnerElements(popper),
            tooltip = _getInnerElements2.tooltip,
            circle = _getInnerElements2.circle,
            content = _getInnerElements2.content;

        var el = data.el,
            _data$settings2 = data.settings,
            appendTo = _data$settings2.appendTo,
            sticky = _data$settings2.sticky,
            interactive = _data$settings2.interactive,
            followCursor = _data$settings2.followCursor,
            html = _data$settings2.html,
            trigger = _data$settings2.trigger,
            duration = _data$settings2.duration;

        var _duration = customDuration !== undefined ? customDuration : Array.isArray(duration) ? duration[1] : duration;

        data._onShownFired = false;
        interactive && el.classList.remove('active');

        popper.style.visibility = 'hidden';
        popper.setAttribute('aria-hidden', 'true');

        applyTransitionDuration([tooltip, circle, circle ? content : null], _duration);

        if (circle) content.style.opacity = 0;

        modifyClassList([tooltip, circle], function (list) {
          list.contains('tippy-tooltip') && list.remove('tippy-notransition');
          list.remove('enter');
          list.add('leave');
        });

        // Re-focus click-triggered html elements
        // and the tooltipped element IS in the viewport (otherwise it causes unsightly scrolling
        // if the tooltip is closed and the element isn't in the viewport anymore)
        if (html && trigger.indexOf('click') !== -1 && elementIsInViewport(el)) {
          el.focus();
        }

        // Wait for transitions to complete
        onTransitionEnd(data, _duration, function () {
          // `isVisible` is not completely reliable to determine if we shouldn't
          // run the hidden callback, we need to check the computed opacity style.
          // This prevents glitchy behavior of the transition when quickly showing
          // and hiding a tooltip.
          if (isVisible(popper) || !appendTo.contains(popper) || getComputedStyle(tooltip).opacity === '1') return;

          el.removeEventListener('mousemove', followCursorHandler);
          data.popperInstance.disableEventListeners();
          appendTo.removeChild(popper);

          _this2.callbacks.hidden.call(popper);
        });
      }

      /**
      * Updates a popper with new content
      * @param {Element} popper
      */

    }, {
      key: 'update',
      value: function update(popper) {
        if (this.state.destroyed) return;

        var data = find(this.store, function (data) {
          return data.popper === popper;
        });

        var _getInnerElements3 = getInnerElements(popper),
            content = _getInnerElements3.content;

        var el = data.el,
            html = data.settings.html;

        if (html instanceof Element) {
          console.warn('Aborted: update() should not be used if `html` is a DOM element');
          return;
        }

        content.innerHTML = html ? document.getElementById(html.replace('#', '')).innerHTML : el.getAttribute('title') || el.getAttribute('data-original-title');

        if (!html) removeTitle(el);
      }

      /**
      * Destroys a popper
      * @param {Element} popper
      * @param {Boolean} _isLast - private param used by destroyAll to optimize
      */

    }, {
      key: 'destroy',
      value: function destroy(popper, _isLast) {
        var _this3 = this;

        if (this.state.destroyed) return;

        var data = find(this.store, function (data) {
          return data.popper === popper;
        });

        var el = data.el,
            popperInstance = data.popperInstance,
            listeners = data.listeners,
            _mutationObserver = data._mutationObserver;

        // Ensure the popper is hidden

        if (isVisible(popper)) {
          this.hide(popper, 0);
        }

        // Remove Tippy-only event listeners from tooltipped element
        listeners.forEach(function (listener) {
          return el.removeEventListener(listener.event, listener.handler);
        });

        // Restore original title
        el.setAttribute('title', el.getAttribute('data-original-title'));

        el.removeAttribute('data-original-title');
        el.removeAttribute('data-tooltipped');
        el.removeAttribute('aria-describedby');

        popperInstance && popperInstance.destroy();
        _mutationObserver && _mutationObserver.disconnect();

        // Remove from store
        Store.splice(findIndex(Store, function (data) {
          return data.popper === popper;
        }), 1);

        // Ensure filter is called only once
        if (_isLast === undefined || _isLast) {
          this.store = Store.filter(function (data) {
            return data.tippyInstance === _this3;
          });
        }
      }

      /**
      * Destroys all tooltips created by the instance
      */

    }, {
      key: 'destroyAll',
      value: function destroyAll() {
        var _this4 = this;

        if (this.state.destroyed) return;

        var storeLength = this.store.length;

        this.store.forEach(function (_ref, index) {
          var popper = _ref.popper;

          _this4.destroy(popper, index === storeLength - 1);
        });

        this.store = null;
        this.state.destroyed = true;
      }
    }]);
    return Tippy;
  }();

  function tippy$2(selector, settings, refObject) {
    return new Tippy(selector, settings, refObject);
  }

  tippy$2.Browser = Browser;
  tippy$2.Defaults = Defaults;
  tippy$2.disableDynamicInputDetection = function () {
    return Browser.dynamicInputDetection = false;
  };
  tippy$2.enableDynamicInputDetection = function () {
    return Browser.dynamicInputDetection = true;
  };

  return tippy$2;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(0);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('core', 'tippy', impl.core); // register with cytoscape.js
  cytoscape('collection', 'tippy', impl.collection); //Cytoscape Collections
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA3MWE4OGFjY2E3MjA1YzU4MDg2NiIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9oZWxwZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvcmVuZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb3JlL3RpcHB5LmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIl0sIm5hbWVzIjpbInRpcHB5UmVuZGVyZXIiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsImNvcmUiLCJzZWxlY3RvciIsInVzZXJPcHRpb25zIiwiY3kiLCJvcHRpb25zIiwiY3JlYXRlVGlwcHlPcHRpb25zT2JqZWN0Iiwic2NyYXRjaCIsInRpcHB5IiwiY3JlYXRlVGlwcHlPYmplY3QiLCJjb2xsZWN0aW9uIiwiZWxlbWVudHMiLCJlYWNoIiwiZWxlbWVudCIsImkiLCJ1cGRhdGVUaXBweU9iamVjdFBvc2l0aW9uIiwiY3lFbGVtZW50IiwidXBkYXRlIiwiZ2V0UG9wcGVyQm91bmRpbmdCb3giLCJpc05vZGUiLCJkaW0iLCJwb3NpdGlvbiIsInJlbmRlcmVkUG9zaXRpb24iLCJtaWRwb2ludCIsIndpZHRoQXZnIiwib3V0ZXJXaWR0aCIsImhlaWdodEF2ZyIsIm91dGVySGVpZ2h0IiwieCIsInkiLCJjeU9mZnNldCIsImNvbnRhaW5lciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImlzTmFOIiwidG9wIiwid2luZG93IiwicGFnZVlPZmZzZXQiLCJsZWZ0IiwicGFnZVhPZmZzZXQiLCJyaWdodCIsInciLCJib3R0b20iLCJoIiwid2lkdGgiLCJoZWlnaHQiLCJnZXRUaXBweU9iamVjdERpbWVuc2lvbnMiLCJyZW5kZXJlZE91dGVyV2lkdGgiLCJyZW5kZXJlZE91dGVySGVpZ2h0IiwiZ2V0UG9wcGVyT2JqZWN0VGFyZ2V0IiwidGFyZ2V0T3B0IiwidGFyZ2V0IiwiaGVscGVyIiwiT2JqZWN0IiwiYXNzaWduIiwiaXNDeSIsInBhbiIsInVuZGVmaW5lZCIsImlzY3lFbGVtZW50IiwicmVmT2JqZWN0IiwiY2xpZW50V2lkdGgiLCJjbGllbnRIZWlnaHQiLCJlIiwidGlwcHlFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwicG9wcGVyIiwiZ2V0UG9wcGVyRWxlbWVudCIsImdsb2JhbCIsImZhY3RvcnkiLCJCcm93c2VyIiwiU1VQUE9SVEVEIiwiU1VQUE9SVFNfVE9VQ0giLCJ0b3VjaCIsImR5bmFtaWNJbnB1dERldGVjdGlvbiIsImlPUyIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJNU1N0cmVhbSIsIlN0b3JlIiwiU2VsZWN0b3JzIiwiUE9QUEVSIiwiVE9PTFRJUCIsIkNPTlRFTlQiLCJDSVJDTEUiLCJBUlJPVyIsIlRPT0xUSVBQRURfRUwiLCJDT05UUk9MTEVSIiwiRGVmYXVsdHMiLCJodG1sIiwiYW5pbWF0aW9uIiwiYW5pbWF0ZUZpbGwiLCJhcnJvdyIsImFycm93U2l6ZSIsImRlbGF5IiwidHJpZ2dlciIsImR1cmF0aW9uIiwiaW50ZXJhY3RpdmUiLCJpbnRlcmFjdGl2ZUJvcmRlciIsInRoZW1lIiwic2l6ZSIsImRpc3RhbmNlIiwib2Zmc2V0IiwiaGlkZU9uQ2xpY2siLCJtdWx0aXBsZSIsImZvbGxvd0N1cnNvciIsImluZXJ0aWEiLCJmbGlwRHVyYXRpb24iLCJzdGlja3kiLCJzdGlja3lEdXJhdGlvbiIsImFwcGVuZFRvIiwiYm9keSIsInpJbmRleCIsInRvdWNoSG9sZCIsInBlcmZvcm1hbmNlIiwiZHluYW1pY1RpdGxlIiwicG9wcGVyT3B0aW9ucyIsIkRlZmF1bHRzS2V5cyIsImtleXMiLCJoaWRlQWxsUG9wcGVycyIsImV4Y2x1ZGUiLCJmb3JFYWNoIiwicmVmRGF0YSIsInRpcHB5SW5zdGFuY2UiLCJfcmVmRGF0YSRzZXR0aW5ncyIsInNldHRpbmdzIiwiY29udGFpbnMiLCJpc0hpZGVPbkNsaWNrIiwiaW5kZXhPZiIsImlzTm90Q3VycmVudFJlZiIsImhpZGUiLCJFbGVtZW50IiwicHJvdG90eXBlIiwibWF0Y2hlcyIsIm1hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsIm1vek1hdGNoZXNTZWxlY3RvciIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwicyIsIm93bmVyRG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwibGVuZ3RoIiwiaXRlbSIsImNsb3Nlc3QiLCJwYXJlbnRTZWxlY3RvciIsIl9jbG9zZXN0IiwiZWwiLCJjYWxsIiwicGFyZW50RWxlbWVudCIsImZpbmQiLCJhcnIiLCJjaGVja0ZuIiwiQXJyYXkiLCJmaWx0ZXIiLCJiaW5kRXZlbnRMaXN0ZW5lcnMiLCJ0b3VjaEhhbmRsZXIiLCJjbGFzc0xpc3QiLCJhZGQiLCJhZGRFdmVudExpc3RlbmVyIiwibW91c2Vtb3ZlSGFuZGxlciIsInRpbWUiLCJub3ciLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVtb3ZlIiwiY2xpY2tIYW5kbGVyIiwiZXZlbnQiLCJyZWYiLCJfcmVmIiwiX3JlZiRzZXR0aW5ncyIsImJsdXJIYW5kbGVyIiwiX2RvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsImJsdXIiLCJtYXhUb3VjaFBvaW50cyIsIm1zTWF4VG91Y2hQb2ludHMiLCJpbml0IiwiZG9uZSIsImRlZmVyIiwiZm4iLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJzZXRUaW1lb3V0IiwicHJlZml4IiwicHJvcGVydHkiLCJwcmVmaXhlcyIsInVwcGVyUHJvcCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJfcHJlZml4IiwicHJlZml4ZWRQcm9wIiwic3R5bGUiLCJmaW5kSW5kZXgiLCJyZW1vdmVUaXRsZSIsInRpdGxlIiwiZ2V0QXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwiZWxlbWVudElzSW5WaWV3cG9ydCIsInJlY3QiLCJpbm5lckhlaWdodCIsImRvY3VtZW50RWxlbWVudCIsImlubmVyV2lkdGgiLCJ0cmlnZ2VyUmVmbG93IiwidG9vbHRpcCIsImNpcmNsZSIsImdldENvbXB1dGVkU3R5bGUiLCJvcGFjaXR5IiwibW9kaWZ5Q2xhc3NMaXN0IiwiZWxzIiwiY2FsbGJhY2siLCJnZXRJbm5lckVsZW1lbnRzIiwiY29udGVudCIsImFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uIiwiaXNDb250ZW50IiwiX2R1cmF0aW9uIiwiTWF0aCIsInJvdW5kIiwiaXNWaXNpYmxlIiwidmlzaWJpbGl0eSIsIm5vb3AiLCJnZXRDb3JlUGxhY2VtZW50IiwicGxhY2VtZW50IiwicmVwbGFjZSIsImZvbGxvd0N1cnNvckhhbmRsZXIiLCJfdGhpcyIsImhhbGZQb3BwZXJXaWR0aCIsIm9mZnNldFdpZHRoIiwiaGFsZlBvcHBlckhlaWdodCIsIm9mZnNldEhlaWdodCIsInZpZXdwb3J0UGFkZGluZyIsInBhZ2VXaWR0aCIsInBhZ2VYIiwicGFnZVkiLCJpc1JpZ2h0T3ZlcmZsb3dpbmciLCJpc0xlZnRPdmVyZmxvd2luZyIsImdldEFycmF5T2ZFbGVtZW50cyIsImlzQXJyYXkiLCJvblRyYW5zaXRpb25FbmQiLCJkYXRhIiwiX2dldElubmVyRWxlbWVudHMiLCJ0cmFuc2l0aW9uZW5kRmlyZWQiLCJsaXN0ZW5lckNhbGxiYWNrIiwiY2xlYXJUaW1lb3V0IiwiX3RyYW5zaXRpb25lbmRUaW1lb3V0IiwibmF0aXZlSGludHMiLCJpc05hdGl2ZSIsInNvbWUiLCJoaW50IiwidG9TdHJpbmciLCJpc0Jyb3dzZXIiLCJsb25nZXJUaW1lb3V0QnJvd3NlcnMiLCJ0aW1lb3V0RHVyYXRpb24iLCJtaWNyb3Rhc2tEZWJvdW5jZSIsInNjaGVkdWxlZCIsImVsZW0iLCJjcmVhdGVFbGVtZW50Iiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwib2JzZXJ2ZSIsImF0dHJpYnV0ZXMiLCJ0YXNrRGVib3VuY2UiLCJzdXBwb3J0c05hdGl2ZU11dGF0aW9uT2JzZXJ2ZXIiLCJkZWJvdW5jZSIsImlzRnVuY3Rpb24iLCJmdW5jdGlvblRvQ2hlY2siLCJnZXRUeXBlIiwiZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5Iiwibm9kZVR5cGUiLCJjc3MiLCJnZXRQYXJlbnROb2RlIiwibm9kZU5hbWUiLCJwYXJlbnROb2RlIiwiaG9zdCIsImdldFNjcm9sbFBhcmVudCIsIl9nZXRTdHlsZUNvbXB1dGVkUHJvcCIsIm92ZXJmbG93Iiwib3ZlcmZsb3dYIiwib3ZlcmZsb3dZIiwiZ2V0T2Zmc2V0UGFyZW50Iiwib2Zmc2V0UGFyZW50IiwiaXNPZmZzZXRDb250YWluZXIiLCJmaXJzdEVsZW1lbnRDaGlsZCIsImdldFJvb3QiLCJub2RlIiwiZmluZENvbW1vbk9mZnNldFBhcmVudCIsImVsZW1lbnQxIiwiZWxlbWVudDIiLCJvcmRlciIsImNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIiwiTm9kZSIsIkRPQ1VNRU5UX1BPU0lUSU9OX0ZPTExPV0lORyIsInN0YXJ0IiwiZW5kIiwicmFuZ2UiLCJjcmVhdGVSYW5nZSIsInNldFN0YXJ0Iiwic2V0RW5kIiwiY29tbW9uQW5jZXN0b3JDb250YWluZXIiLCJlbGVtZW50MXJvb3QiLCJnZXRTY3JvbGwiLCJzaWRlIiwiYXJndW1lbnRzIiwidXBwZXJTaWRlIiwic2Nyb2xsaW5nRWxlbWVudCIsImluY2x1ZGVTY3JvbGwiLCJzdWJ0cmFjdCIsInNjcm9sbFRvcCIsInNjcm9sbExlZnQiLCJtb2RpZmllciIsImdldEJvcmRlcnNTaXplIiwic3R5bGVzIiwiYXhpcyIsInNpZGVBIiwic2lkZUIiLCJzcGxpdCIsImlzSUUxMCIsImlzSUUxMCQxIiwiYXBwVmVyc2lvbiIsImdldFNpemUiLCJjb21wdXRlZFN0eWxlIiwibWF4IiwiZ2V0V2luZG93U2l6ZXMiLCJjbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiQ29uc3RydWN0b3IiLCJUeXBlRXJyb3IiLCJjcmVhdGVDbGFzcyIsImRlZmluZVByb3BlcnRpZXMiLCJwcm9wcyIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJkZWZpbmVQcm9wZXJ0eSIsImtleSIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsIm9iaiIsInZhbHVlIiwiX2V4dGVuZHMiLCJzb3VyY2UiLCJoYXNPd25Qcm9wZXJ0eSIsImdldENsaWVudFJlY3QiLCJvZmZzZXRzIiwiZXJyIiwicmVzdWx0Iiwic2l6ZXMiLCJob3JpelNjcm9sbGJhciIsInZlcnRTY3JvbGxiYXIiLCJnZXRPZmZzZXRSZWN0UmVsYXRpdmVUb0FyYml0cmFyeU5vZGUiLCJjaGlsZHJlbiIsInBhcmVudCIsImlzSFRNTCIsImNoaWxkcmVuUmVjdCIsInBhcmVudFJlY3QiLCJzY3JvbGxQYXJlbnQiLCJib3JkZXJUb3BXaWR0aCIsImJvcmRlckxlZnRXaWR0aCIsIm1hcmdpblRvcCIsIm1hcmdpbkxlZnQiLCJnZXRWaWV3cG9ydE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJ0Yml0cmFyeU5vZGUiLCJyZWxhdGl2ZU9mZnNldCIsImlzRml4ZWQiLCJnZXRCb3VuZGFyaWVzIiwicmVmZXJlbmNlIiwicGFkZGluZyIsImJvdW5kYXJpZXNFbGVtZW50IiwiYm91bmRhcmllcyIsImJvdW5kYXJpZXNOb2RlIiwiX2dldFdpbmRvd1NpemVzIiwiZ2V0QXJlYSIsImNvbXB1dGVBdXRvUGxhY2VtZW50IiwicmVmUmVjdCIsInJlY3RzIiwic29ydGVkQXJlYXMiLCJtYXAiLCJhcmVhIiwic29ydCIsImEiLCJiIiwiZmlsdGVyZWRBcmVhcyIsIl9yZWYyIiwiY29tcHV0ZWRQbGFjZW1lbnQiLCJ2YXJpYXRpb24iLCJnZXRSZWZlcmVuY2VPZmZzZXRzIiwic3RhdGUiLCJjb21tb25PZmZzZXRQYXJlbnQiLCJnZXRPdXRlclNpemVzIiwicGFyc2VGbG9hdCIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpblJpZ2h0IiwiZ2V0T3Bwb3NpdGVQbGFjZW1lbnQiLCJoYXNoIiwibWF0Y2hlZCIsImdldFBvcHBlck9mZnNldHMiLCJyZWZlcmVuY2VPZmZzZXRzIiwicG9wcGVyUmVjdCIsInBvcHBlck9mZnNldHMiLCJpc0hvcml6IiwibWFpblNpZGUiLCJzZWNvbmRhcnlTaWRlIiwibWVhc3VyZW1lbnQiLCJzZWNvbmRhcnlNZWFzdXJlbWVudCIsImZpbmQkMSIsImNoZWNrIiwiZmluZEluZGV4JDEiLCJwcm9wIiwiY3VyIiwibWF0Y2giLCJydW5Nb2RpZmllcnMiLCJtb2RpZmllcnMiLCJlbmRzIiwibW9kaWZpZXJzVG9SdW4iLCJmdW5jdGlvbiIsImNvbnNvbGUiLCJ3YXJuIiwiZW5hYmxlZCIsImlzRGVzdHJveWVkIiwiYXJyb3dTdHlsZXMiLCJmbGlwcGVkIiwiZmxpcCIsIm9yaWdpbmFsUGxhY2VtZW50IiwiaXNDcmVhdGVkIiwib25DcmVhdGUiLCJvblVwZGF0ZSIsImlzTW9kaWZpZXJFbmFibGVkIiwibW9kaWZpZXJOYW1lIiwibmFtZSIsImdldFN1cHBvcnRlZFByb3BlcnR5TmFtZSIsInRvQ2hlY2siLCJkZXN0cm95IiwiZGlzYWJsZUV2ZW50TGlzdGVuZXJzIiwicmVtb3ZlT25EZXN0cm95IiwicmVtb3ZlQ2hpbGQiLCJhdHRhY2hUb1Njcm9sbFBhcmVudHMiLCJzY3JvbGxQYXJlbnRzIiwiaXNCb2R5IiwicGFzc2l2ZSIsInB1c2giLCJzZXR1cEV2ZW50TGlzdGVuZXJzIiwidXBkYXRlQm91bmQiLCJzY3JvbGxFbGVtZW50IiwiZXZlbnRzRW5hYmxlZCIsImVuYWJsZUV2ZW50TGlzdGVuZXJzIiwic2NoZWR1bGVVcGRhdGUiLCJyZW1vdmVFdmVudExpc3RlbmVycyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiaXNOdW1lcmljIiwibiIsImlzRmluaXRlIiwic2V0U3R5bGVzIiwidW5pdCIsInNldEF0dHJpYnV0ZXMiLCJhcHBseVN0eWxlIiwiYXJyb3dFbGVtZW50IiwiYXBwbHlTdHlsZU9uTG9hZCIsIm1vZGlmaWVyT3B0aW9ucyIsImNvbXB1dGVTdHlsZSIsImxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiIsImdwdUFjY2VsZXJhdGlvbiIsIm9mZnNldFBhcmVudFJlY3QiLCJmbG9vciIsInByZWZpeGVkUHJvcGVydHkiLCJ3aWxsQ2hhbmdlIiwiaW52ZXJ0VG9wIiwiaW52ZXJ0TGVmdCIsImlzTW9kaWZpZXJSZXF1aXJlZCIsInJlcXVlc3RpbmdOYW1lIiwicmVxdWVzdGVkTmFtZSIsInJlcXVlc3RpbmciLCJpc1JlcXVpcmVkIiwiX3JlcXVlc3RpbmciLCJyZXF1ZXN0ZWQiLCJfZGF0YSRvZmZzZXRzIiwiaXNWZXJ0aWNhbCIsImxlbiIsInNpZGVDYXBpdGFsaXplZCIsInRvTG93ZXJDYXNlIiwiYWx0U2lkZSIsIm9wU2lkZSIsImFycm93RWxlbWVudFNpemUiLCJjZW50ZXIiLCJwb3BwZXJNYXJnaW5TaWRlIiwic2lkZVZhbHVlIiwibWluIiwiZ2V0T3Bwb3NpdGVWYXJpYXRpb24iLCJwbGFjZW1lbnRzIiwidmFsaWRQbGFjZW1lbnRzIiwiY2xvY2t3aXNlIiwiY291bnRlciIsImluZGV4IiwiY29uY2F0IiwicmV2ZXJzZSIsIkJFSEFWSU9SUyIsIkZMSVAiLCJDTE9DS1dJU0UiLCJDT1VOVEVSQ0xPQ0tXSVNFIiwicGxhY2VtZW50T3Bwb3NpdGUiLCJmbGlwT3JkZXIiLCJiZWhhdmlvciIsInN0ZXAiLCJyZWZPZmZzZXRzIiwib3ZlcmxhcHNSZWYiLCJvdmVyZmxvd3NMZWZ0Iiwib3ZlcmZsb3dzUmlnaHQiLCJvdmVyZmxvd3NUb3AiLCJvdmVyZmxvd3NCb3R0b20iLCJvdmVyZmxvd3NCb3VuZGFyaWVzIiwiZmxpcHBlZFZhcmlhdGlvbiIsImZsaXBWYXJpYXRpb25zIiwia2VlcFRvZ2V0aGVyIiwidG9WYWx1ZSIsInN0ciIsInBhcnNlT2Zmc2V0IiwiYmFzZVBsYWNlbWVudCIsInVzZUhlaWdodCIsImZyYWdtZW50cyIsImZyYWciLCJ0cmltIiwiZGl2aWRlciIsInNlYXJjaCIsInNwbGl0UmVnZXgiLCJvcHMiLCJvcCIsIm1lcmdlV2l0aFByZXZpb3VzIiwicmVkdWNlIiwiaW5kZXgyIiwicHJldmVudE92ZXJmbG93IiwicHJpb3JpdHkiLCJwcmltYXJ5IiwiZXNjYXBlV2l0aFJlZmVyZW5jZSIsInNlY29uZGFyeSIsInNoaWZ0Iiwic2hpZnR2YXJpYXRpb24iLCJzaGlmdE9mZnNldHMiLCJib3VuZCIsImlubmVyIiwic3VidHJhY3RMZW5ndGgiLCJvbkxvYWQiLCJEZWZhdWx0cyQxIiwiUG9wcGVyIiwiYmluZCIsImpxdWVyeSIsInVwZGF0ZSQkMSIsImRlc3Ryb3kkJDEiLCJlbmFibGVFdmVudExpc3RlbmVycyQkMSIsImRpc2FibGVFdmVudExpc3RlbmVycyQkMSIsIlV0aWxzIiwiUG9wcGVyVXRpbHMiLCJnZXRPZmZzZXREaXN0YW5jZUluUHgiLCJjbGFzc0NhbGxDaGVjayQxIiwiY3JlYXRlQ2xhc3MkMSIsIl9leHRlbmRzJDEiLCJjcmVhdGVQb3BwZXJJbnN0YW5jZSIsIl9kYXRhJHNldHRpbmdzIiwiY29uZmlnIiwicG9wcGVySW5zdGFuY2UiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiY2hhcmFjdGVyRGF0YSIsIl9tdXRhdGlvbk9ic2VydmVyIiwibW91bnRQb3BwZXIiLCJhcHBlbmRDaGlsZCIsIm1ha2VTdGlja3kiLCJyZW1vdmVUcmFuc2l0aW9uRHVyYXRpb24iLCJ1cGRhdGVQb3NpdGlvbiIsImdldEluZGl2aWR1YWxTZXR0aW5ncyIsImluc3RhbmNlU2V0dGluZ3MiLCJhY2MiLCJ2YWwiLCJKU09OIiwicGFyc2UiLCJjcmVhdGVQb3BwZXJFbGVtZW50IiwiaWQiLCJ0IiwiX2Fycm93IiwidGVtcGxhdGVJZCIsImlubmVySFRNTCIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlVHJpZ2dlciIsImhhbmRsZXJzIiwibGlzdGVuZXJzIiwiaGFuZGxlVHJpZ2dlciIsImhhbmRsZXIiLCJoYW5kbGVNb3VzZWxlYXZlIiwiaGFuZGxlQmx1ciIsImN1cnNvcklzT3V0c2lkZUludGVyYWN0aXZlQm9yZGVyIiwiY2xpZW50WCIsImNsaWVudFkiLCJjb3JlUG9zaXRpb24iLCJib3JkZXJXaXRoRGlzdGFuY2UiLCJleGNlZWRzIiwiZ2V0RXZlbnRMaXN0ZW5lckhhbmRsZXJzIiwidG91Y2hXYWl0Iiwic2hvd0RlbGF5IiwiaGlkZURlbGF5IiwiY2xlYXJUaW1lb3V0cyIsIl9zaG93IiwiX2RlbGF5Iiwic2hvdyIsImNhbGxiYWNrcyIsIndhaXQiLCJtb3VzZWVudGVyVG91Y2giLCJ0eXBlIiwiaXNDbGljayIsImlzTm90UGVyc2lzdGVudCIsImNsaWNrIiwiaGFuZGxlTW91c2Vtb3ZlIiwidHJpZ2dlckhpZGUiLCJjbG9zZXN0VG9vbHRpcHBlZEVsIiwiaXNPdmVyUG9wcGVyIiwiaXNPdmVyRWwiLCJpc0NsaWNrVHJpZ2dlcmVkIiwiaXNPdmVyT3RoZXJUb29sdGlwcGVkRWwiLCJyZWxhdGVkVGFyZ2V0IiwiZXZhbHVhdGVTZXR0aW5ncyIsImlkQ291bnRlciIsImNyZWF0ZVRvb2x0aXBzIiwiVGlwcHkiLCJkZXN0cm95ZWQiLCJzaG93biIsImhpZGRlbiIsIm9uU2hvdyIsIm9uU2hvd24iLCJvbkhpZGUiLCJvbkhpZGRlbiIsInN0b3JlIiwiYXBwbHkiLCJlcnJvciIsImdldFJlZmVyZW5jZUVsZW1lbnQiLCJnZXRSZWZlcmVuY2VEYXRhIiwiY3VzdG9tRHVyYXRpb24iLCJsaXN0IiwiX29uU2hvd25GaXJlZCIsImZvY3VzIiwiX3RoaXMyIiwiX2dldElubmVyRWxlbWVudHMyIiwiX2RhdGEkc2V0dGluZ3MyIiwiX2dldElubmVyRWxlbWVudHMzIiwiX2lzTGFzdCIsIl90aGlzMyIsImxpc3RlbmVyIiwiZGlzY29ubmVjdCIsInNwbGljZSIsImRlc3Ryb3lBbGwiLCJfdGhpczQiLCJzdG9yZUxlbmd0aCIsInRpcHB5JDIiLCJkaXNhYmxlRHluYW1pY0lucHV0RGV0ZWN0aW9uIiwiZW5hYmxlRHluYW1pY0lucHV0RGV0ZWN0aW9uIiwiaW1wbCIsInJlZ2lzdGVyIiwiY3l0b3NjYXBlIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNB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LE9BQVIsR0FBa0JBLE9BQWxCO0FBQ0Fra0IsVUFBUS9pQixRQUFSLEdBQW1CQSxRQUFuQjtBQUNBK2lCLFVBQVFDLDRCQUFSLEdBQXVDLFlBQVk7QUFDakQsV0FBT25rQixRQUFRSSxxQkFBUixHQUFnQyxLQUF2QztBQUNELEdBRkQ7QUFHQThqQixVQUFRRSwyQkFBUixHQUFzQyxZQUFZO0FBQ2hELFdBQU9wa0IsUUFBUUkscUJBQVIsR0FBZ0MsSUFBdkM7QUFDRCxHQUZEOztBQUlBLFNBQU84akIsT0FBUDtBQUVDLENBdDVIQSxDQUFELEM7Ozs7Ozs7Ozs7QUNBQSxJQUFNRyxPQUFPLG1CQUFBNW9CLENBQVEsQ0FBUixDQUFiOztBQUVBO0FBQ0EsSUFBSTZvQixXQUFXLFNBQVhBLFFBQVcsQ0FBVUMsU0FBVixFQUFxQjtBQUNsQyxNQUFJLENBQUNBLFNBQUwsRUFBZ0I7QUFBRTtBQUFTLEdBRE8sQ0FDTjs7QUFFNUJBLFlBQVcsTUFBWCxFQUFtQixPQUFuQixFQUE0QkYsS0FBS3pvQixJQUFqQyxFQUhrQyxDQUdPO0FBQ3pDMm9CLFlBQVcsWUFBWCxFQUF5QixPQUF6QixFQUFrQ0YsS0FBS2hvQixVQUF2QyxFQUprQyxDQUlrQjtBQUVyRCxDQU5EOztBQVFBLElBQUksT0FBT2tvQixTQUFQLEtBQXFCLFdBQXpCLEVBQXNDO0FBQUU7QUFDdENELFdBQVVDLFNBQVY7QUFDRDs7QUFFRDdvQixPQUFPQyxPQUFQLEdBQWlCMm9CLFFBQWpCLEM7Ozs7OztBQ2ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7O0FBRTVDIiwiZmlsZSI6ImN5dG9zY2FwZS10aXBweS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImN5dG9zY2FwZVRpcHB5XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImN5dG9zY2FwZVRpcHB5XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNzFhODhhY2NhNzIwNWM1ODA4NjYiLCJjb25zdCB0aXBweVJlbmRlcmVyID0gcmVxdWlyZSgnLi9yZW5kZXIuanMnKTtcblxubW9kdWxlLmV4cG9ydHMuY29yZSA9IGZ1bmN0aW9uIChzZWxlY3RvciwgdXNlck9wdGlvbnMpIHtcbiAgLy9HZXQgY3l0b3NjYXBlIG9iamVjdCBhbmQgY29udGFpbmVyXG4gIHZhciBjeSA9IHRoaXM7XG5cbiAgLy9DcmVhdGUgb3B0aW9ucyBvYmplY3QgZm9yIGN1cnJlbnQgZWxlbWVudFxuICB2YXIgb3B0aW9ucyA9IHRpcHB5UmVuZGVyZXIuY3JlYXRlVGlwcHlPcHRpb25zT2JqZWN0KHVzZXJPcHRpb25zKTtcblxuICAvL1N0b3JlIHRlbXAgZGF0YVxuICBjeS5zY3JhdGNoKCd0aXBweS1vcHRzJywgb3B0aW9ucyk7XG4gIGN5LnNjcmF0Y2goJ3RpcHB5LXRhcmdldCcsIHNlbGVjdG9yKTtcblxuICAvL0NyZWF0ZSBhIHRpcHB5IG9iamVjdFxuICB2YXIgdGlwcHkgPSB0aXBweVJlbmRlcmVyLmNyZWF0ZVRpcHB5T2JqZWN0KGN5KTtcbiAgY3kuc2NyYXRjaCgndGlwcHknLCB0aXBweSk7XG5cbiAgcmV0dXJuIHRoaXM7IC8vIGNoYWluYWJpbGl0eVxufTtcblxuXG4vL0NyZWF0ZSBhIHRpcHB5IG9iamVjdCBmb3IgYWxsIGVsZW1lbnRzIGluIGEgY29sbGVjdGlvblxubW9kdWxlLmV4cG9ydHMuY29sbGVjdGlvbiA9IGZ1bmN0aW9uIChzZWxlY3RvciwgdXNlck9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnRzID0gdGhpcztcbiAgXG4gIC8vTG9vcCBvdmVyIGVhY2ggZWxlbWVudCBpbiB0aGUgY3VycmVudCBjb2xsZWN0aW9uLlxuICBlbGVtZW50cy5lYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgLy9DcmVhdGUgb3B0aW9ucyBvYmplY3QgZm9yIGN1cnJlbnQgZWxlbWVudFxuICAgIHZhciBvcHRpb25zID0gdGlwcHlSZW5kZXJlci5jcmVhdGVUaXBweU9wdGlvbnNPYmplY3QodXNlck9wdGlvbnMpO1xuXG4gICAgLy9TdG9yZSB0ZW1wIGRhdGFcbiAgICBlbGVtZW50LnNjcmF0Y2goJ3RpcHB5LW9wdHMnLCBvcHRpb25zKTtcbiAgICBlbGVtZW50LnNjcmF0Y2goJ3RpcHB5LXRhcmdldCcsIHNlbGVjdG9yKTtcblxuICAgIC8vQ3JlYXRlIGEgdGlwcHkgb2JqZWN0XG4gICAgdmFyIHRpcHB5ID0gdGlwcHlSZW5kZXJlci5jcmVhdGVUaXBweU9iamVjdChlbGVtZW50KTtcbiAgICBlbGVtZW50LnNjcmF0Y2goJ3RpcHB5JywgdGlwcHkpO1xuXG4gIH0pO1xuXG4gIHJldHVybiB0aGlzOyAvLyBjaGFpbmFiaWxpdHlcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29yZS9pbmRleC5qcyIsIi8vVXBkYXRlIHRpcHB5IG9iamVjdFxubW9kdWxlLmV4cG9ydHMudXBkYXRlVGlwcHlPYmplY3RQb3NpdGlvbiA9IGZ1bmN0aW9uIChjeUVsZW1lbnQpIHtcbiAgICB2YXIgdGlwcHkgPSBjeUVsZW1lbnQuc2NyYXRjaCgndGlwcHknKTtcbiAgICB0aXBweS51cGRhdGUoKTtcbiAgICByZXR1cm4gdGlwcHk7XG59O1xuXG4vL1JldHVybiB0aGUgYm91bmRpbmcgcmVjdGFuZ2xlIGZvciB0aGUgZ2l2ZW4gZWxlbWVudFxubW9kdWxlLmV4cG9ydHMuZ2V0UG9wcGVyQm91bmRpbmdCb3ggPSBmdW5jdGlvbiAoY3lFbGVtZW50LCBjeSwgaXNOb2RlLCBkaW0pIHtcbiAgICB2YXIgcG9zaXRpb247XG5cbiAgICBpZiAoaXNOb2RlKSB7XG4gICAgICAgIHBvc2l0aW9uID0gY3lFbGVtZW50LnJlbmRlcmVkUG9zaXRpb24oKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHBvc2l0aW9uID0gY3lFbGVtZW50Lm1pZHBvaW50KCk7XG4gICAgfVxuXG4gICAgLy9Vc2UgbWlkcG9pbnQgb2YgdGhlIGVsZW1lbnQgYXMgdGhlIGRlc2lyZWQgcG9zaXRpb25cbiAgICB2YXIgd2lkdGhBdmcgPSBjeUVsZW1lbnQub3V0ZXJXaWR0aCgpIC8gMjtcbiAgICB2YXIgaGVpZ2h0QXZnID0gY3lFbGVtZW50Lm91dGVySGVpZ2h0KCkgLyAyO1xuICAgIHBvc2l0aW9uLnggLT0gd2lkdGhBdmc7XG4gICAgcG9zaXRpb24ueSAtPSBoZWlnaHRBdmc7XG5cbiAgICB2YXIgY3lPZmZzZXQgPSBjeS5jb250YWluZXIoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIC8vRXhpdCBpZiBwb3NpdGlvbiBpcyBpbnZhbGlkXG4gICAgaWYgKCFwb3NpdGlvbiB8fCBwb3NpdGlvbi54ID09IG51bGwgfHwgaXNOYU4ocG9zaXRpb24ueCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vUmV0dXJuIHRoZSBib3VuZGluZyAgYm94XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiBwb3NpdGlvbi55ICsgY3lPZmZzZXQudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgICBsZWZ0OiBwb3NpdGlvbi54ICsgY3lPZmZzZXQubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgcmlnaHQ6IHBvc2l0aW9uLnggKyBkaW0udyArIGN5T2Zmc2V0LmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQsXG4gICAgICAgIGJvdHRvbTogcG9zaXRpb24ueSArIGRpbS5oICsgY3lPZmZzZXQudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgICB3aWR0aDogZGltLncsXG4gICAgICAgIGhlaWdodDogZGltLmgsXG4gICAgfTtcbn07XG5cbi8vUmV0dXJuIGRpbWVuc2lvbnNcbm1vZHVsZS5leHBvcnRzLmdldFRpcHB5T2JqZWN0RGltZW5zaW9ucyA9IGZ1bmN0aW9uIChjeUVsZW1lbnQsIGlzTm9kZSkge1xuICAgIC8vU2V0IERlZmF1bHRzXG4gICAgdmFyIHdpZHRoID0gMTtcbiAgICB2YXIgaGVpZ2h0ID0gMTtcblxuICAgIC8vT3ZlcmlkZSB3aXRoIHRoZSBvdXRlci1kaW1lbnNpb25zIGlmIHRoZSBlbGVtZW50IGlzIGEgbm9kZVxuICAgIGlmIChpc05vZGUpIHtcbiAgICAgICAgd2lkdGggPSBjeUVsZW1lbnQucmVuZGVyZWRPdXRlcldpZHRoKCk7XG4gICAgICAgIGhlaWdodCA9IGN5RWxlbWVudC5yZW5kZXJlZE91dGVySGVpZ2h0KCk7XG4gICAgfVxuXG4gICAgLy9SZXR1cm4gYSBkaW1lbnNpb24gb2JqZWN0XG4gICAgcmV0dXJuIHsgdzogd2lkdGgsIGg6IGhlaWdodCB9O1xufTtcblxuXG5cbi8vUmV0dXJuIFBvcHBlciBUYXJnZXQgKFRoZSBlbGVtZW50IHRvIGJpbmQgcG9wcGVyIHRvKVxubW9kdWxlLmV4cG9ydHMuZ2V0UG9wcGVyT2JqZWN0VGFyZ2V0ID0gZnVuY3Rpb24gKGN5RWxlbWVudCwgdGFyZ2V0T3B0KSB7XG4gICAgdmFyIHRhcmdldCA9IG51bGw7XG5cbiAgICAvL0lmIHRhcmdldCBvcHRpb24gaXMgaW52YWxpZCwgcmV0dXJuIGVycm9yXG4gICAgaWYgKCEodGFyZ2V0T3B0KSkge1xuICAgICAgICB0aHJvdyBcIkVycm9yIDogTlVMTCBUYXJnZXRcIjtcbiAgICB9XG4gICAgLy9FeGVjdXRlIGZ1bmN0aW9uIGlmIHVzZXIgb3B0ZWQgZm9yIGEgZHlhbmFtaWMgdGFyZ2V0XG4gICAgZWxzZSBpZiAodHlwZW9mIHRhcmdldE9wdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXRPcHQoY3lFbGVtZW50KTtcbiAgICB9XG4gICAgLy9UcmVhdCB0YXJnZXQgb3B0aW9uIGFzIGFuIElEIGlmICB1c2VyIG9wdGVkIGZvciBhIHN0YXRpYyB0YXJnZXRcbiAgICBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0T3B0ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXRPcHQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBcIkVycm9yIDogTm8gVGFyZ2V0XCI7XG4gICAgfVxuXG4gICAgLy9DaGVjayB2YWxpZGl0eSBvZiBwYXJzZWQgdGFyZ2V0XG4gICAgaWYgKHRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBcIkVycm9yIDogTm8gVGFyZ2V0XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbn07XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb3JlL2hlbHBlci5qcyIsImltcG9ydCBUaXBweSBmcm9tICcuL3RpcHB5LmpzJztcblxuLy9JbmNsdWRlIGhlbHBlciBmdW5jdGlvbnMgYW5kIFRpcHB5XG5jb25zdCBoZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlci5qcycpO1xuXG4vL0dlbmVyYXRlIGEgb3B0aW9ucyBvYmplY3QgdG8gd3JhcCB0aGUgZ2l2ZW4gdXNlciBvcHRpb25zXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVUaXBweU9wdGlvbnNPYmplY3QgPSBmdW5jdGlvbiAodXNlck9wdGlvbnMpIHtcbiAgICB2YXIgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHVzZXJPcHRpb25zKTtcbiAgICByZXR1cm4gb3B0aW9ucztcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVRpcHB5T2JqZWN0ID0gZnVuY3Rpb24gKGN5RWxlbWVudCkge1xuICAgIC8vSWYgcG9wcGVyIG9iamVjdCBhbHJlYWR5IGV4aXN0cywgdXBkYXRlIGl0cyBwb3NpdGlvblxuICAgIGlmIChjeUVsZW1lbnQuc2NyYXRjaCgncG9wcGVyJykpIHtcbiAgICAgICAgcmV0dXJuIGhlbHBlci51cGRhdGVUaXBweU9iamVjdFBvc2l0aW9uKGN5RWxlbWVudCk7XG4gICAgfVxuICAgIC8vT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBwb3BwZXIgb2JqZWN0XG4gICAgZWxzZSB7XG4gICAgICAgIC8vRGV0ZXJtaW5lIGVsZW1lbnQgcHJvcGVydGllcyB0byBkZXRlcm1pbmUgaG9lIHRvIGRyYXcgdGlwcHkgb2JqZWN0XG4gICAgICAgIHZhciBpc0N5ID0gY3lFbGVtZW50LnBhbiAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBjeUVsZW1lbnQucGFuID09PSAnZnVuY3Rpb24nO1xuICAgICAgICB2YXIgaXNjeUVsZW1lbnQgPSAhaXNDeTtcbiAgICAgICAgdmFyIGlzTm9kZSA9IGlzY3lFbGVtZW50ICYmIGN5RWxlbWVudC5pc05vZGUoKTtcbiAgICAgICAgdmFyIGN5ID0gaXNDeSA/IGN5RWxlbWVudCA6IGN5RWxlbWVudC5jeSgpO1xuXG4gICAgICAgIC8vR2V0IFZhbHVlcyBmcm9tIHNjYXRjaHBhZFxuICAgICAgICB2YXIgdXNlck9wdGlvbnMgPSBjeUVsZW1lbnQuc2NyYXRjaCgndGlwcHktb3B0cycpO1xuICAgICAgICB2YXIgc2VsZWN0b3IgPSBjeUVsZW1lbnQuc2NyYXRjaCgndGlwcHktdGFyZ2V0Jyk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBudWxsO1xuXG4gICAgICAgIC8vR2V0IERpbWVuc2lvbnNcbiAgICAgICAgdmFyIGRpbSA9IGhlbHBlci5nZXRUaXBweU9iamVjdERpbWVuc2lvbnMoY3lFbGVtZW50LCBpc05vZGUpO1xuXG4gICAgICAgIC8vRGVmaW5lIHBvcHBlciByZWZlcm5jZSBvYmplY3RcbiAgICAgICAgdmFyIHJlZk9iamVjdCA9IHtcbiAgICAgICAgICAgIGdldEJvdW5kaW5nQ2xpZW50UmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoZWxwZXIuZ2V0UG9wcGVyQm91bmRpbmdCb3goY3lFbGVtZW50LCBjeSwgaXNOb2RlLCBkaW0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldCBjbGllbnRXaWR0aCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGltLnc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IGNsaWVudEhlaWdodCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGltLmg7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vR2V0IHRhcmdldCB0byBiaW5kIHBvcHBlciB0b1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gaGVscGVyLmdldFBvcHBlck9iamVjdFRhcmdldChjeUVsZW1lbnQsIHNlbGVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy9FcnJvclxuICAgICAgICAgICAgLy9TdG9wIGNyZWF0aW5nIGEgcG9wcGVyIGZvciB0aXBweVxuICAgICAgICAgICAgcmV0dXJuOztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ3JlYXRlIGFuIGFjdHVhbCB0aXBweSBvYmplY3QgYW5kIG92ZXJyaWRlIHRoZSByZWZlcmVuY2Ugb2JqZWN0LlxuICAgICAgICB2YXIgdGlwcHkgPSBUaXBweSh0YXJnZXQsIHVzZXJPcHRpb25zLCByZWZPYmplY3QpO1xuXG4gICAgICAgIC8vR2V0IHRoZSBhY3R1YWwgaHRtbCB0aXBweSBlbGVtZW50XG4gICAgICAgIHZhciB0aXBweUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAgICAgLy9HZXQgcG9wcGVyXG4gICAgICAgIHZhciBwb3BwZXIgPSB0aXBweS5nZXRQb3BwZXJFbGVtZW50KHRpcHB5RWxlbWVudClcblxuXG4gICAgICAgIC8vU3RvcmUgcG9wcGVyIG9iamVjdCBpbiBhIHNjcmF0Y2ggcGFkXG4gICAgICAgIGN5RWxlbWVudC5zY3JhdGNoKCd0aXBweS1wb3BwZXInLCBwb3BwZXIpO1xuXG4gICAgICAgIHJldHVybiB0aXBweTtcbiAgICB9XG5cbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvcmUvcmVuZGVyLmpzIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLnRpcHB5ID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgQnJvd3NlciA9IHt9O1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgQnJvd3Nlci5TVVBQT1JURUQgPSAncmVxdWVzdEFuaW1hdGlvbkZyYW1lJyBpbiB3aW5kb3c7XG4gIEJyb3dzZXIuU1VQUE9SVFNfVE9VQ0ggPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3c7XG4gIEJyb3dzZXIudG91Y2ggPSBmYWxzZTtcbiAgQnJvd3Nlci5keW5hbWljSW5wdXREZXRlY3Rpb24gPSB0cnVlO1xuICAvLyBDaHJvbWUgZGV2aWNlL3RvdWNoIGVtdWxhdGlvbiBjYW4gbWFrZSB0aGlzIGR5bmFtaWNcbiAgQnJvd3Nlci5pT1MgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICgvaVBob25lfGlQYWR8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhd2luZG93Lk1TU3RyZWFtXG4gICAgKTtcbiAgfTtcbn1cblxuLyoqXG4qIFRoZSBnbG9iYWwgc3RvcmFnZSBhcnJheSB3aGljaCBob2xkcyBhbGwgZGF0YSByZWZlcmVuY2Ugb2JqZWN0c1xuKiBmcm9tIGV2ZXJ5IGluc3RhbmNlXG4qIFRoaXMgYWxsb3dzIHVzIHRvIGhpZGUgdG9vbHRpcHMgZnJvbSBhbGwgaW5zdGFuY2VzLCBmaW5kaW5nIHRoZSByZWYgd2hlblxuKiBjbGlja2luZyBvbiB0aGUgYm9keSwgYW5kIGZvciBmb2xsb3dDdXJzb3JcbiovXG52YXIgU3RvcmUgPSBbXTtcblxuLyoqXG4qIFNlbGVjdG9yIGNvbnN0YW50cyB1c2VkIGZvciBncmFiYmluZyBlbGVtZW50c1xuKi9cbnZhciBTZWxlY3RvcnMgPSB7XG4gIFBPUFBFUjogJy50aXBweS1wb3BwZXInLFxuICBUT09MVElQOiAnLnRpcHB5LXRvb2x0aXAnLFxuICBDT05URU5UOiAnLnRpcHB5LXRvb2x0aXAtY29udGVudCcsXG4gIENJUkNMRTogJ1t4LWNpcmNsZV0nLFxuICBBUlJPVzogJ1t4LWFycm93XScsXG4gIFRPT0xUSVBQRURfRUw6ICdbZGF0YS10b29sdGlwcGVkXScsXG4gIENPTlRST0xMRVI6ICdbZGF0YS10aXBweS1jb250cm9sbGVyXSdcblxuICAvKipcbiAgKiBUaGUgZGVmYXVsdCBzZXR0aW5ncyBhcHBsaWVkIHRvIGVhY2ggaW5zdGFuY2VcbiAgKi9cbn07dmFyIERlZmF1bHRzID0ge1xuICBodG1sOiBmYWxzZSxcbiAgcG9zaXRpb246ICd0b3AnLFxuICBhbmltYXRpb246ICdzaGlmdCcsXG4gIGFuaW1hdGVGaWxsOiB0cnVlLFxuICBhcnJvdzogZmFsc2UsXG4gIGFycm93U2l6ZTogJ3JlZ3VsYXInLFxuICBkZWxheTogMCxcbiAgdHJpZ2dlcjogJ21vdXNlZW50ZXIgZm9jdXMnLFxuICBkdXJhdGlvbjogMzUwLFxuICBpbnRlcmFjdGl2ZTogZmFsc2UsXG4gIGludGVyYWN0aXZlQm9yZGVyOiAyLFxuICB0aGVtZTogJ2RhcmsnLFxuICBzaXplOiAncmVndWxhcicsXG4gIGRpc3RhbmNlOiAxMCxcbiAgb2Zmc2V0OiAwLFxuICBoaWRlT25DbGljazogdHJ1ZSxcbiAgbXVsdGlwbGU6IGZhbHNlLFxuICBmb2xsb3dDdXJzb3I6IGZhbHNlLFxuICBpbmVydGlhOiBmYWxzZSxcbiAgZmxpcER1cmF0aW9uOiAzNTAsXG4gIHN0aWNreTogZmFsc2UsXG4gIHN0aWNreUR1cmF0aW9uOiAyMDAsXG4gIGFwcGVuZFRvOiBmdW5jdGlvbiBhcHBlbmRUbygpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuYm9keTtcbiAgfSxcbiAgekluZGV4OiA5OTk5LFxuICB0b3VjaEhvbGQ6IGZhbHNlLFxuICBwZXJmb3JtYW5jZTogZmFsc2UsXG4gIGR5bmFtaWNUaXRsZTogZmFsc2UsXG4gIHBvcHBlck9wdGlvbnM6IHt9XG5cbiAgLyoqXG4gICogVGhlIGtleXMgb2YgdGhlIGRlZmF1bHRzIG9iamVjdCBmb3IgcmVkdWNpbmcgZG93biBpbnRvIGEgbmV3IG9iamVjdFxuICAqIFVzZWQgaW4gYGdldEluZGl2aWR1YWxTZXR0aW5ncygpYFxuICAqL1xufTt2YXIgRGVmYXVsdHNLZXlzID0gQnJvd3Nlci5TVVBQT1JURUQgJiYgT2JqZWN0LmtleXMoRGVmYXVsdHMpO1xuXG4vKipcbiogSGlkZXMgYWxsIHBvcHBlcnNcbiogQHBhcmFtIHtPYmplY3R9IGV4Y2x1ZGUgLSByZWZEYXRhIHRvIGV4Y2x1ZGUgaWYgbmVlZGVkXG4qL1xuZnVuY3Rpb24gaGlkZUFsbFBvcHBlcnMoZXhjbHVkZSkge1xuICBTdG9yZS5mb3JFYWNoKGZ1bmN0aW9uIChyZWZEYXRhKSB7XG4gICAgdmFyIHBvcHBlciA9IHJlZkRhdGEucG9wcGVyLFxuICAgICAgICB0aXBweUluc3RhbmNlID0gcmVmRGF0YS50aXBweUluc3RhbmNlLFxuICAgICAgICBfcmVmRGF0YSRzZXR0aW5ncyA9IHJlZkRhdGEuc2V0dGluZ3MsXG4gICAgICAgIGFwcGVuZFRvID0gX3JlZkRhdGEkc2V0dGluZ3MuYXBwZW5kVG8sXG4gICAgICAgIGhpZGVPbkNsaWNrID0gX3JlZkRhdGEkc2V0dGluZ3MuaGlkZU9uQ2xpY2ssXG4gICAgICAgIHRyaWdnZXIgPSBfcmVmRGF0YSRzZXR0aW5ncy50cmlnZ2VyO1xuXG4gICAgLy8gRG9uJ3QgaGlkZSBhbHJlYWR5IGhpZGRlbiBvbmVzXG5cbiAgICBpZiAoIWFwcGVuZFRvLmNvbnRhaW5zKHBvcHBlcikpIHJldHVybjtcblxuICAgIC8vIGhpZGVPbkNsaWNrIGNhbiBoYXZlIHRoZSB0cnV0aHkgdmFsdWUgb2YgJ3BlcnNpc3RlbnQnLCBzbyBzdHJpY3QgY2hlY2sgaXMgbmVlZGVkXG4gICAgdmFyIGlzSGlkZU9uQ2xpY2sgPSBoaWRlT25DbGljayA9PT0gdHJ1ZSB8fCB0cmlnZ2VyLmluZGV4T2YoJ2ZvY3VzJykgIT09IC0xO1xuICAgIHZhciBpc05vdEN1cnJlbnRSZWYgPSAhZXhjbHVkZSB8fCBwb3BwZXIgIT09IGV4Y2x1ZGUucG9wcGVyO1xuXG4gICAgaWYgKGlzSGlkZU9uQ2xpY2sgJiYgaXNOb3RDdXJyZW50UmVmKSB7XG4gICAgICB0aXBweUluc3RhbmNlLmhpZGUocG9wcGVyKTtcbiAgICB9XG4gIH0pO1xufVxuXG52YXIgZSA9IEVsZW1lbnQucHJvdG90eXBlO1xudmFyIG1hdGNoZXMgPSBlLm1hdGNoZXMgfHwgZS5tYXRjaGVzU2VsZWN0b3IgfHwgZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgZS5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZS5tc01hdGNoZXNTZWxlY3RvciB8fCBmdW5jdGlvbiAocykge1xuICAgIHZhciBtYXRjaGVzID0gKHRoaXMuZG9jdW1lbnQgfHwgdGhpcy5vd25lckRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHMpLFxuICAgICAgICBpID0gbWF0Y2hlcy5sZW5ndGg7XG4gICAgd2hpbGUgKC0taSA+PSAwICYmIG1hdGNoZXMuaXRlbShpKSAhPT0gdGhpcykge31cbiAgICByZXR1cm4gaSA+IC0xO1xufTtcblxuLyoqXG4qIFBvbnlmaWxsIHRvIGdldCB0aGUgY2xvc2VzdCBwYXJlbnQgZWxlbWVudFxuKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBjaGlsZCBvZiBwYXJlbnQgdG8gYmUgcmV0dXJuZWRcbiogQHBhcmFtIHtTdHJpbmd9IHBhcmVudFNlbGVjdG9yIC0gc2VsZWN0b3IgdG8gbWF0Y2ggdGhlIHBhcmVudCBpZiBmb3VuZFxuKiBAcmV0dXJuIHtFbGVtZW50fVxuKi9cbmZ1bmN0aW9uIGNsb3Nlc3QoZWxlbWVudCwgcGFyZW50U2VsZWN0b3IpIHtcbiAgdmFyIF9jbG9zZXN0ID0gRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCB8fCBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICB2YXIgZWwgPSB0aGlzO1xuICAgIHdoaWxlIChlbCkge1xuICAgICAgaWYgKG1hdGNoZXMuY2FsbChlbCwgc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH1cbiAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIF9jbG9zZXN0LmNhbGwoZWxlbWVudCwgcGFyZW50U2VsZWN0b3IpO1xufVxuXG4vKipcbiogUG9ueWZpbGwgZm9yIEFycmF5LnByb3RvdHlwZS5maW5kXG4qIEBwYXJhbSB7QXJyYXl9IGFyclxuKiBAcGFyYW0ge0Z1bmN0aW9ufSBjaGVja0ZuXG4qIEByZXR1cm4gaXRlbSBpbiB0aGUgYXJyYXlcbiovXG5mdW5jdGlvbiBmaW5kKGFyciwgY2hlY2tGbikge1xuICBpZiAoQXJyYXkucHJvdG90eXBlLmZpbmQpIHtcbiAgICByZXR1cm4gYXJyLmZpbmQoY2hlY2tGbik7XG4gIH1cblxuICAvLyB1c2UgYGZpbHRlcmAgYXMgZmFsbGJhY2tcbiAgcmV0dXJuIGFyci5maWx0ZXIoY2hlY2tGbilbMF07XG59XG5cbi8qKlxuKiBBZGRzIHRoZSBuZWVkZWQgZXZlbnQgbGlzdGVuZXJzXG4qL1xuZnVuY3Rpb24gYmluZEV2ZW50TGlzdGVuZXJzKCkge1xuICB2YXIgdG91Y2hIYW5kbGVyID0gZnVuY3Rpb24gdG91Y2hIYW5kbGVyKCkge1xuICAgIEJyb3dzZXIudG91Y2ggPSB0cnVlO1xuXG4gICAgaWYgKEJyb3dzZXIuaU9TKCkpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndGlwcHktdG91Y2gnKTtcbiAgICB9XG5cbiAgICBpZiAoQnJvd3Nlci5keW5hbWljSW5wdXREZXRlY3Rpb24gJiYgd2luZG93LnBlcmZvcm1hbmNlKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmVIYW5kbGVyKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG1vdXNlbW92ZUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRpbWUgPSB2b2lkIDA7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICAvLyBDaHJvbWUgNjArIGlzIDEgbW91c2Vtb3ZlIHBlciByQUYsIHVzZSAyMG1zIHRpbWUgZGlmZmVyZW5jZVxuICAgICAgaWYgKG5vdyAtIHRpbWUgPCAyMCkge1xuICAgICAgICBCcm93c2VyLnRvdWNoID0gZmFsc2U7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZUhhbmRsZXIpO1xuICAgICAgICBpZiAoIUJyb3dzZXIuaU9TKCkpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3RpcHB5LXRvdWNoJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGltZSA9IG5vdztcbiAgICB9O1xuICB9KCk7XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIGNsaWNrSGFuZGxlcihldmVudCkge1xuICAgIC8vIFNpbXVsYXRlZCBldmVudHMgZGlzcGF0Y2hlZCBvbiB0aGUgZG9jdW1lbnRcbiAgICBpZiAoIShldmVudC50YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xuICAgICAgcmV0dXJuIGhpZGVBbGxQb3BwZXJzKCk7XG4gICAgfVxuXG4gICAgdmFyIGVsID0gY2xvc2VzdChldmVudC50YXJnZXQsIFNlbGVjdG9ycy5UT09MVElQUEVEX0VMKTtcbiAgICB2YXIgcG9wcGVyID0gY2xvc2VzdChldmVudC50YXJnZXQsIFNlbGVjdG9ycy5QT1BQRVIpO1xuXG4gICAgaWYgKHBvcHBlcikge1xuICAgICAgdmFyIHJlZiA9IGZpbmQoU3RvcmUsIGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgcmV0dXJuIHJlZi5wb3BwZXIgPT09IHBvcHBlcjtcbiAgICAgIH0pO1xuICAgICAgdmFyIGludGVyYWN0aXZlID0gcmVmLnNldHRpbmdzLmludGVyYWN0aXZlO1xuXG4gICAgICBpZiAoaW50ZXJhY3RpdmUpIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZWwpIHtcbiAgICAgIHZhciBfcmVmID0gZmluZChTdG9yZSwgZnVuY3Rpb24gKHJlZikge1xuICAgICAgICByZXR1cm4gcmVmLmVsID09PSBlbDtcbiAgICAgIH0pO1xuICAgICAgdmFyIF9yZWYkc2V0dGluZ3MgPSBfcmVmLnNldHRpbmdzLFxuICAgICAgICAgIGhpZGVPbkNsaWNrID0gX3JlZiRzZXR0aW5ncy5oaWRlT25DbGljayxcbiAgICAgICAgICBtdWx0aXBsZSA9IF9yZWYkc2V0dGluZ3MubXVsdGlwbGUsXG4gICAgICAgICAgdHJpZ2dlciA9IF9yZWYkc2V0dGluZ3MudHJpZ2dlcjtcblxuICAgICAgLy8gSGlkZSBhbGwgcG9wcGVycyBleGNlcHQgdGhlIG9uZSBiZWxvbmdpbmcgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgY2xpY2tlZCBJRlxuICAgICAgLy8gYG11bHRpcGxlYCBpcyBmYWxzZSBBTkQgdGhleSBhcmUgYSB0b3VjaCB1c2VyLCBPUlxuICAgICAgLy8gYG11bHRpcGxlYCBpcyBmYWxzZSBBTkQgaXQncyB0cmlnZ2VyZWQgYnkgYSBjbGlja1xuXG4gICAgICBpZiAoIW11bHRpcGxlICYmIEJyb3dzZXIudG91Y2ggfHwgIW11bHRpcGxlICYmIHRyaWdnZXIuaW5kZXhPZignY2xpY2snKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIGhpZGVBbGxQb3BwZXJzKF9yZWYpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBoaWRlT25DbGljayBpcyBub3Qgc3RyaWN0bHkgdHJ1ZSBvciB0cmlnZ2VyZWQgYnkgYSBjbGljayBkb24ndCBoaWRlIHBvcHBlcnNcbiAgICAgIGlmIChoaWRlT25DbGljayAhPT0gdHJ1ZSB8fCB0cmlnZ2VyLmluZGV4T2YoJ2NsaWNrJykgIT09IC0xKSByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgdHJpZ2dlciBhIGhpZGUgZm9yIHRpcHB5IGNvbnRyb2xsZXJzLCBhbmQgZG9uJ3QgbmVlZGxlc3NseSBydW4gbG9vcFxuICAgIGlmIChjbG9zZXN0KGV2ZW50LnRhcmdldCwgU2VsZWN0b3JzLkNPTlRST0xMRVIpIHx8ICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNlbGVjdG9ycy5QT1BQRVIpKSByZXR1cm47XG5cbiAgICBoaWRlQWxsUG9wcGVycygpO1xuICB9O1xuXG4gIHZhciBibHVySGFuZGxlciA9IGZ1bmN0aW9uIGJsdXJIYW5kbGVyKGV2ZW50KSB7XG4gICAgdmFyIF9kb2N1bWVudCA9IGRvY3VtZW50LFxuICAgICAgICBlbCA9IF9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgaWYgKGVsICYmIGVsLmJsdXIgJiYgbWF0Y2hlcy5jYWxsKGVsLCBTZWxlY3RvcnMuVE9PTFRJUFBFRF9FTCkpIHtcbiAgICAgIGVsLmJsdXIoKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSG9vayBldmVudHNcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdG91Y2hIYW5kbGVyKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBibHVySGFuZGxlcik7XG5cbiAgaWYgKCFCcm93c2VyLlNVUFBPUlRTX1RPVUNIICYmIChuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAwIHx8IG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMCkpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRvdWNoSGFuZGxlcik7XG4gIH1cbn1cblxuLyoqXG4qIFRvIHJ1biBhIHNpbmdsZSB0aW1lLCBvbmNlIERPTSBpcyBwcmVzdW1lZCB0byBiZSByZWFkeVxuKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIHRoZSBmdW5jdGlvbiBoYXMgcnVuIG9yIG5vdFxuKi9cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGlmIChpbml0LmRvbmUpIHJldHVybiBmYWxzZTtcbiAgaW5pdC5kb25lID0gdHJ1ZTtcblxuICBiaW5kRXZlbnRMaXN0ZW5lcnMoKTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4qIFdhaXRzIHVudGlsIG5leHQgcmVwYWludCB0byBleGVjdXRlIGEgZm5cbiogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiovXG5mdW5jdGlvbiBkZWZlcihmbikge1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgfSk7XG59XG5cbi8qKlxuKiBSZXR1cm5zIHRoZSBzdXBwb3J0ZWQgcHJlZml4ZWQgcHJvcGVydHkgLSBvbmx5IGB3ZWJraXRgIGlzIG5lZWRlZCwgYG1vemAsIGBtc2AgYW5kIGBvYCBhcmUgb2Jzb2xldGVcbiogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5XG4qIEByZXR1cm4ge1N0cmluZ30gLSBicm93c2VyIHN1cHBvcnRlZCBwcmVmaXhlZCBwcm9wZXJ0eVxuKi9cbmZ1bmN0aW9uIHByZWZpeChwcm9wZXJ0eSkge1xuICB2YXIgcHJlZml4ZXMgPSBbZmFsc2UsICd3ZWJraXQnXTtcbiAgdmFyIHVwcGVyUHJvcCA9IHByb3BlcnR5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBfcHJlZml4ID0gcHJlZml4ZXNbaV07XG4gICAgdmFyIHByZWZpeGVkUHJvcCA9IF9wcmVmaXggPyAnJyArIF9wcmVmaXggKyB1cHBlclByb3AgOiBwcm9wZXJ0eTtcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5kb2N1bWVudC5ib2R5LnN0eWxlW3ByZWZpeGVkUHJvcF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gcHJlZml4ZWRQcm9wO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiogUG9ueWZpbGwgZm9yIEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXhcbiogQHBhcmFtIHtBcnJheX0gYXJyXG4qIEBwYXJhbSB7RnVuY3Rpb259IGNoZWNrRm5cbiogQHJldHVybiBpbmRleCBvZiB0aGUgaXRlbSBpbiB0aGUgYXJyYXlcbiovXG5mdW5jdGlvbiBmaW5kSW5kZXgoYXJyLCBjaGVja0ZuKSB7XG4gIGlmIChBcnJheS5wcm90b3R5cGUuZmluZEluZGV4KSB7XG4gICAgcmV0dXJuIGFyci5maW5kSW5kZXgoY2hlY2tGbik7XG4gIH1cblxuICAvLyBmYWxsYmFja1xuICByZXR1cm4gYXJyLmluZGV4T2YoZmluZChhcnIsIGNoZWNrRm4pKTtcbn1cblxuLyoqXG4qIFJlbW92ZXMgdGhlIHRpdGxlIGZyb20gdGhlIHRvb2x0aXBwZWQgZWxlbWVudCwgc2V0dGluZyBgZGF0YS1vcmlnaW5hbC10aXRsZWBcbiogYXBwcm9wcmlhdGVseVxuKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4qL1xuZnVuY3Rpb24gcmVtb3ZlVGl0bGUoZWwpIHtcbiAgdmFyIHRpdGxlID0gZWwuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xuXG4gIC8vIE9ubHkgc2V0IGBkYXRhLW9yaWdpbmFsLXRpdGxlYCBhdHRyIGlmIHRoZXJlIGlzIGEgdGl0bGVcbiAgaWYgKHRpdGxlKSB7XG4gICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgdGl0bGUpO1xuICB9XG5cbiAgZWwucmVtb3ZlQXR0cmlidXRlKCd0aXRsZScpO1xufVxuXG4vKipcbiogRGV0ZXJtaW5lcyBpZiBhbiBlbGVtZW50IGlzIHZpc2libGUgaW4gdGhlIHZpZXdwb3J0XG4qIEBwYXJhbSB7RWxlbWVudH0gZWxcbiogQHJldHVybiB7Qm9vbGVhbn1cbiovXG5mdW5jdGlvbiBlbGVtZW50SXNJblZpZXdwb3J0KGVsKSB7XG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgcmV0dXJuIHJlY3QudG9wID49IDAgJiYgcmVjdC5sZWZ0ID49IDAgJiYgcmVjdC5ib3R0b20gPD0gKHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSAmJiByZWN0LnJpZ2h0IDw9ICh3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpO1xufVxuXG4vKipcbiogVHJpZ2dlcnMgYSBkb2N1bWVudCByZXBhaW50IG9yIHJlZmxvdyBmb3IgQ1NTIHRyYW5zaXRpb25cbiogQHBhcmFtIHtFbGVtZW50fSB0b29sdGlwXG4qIEBwYXJhbSB7RWxlbWVudH0gY2lyY2xlXG4qL1xuZnVuY3Rpb24gdHJpZ2dlclJlZmxvdyh0b29sdGlwLCBjaXJjbGUpIHtcbiAgLy8gU2FmYXJpIG5lZWRzIHRoZSBzcGVjaWZpYyAndHJhbnNmb3JtJyBwcm9wZXJ0eSB0byBiZSBhY2Nlc3NlZFxuICBjaXJjbGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShjaXJjbGUpW3ByZWZpeCgndHJhbnNmb3JtJyldIDogd2luZG93LmdldENvbXB1dGVkU3R5bGUodG9vbHRpcCkub3BhY2l0eTtcbn1cblxuLyoqXG4qIE1vZGlmaWVzIGVsZW1lbnRzJyBjbGFzcyBsaXN0c1xuKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxzIC0gQXJyYXkgb2YgZWxlbWVudHNcbiogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiovXG5mdW5jdGlvbiBtb2RpZnlDbGFzc0xpc3QoZWxzLCBjYWxsYmFjaykge1xuICBlbHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBpZiAoIWVsKSByZXR1cm47XG4gICAgY2FsbGJhY2soZWwuY2xhc3NMaXN0KTtcbiAgfSk7XG59XG5cbi8qKlxuKiBSZXR1cm5zIGlubmVyIGVsZW1lbnRzIG9mIHRoZSBwb3BwZXIgZWxlbWVudFxuKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxuKiBAcmV0dXJuIHtPYmplY3R9XG4qL1xuZnVuY3Rpb24gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpIHtcbiAgcmV0dXJuIHtcbiAgICB0b29sdGlwOiBwb3BwZXIucXVlcnlTZWxlY3RvcihTZWxlY3RvcnMuVE9PTFRJUCksXG4gICAgY2lyY2xlOiBwb3BwZXIucXVlcnlTZWxlY3RvcihTZWxlY3RvcnMuQ0lSQ0xFKSxcbiAgICBjb250ZW50OiBwb3BwZXIucXVlcnlTZWxlY3RvcihTZWxlY3RvcnMuQ09OVEVOVClcbiAgfTtcbn1cblxuLyoqXG4qIEFwcGxpZXMgdGhlIHRyYW5zaXRpb24gZHVyYXRpb24gdG8gZWFjaCBlbGVtZW50XG4qIEBwYXJhbSB7RWxlbWVudFtdfSBlbHMgLSBBcnJheSBvZiBlbGVtZW50c1xuKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiovXG5mdW5jdGlvbiBhcHBseVRyYW5zaXRpb25EdXJhdGlvbihlbHMsIGR1cmF0aW9uKSB7XG4gIGVscy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgIGlmICghZWwpIHJldHVybjtcblxuICAgIHZhciBpc0NvbnRlbnQgPSBtYXRjaGVzLmNhbGwoZWwsIFNlbGVjdG9ycy5DT05URU5UKTtcblxuICAgIHZhciBfZHVyYXRpb24gPSBpc0NvbnRlbnQgPyBNYXRoLnJvdW5kKGR1cmF0aW9uIC8gMS4zKSA6IGR1cmF0aW9uO1xuXG4gICAgZWwuc3R5bGVbcHJlZml4KCd0cmFuc2l0aW9uRHVyYXRpb24nKV0gPSBfZHVyYXRpb24gKyAnbXMnO1xuICB9KTtcbn1cblxuLyoqXG4qIERldGVybWluZXMgaWYgYSBwb3BwZXIgaXMgY3VycmVudGx5IHZpc2libGVcbiogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcbiogQHJldHVybiB7Qm9vbGVhbn1cbiovXG5mdW5jdGlvbiBpc1Zpc2libGUocG9wcGVyKSB7XG4gIHJldHVybiBwb3BwZXIuc3R5bGUudmlzaWJpbGl0eSA9PT0gJ3Zpc2libGUnO1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuLyoqXG4qIFJldHVybnMgdGhlIG5vbi1zaGlmdGVkIHBsYWNlbWVudCAoZS5nLiwgJ2JvdHRvbS1zdGFydCcgPT4gJ2JvdHRvbScpXG4qIEBwYXJhbSB7U3RyaW5nfSBwbGFjZW1lbnRcbiogQHJldHVybiB7U3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGdldENvcmVQbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQucmVwbGFjZSgvLS4rLywgJycpO1xufVxuXG4vKipcbiogTW91c2Vtb3ZlIGV2ZW50IGxpc3RlbmVyIGNhbGxiYWNrIG1ldGhvZCBmb3IgZm9sbG93IGN1cnNvciBzZXR0aW5nXG4qIEBwYXJhbSB7TW91c2VFdmVudH0gZVxuKi9cbmZ1bmN0aW9uIGZvbGxvd0N1cnNvckhhbmRsZXIoZSkge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIHZhciByZWZEYXRhID0gZmluZChTdG9yZSwgZnVuY3Rpb24gKHJlZkRhdGEpIHtcbiAgICByZXR1cm4gcmVmRGF0YS5lbCA9PT0gX3RoaXM7XG4gIH0pO1xuXG4gIHZhciBwb3BwZXIgPSByZWZEYXRhLnBvcHBlcixcbiAgICAgIG9mZnNldCA9IHJlZkRhdGEuc2V0dGluZ3Mub2Zmc2V0O1xuXG5cbiAgdmFyIHBvc2l0aW9uID0gZ2V0Q29yZVBsYWNlbWVudChwb3BwZXIuZ2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcpKTtcbiAgdmFyIGhhbGZQb3BwZXJXaWR0aCA9IE1hdGgucm91bmQocG9wcGVyLm9mZnNldFdpZHRoIC8gMik7XG4gIHZhciBoYWxmUG9wcGVySGVpZ2h0ID0gTWF0aC5yb3VuZChwb3BwZXIub2Zmc2V0SGVpZ2h0IC8gMik7XG4gIHZhciB2aWV3cG9ydFBhZGRpbmcgPSA1O1xuICB2YXIgcGFnZVdpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldFdpZHRoIHx8IGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGg7XG5cbiAgdmFyIHBhZ2VYID0gZS5wYWdlWCxcbiAgICAgIHBhZ2VZID0gZS5wYWdlWTtcblxuXG4gIHZhciB4ID0gdm9pZCAwLFxuICAgICAgeSA9IHZvaWQgMDtcblxuICBzd2l0Y2ggKHBvc2l0aW9uKSB7XG4gICAgY2FzZSAndG9wJzpcbiAgICAgIHggPSBwYWdlWCAtIGhhbGZQb3BwZXJXaWR0aCArIG9mZnNldDtcbiAgICAgIHkgPSBwYWdlWSAtIDIuMjUgKiBoYWxmUG9wcGVySGVpZ2h0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICB4ID0gcGFnZVggLSAyICogaGFsZlBvcHBlcldpZHRoIC0gMTA7XG4gICAgICB5ID0gcGFnZVkgLSBoYWxmUG9wcGVySGVpZ2h0ICsgb2Zmc2V0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmlnaHQnOlxuICAgICAgeCA9IHBhZ2VYICsgaGFsZlBvcHBlckhlaWdodDtcbiAgICAgIHkgPSBwYWdlWSAtIGhhbGZQb3BwZXJIZWlnaHQgKyBvZmZzZXQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdib3R0b20nOlxuICAgICAgeCA9IHBhZ2VYIC0gaGFsZlBvcHBlcldpZHRoICsgb2Zmc2V0O1xuICAgICAgeSA9IHBhZ2VZICsgaGFsZlBvcHBlckhlaWdodCAvIDEuNTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGlzUmlnaHRPdmVyZmxvd2luZyA9IHBhZ2VYICsgdmlld3BvcnRQYWRkaW5nICsgaGFsZlBvcHBlcldpZHRoICsgb2Zmc2V0ID4gcGFnZVdpZHRoO1xuICB2YXIgaXNMZWZ0T3ZlcmZsb3dpbmcgPSBwYWdlWCAtIHZpZXdwb3J0UGFkZGluZyAtIGhhbGZQb3BwZXJXaWR0aCArIG9mZnNldCA8IDA7XG5cbiAgLy8gUHJldmVudCBsZWZ0L3JpZ2h0IG92ZXJmbG93XG4gIGlmIChwb3NpdGlvbiA9PT0gJ3RvcCcgfHwgcG9zaXRpb24gPT09ICdib3R0b20nKSB7XG4gICAgaWYgKGlzUmlnaHRPdmVyZmxvd2luZykge1xuICAgICAgeCA9IHBhZ2VXaWR0aCAtIHZpZXdwb3J0UGFkZGluZyAtIDIgKiBoYWxmUG9wcGVyV2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGlzTGVmdE92ZXJmbG93aW5nKSB7XG4gICAgICB4ID0gdmlld3BvcnRQYWRkaW5nO1xuICAgIH1cbiAgfVxuXG4gIHBvcHBlci5zdHlsZVtwcmVmaXgoJ3RyYW5zZm9ybScpXSA9ICd0cmFuc2xhdGUzZCgnICsgeCArICdweCwgJyArIHkgKyAncHgsIDApJztcbn1cblxuLyoqXG4qIFJldHVybnMgYW4gYXJyYXkgb2YgZWxlbWVudHMgYmFzZWQgb24gdGhlIHNlbGVjdG9yIGlucHV0XG4qIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8RWxlbWVudFtdfSBzZWxlY3RvclxuKiBAcmV0dXJuIHtFbGVtZW50W119XG4qL1xuZnVuY3Rpb24gZ2V0QXJyYXlPZkVsZW1lbnRzKHNlbGVjdG9yKSB7XG4gIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICByZXR1cm4gW3NlbGVjdG9yXTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHNlbGVjdG9yKSkge1xuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxuXG4gIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbn1cblxuLyoqXG4qIFByZXBhcmVzIHRoZSBjYWxsYmFjayBmdW5jdGlvbnMgZm9yIGBzaG93YCBhbmQgYGhpZGVgIG1ldGhvZHNcbiogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4qIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZmlyZSBvbmNlIHRyYW5zaXRpb25zIGNvbXBsZXRlXG4qL1xuZnVuY3Rpb24gb25UcmFuc2l0aW9uRW5kKGRhdGEsIGR1cmF0aW9uLCBjYWxsYmFjaykge1xuICAvLyBNYWtlIGNhbGxiYWNrIHN5bmNocm9ub3VzIGlmIGR1cmF0aW9uIGlzIDBcbiAgaWYgKCFkdXJhdGlvbikge1xuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9XG5cbiAgdmFyIF9nZXRJbm5lckVsZW1lbnRzID0gZ2V0SW5uZXJFbGVtZW50cyhkYXRhLnBvcHBlciksXG4gICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHMudG9vbHRpcDtcblxuICB2YXIgdHJhbnNpdGlvbmVuZEZpcmVkID0gZmFsc2U7XG5cbiAgdmFyIGxpc3RlbmVyQ2FsbGJhY2sgPSBmdW5jdGlvbiBsaXN0ZW5lckNhbGxiYWNrKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgPT09IHRvb2x0aXAgJiYgIXRyYW5zaXRpb25lbmRGaXJlZCkge1xuICAgICAgdHJhbnNpdGlvbmVuZEZpcmVkID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEZpcmUgY2FsbGJhY2sgdXBvbiB0cmFuc2l0aW9uIGNvbXBsZXRpb25cbiAgdG9vbHRpcC5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRUcmFuc2l0aW9uRW5kJywgbGlzdGVuZXJDYWxsYmFjayk7XG4gIHRvb2x0aXAuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyQ2FsbGJhY2spO1xuXG4gIC8vIEZhbGxiYWNrOiB0cmFuc2l0aW9uZW5kIGxpc3RlbmVyIHNvbWV0aW1lcyBtYXkgbm90IGZpcmVcbiAgY2xlYXJUaW1lb3V0KGRhdGEuX3RyYW5zaXRpb25lbmRUaW1lb3V0KTtcbiAgZGF0YS5fdHJhbnNpdGlvbmVuZFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRyYW5zaXRpb25lbmRGaXJlZCkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH0sIGR1cmF0aW9uKTtcbn1cblxuLyoqIVxuICogQGZpbGVPdmVydmlldyBLaWNrYXNzIGxpYnJhcnkgdG8gY3JlYXRlIGFuZCBwbGFjZSBwb3BwZXJzIG5lYXIgdGhlaXIgcmVmZXJlbmNlIGVsZW1lbnRzLlxuICogQHZlcnNpb24gMS4xMi41XG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDE2IEZlZGVyaWNvIFppdm9sbyBhbmQgY29udHJpYnV0b3JzXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuICogY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqL1xudmFyIG5hdGl2ZUhpbnRzID0gWyduYXRpdmUgY29kZScsICdbb2JqZWN0IE11dGF0aW9uT2JzZXJ2ZXJDb25zdHJ1Y3Rvcl0nXTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBmdW5jdGlvbiBpcyBpbXBsZW1lbnRlZCBuYXRpdmVseSAoYXMgb3Bwb3NlZCB0byBhIHBvbHlmaWxsKS5cbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7RnVuY3Rpb24gfCB1bmRlZmluZWR9IGZuIHRoZSBmdW5jdGlvbiB0byBjaGVja1xuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbnZhciBpc05hdGl2ZSA9IGZ1bmN0aW9uIGlzTmF0aXZlKGZuKSB7XG4gIHJldHVybiBuYXRpdmVIaW50cy5zb21lKGZ1bmN0aW9uIChoaW50KSB7XG4gICAgcmV0dXJuIChmbiB8fCAnJykudG9TdHJpbmcoKS5pbmRleE9mKGhpbnQpID4gLTE7XG4gIH0pO1xufTtcblxudmFyIGlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xudmFyIGxvbmdlclRpbWVvdXRCcm93c2VycyA9IFsnRWRnZScsICdUcmlkZW50JywgJ0ZpcmVmb3gnXTtcbnZhciB0aW1lb3V0RHVyYXRpb24gPSAwO1xuZm9yICh2YXIgaSA9IDA7IGkgPCBsb25nZXJUaW1lb3V0QnJvd3NlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgaWYgKGlzQnJvd3NlciAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YobG9uZ2VyVGltZW91dEJyb3dzZXJzW2ldKSA+PSAwKSB7XG4gICAgdGltZW91dER1cmF0aW9uID0gMTtcbiAgICBicmVhaztcbiAgfVxufVxuXG5mdW5jdGlvbiBtaWNyb3Rhc2tEZWJvdW5jZShmbikge1xuICB2YXIgc2NoZWR1bGVkID0gZmFsc2U7XG4gIHZhciBpID0gMDtcbiAgdmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgLy8gTXV0YXRpb25PYnNlcnZlciBwcm92aWRlcyBhIG1lY2hhbmlzbSBmb3Igc2NoZWR1bGluZyBtaWNyb3Rhc2tzLCB3aGljaFxuICAvLyBhcmUgc2NoZWR1bGVkICpiZWZvcmUqIHRoZSBuZXh0IHRhc2suIFRoaXMgZ2l2ZXMgdXMgYSB3YXkgdG8gZGVib3VuY2VcbiAgLy8gYSBmdW5jdGlvbiBidXQgZW5zdXJlIGl0J3MgY2FsbGVkICpiZWZvcmUqIHRoZSBuZXh0IHBhaW50LlxuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAoKSB7XG4gICAgZm4oKTtcbiAgICBzY2hlZHVsZWQgPSBmYWxzZTtcbiAgfSk7XG5cbiAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtLCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXNjaGVkdWxlZCkge1xuICAgICAgc2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd4LWluZGV4JywgaSk7XG4gICAgICBpID0gaSArIDE7IC8vIGRvbid0IHVzZSBjb21wdW5kICgrPSkgYmVjYXVzZSBpdCBkb2Vzbid0IGdldCBvcHRpbWl6ZWQgaW4gVjhcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRhc2tEZWJvdW5jZShmbikge1xuICB2YXIgc2NoZWR1bGVkID0gZmFsc2U7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzY2hlZHVsZWQpIHtcbiAgICAgIHNjaGVkdWxlZCA9IHRydWU7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2NoZWR1bGVkID0gZmFsc2U7XG4gICAgICAgIGZuKCk7XG4gICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xuICAgIH1cbiAgfTtcbn1cblxuLy8gSXQncyBjb21tb24gZm9yIE11dGF0aW9uT2JzZXJ2ZXIgcG9seWZpbGxzIHRvIGJlIHNlZW4gaW4gdGhlIHdpbGQsIGhvd2V2ZXJcbi8vIHRoZXNlIHJlbHkgb24gTXV0YXRpb24gRXZlbnRzIHdoaWNoIG9ubHkgb2NjdXIgd2hlbiBhbiBlbGVtZW50IGlzIGNvbm5lY3RlZFxuLy8gdG8gdGhlIERPTS4gVGhlIGFsZ29yaXRobSB1c2VkIGluIHRoaXMgbW9kdWxlIGRvZXMgbm90IHVzZSBhIGNvbm5lY3RlZCBlbGVtZW50LFxuLy8gYW5kIHNvIHdlIG11c3QgZW5zdXJlIHRoYXQgYSAqbmF0aXZlKiBNdXRhdGlvbk9ic2VydmVyIGlzIGF2YWlsYWJsZS5cbnZhciBzdXBwb3J0c05hdGl2ZU11dGF0aW9uT2JzZXJ2ZXIgPSBpc0Jyb3dzZXIgJiYgaXNOYXRpdmUod2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIpO1xuXG4vKipcbiogQ3JlYXRlIGEgZGVib3VuY2VkIHZlcnNpb24gb2YgYSBtZXRob2QsIHRoYXQncyBhc3luY2hyb25vdXNseSBkZWZlcnJlZFxuKiBidXQgY2FsbGVkIGluIHRoZSBtaW5pbXVtIHRpbWUgcG9zc2libGUuXG4qXG4qIEBtZXRob2RcbiogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuKiBAYXJndW1lbnQge0Z1bmN0aW9ufSBmblxuKiBAcmV0dXJucyB7RnVuY3Rpb259XG4qL1xudmFyIGRlYm91bmNlID0gc3VwcG9ydHNOYXRpdmVNdXRhdGlvbk9ic2VydmVyID8gbWljcm90YXNrRGVib3VuY2UgOiB0YXNrRGVib3VuY2U7XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGEgZnVuY3Rpb25cbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7QW55fSBmdW5jdGlvblRvQ2hlY2sgLSB2YXJpYWJsZSB0byBjaGVja1xuICogQHJldHVybnMge0Jvb2xlYW59IGFuc3dlciB0bzogaXMgYSBmdW5jdGlvbj9cbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcbiAgdmFyIGdldFR5cGUgPSB7fTtcbiAgcmV0dXJuIGZ1bmN0aW9uVG9DaGVjayAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwoZnVuY3Rpb25Ub0NoZWNrKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBHZXQgQ1NTIGNvbXB1dGVkIHByb3BlcnR5IG9mIHRoZSBnaXZlbiBlbGVtZW50XG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge0VlbWVudH0gZWxlbWVudFxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHByb3BlcnR5XG4gKi9cbmZ1bmN0aW9uIGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbGVtZW50LCBwcm9wZXJ0eSkge1xuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICAvLyBOT1RFOiAxIERPTSBhY2Nlc3MgaGVyZVxuICB2YXIgY3NzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7XG4gIHJldHVybiBwcm9wZXJ0eSA/IGNzc1twcm9wZXJ0eV0gOiBjc3M7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcGFyZW50Tm9kZSBvciB0aGUgaG9zdCBvZiB0aGUgZWxlbWVudFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudH0gcGFyZW50XG4gKi9cbmZ1bmN0aW9uIGdldFBhcmVudE5vZGUoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZSB8fCBlbGVtZW50Lmhvc3Q7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc2Nyb2xsaW5nIHBhcmVudCBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudH0gc2Nyb2xsIHBhcmVudFxuICovXG5mdW5jdGlvbiBnZXRTY3JvbGxQYXJlbnQoZWxlbWVudCkge1xuICAvLyBSZXR1cm4gYm9keSwgYGdldFNjcm9sbGAgd2lsbCB0YWtlIGNhcmUgdG8gZ2V0IHRoZSBjb3JyZWN0IGBzY3JvbGxUb3BgIGZyb20gaXRcbiAgaWYgKCFlbGVtZW50IHx8IFsnSFRNTCcsICdCT0RZJywgJyNkb2N1bWVudCddLmluZGV4T2YoZWxlbWVudC5ub2RlTmFtZSkgIT09IC0xKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5kb2N1bWVudC5ib2R5O1xuICB9XG5cbiAgLy8gRmlyZWZveCB3YW50IHVzIHRvIGNoZWNrIGAteGAgYW5kIGAteWAgdmFyaWF0aW9ucyBhcyB3ZWxsXG5cbiAgdmFyIF9nZXRTdHlsZUNvbXB1dGVkUHJvcCA9IGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbGVtZW50KSxcbiAgICAgIG92ZXJmbG93ID0gX2dldFN0eWxlQ29tcHV0ZWRQcm9wLm92ZXJmbG93LFxuICAgICAgb3ZlcmZsb3dYID0gX2dldFN0eWxlQ29tcHV0ZWRQcm9wLm92ZXJmbG93WCxcbiAgICAgIG92ZXJmbG93WSA9IF9nZXRTdHlsZUNvbXB1dGVkUHJvcC5vdmVyZmxvd1k7XG5cbiAgaWYgKC8oYXV0b3xzY3JvbGwpLy50ZXN0KG92ZXJmbG93ICsgb3ZlcmZsb3dZICsgb3ZlcmZsb3dYKSkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuIGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvZmZzZXQgcGFyZW50IG9mIHRoZSBnaXZlbiBlbGVtZW50XG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBvZmZzZXQgcGFyZW50XG4gKi9cbmZ1bmN0aW9uIGdldE9mZnNldFBhcmVudChlbGVtZW50KSB7XG4gIC8vIE5PVEU6IDEgRE9NIGFjY2VzcyBoZXJlXG4gIHZhciBvZmZzZXRQYXJlbnQgPSBlbGVtZW50ICYmIGVsZW1lbnQub2Zmc2V0UGFyZW50O1xuICB2YXIgbm9kZU5hbWUgPSBvZmZzZXRQYXJlbnQgJiYgb2Zmc2V0UGFyZW50Lm5vZGVOYW1lO1xuXG4gIGlmICghbm9kZU5hbWUgfHwgbm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIH1cblxuICAvLyAub2Zmc2V0UGFyZW50IHdpbGwgcmV0dXJuIHRoZSBjbG9zZXN0IFREIG9yIFRBQkxFIGluIGNhc2VcbiAgLy8gbm8gb2Zmc2V0UGFyZW50IGlzIHByZXNlbnQsIEkgaGF0ZSB0aGlzIGpvYi4uLlxuICBpZiAoWydURCcsICdUQUJMRSddLmluZGV4T2Yob2Zmc2V0UGFyZW50Lm5vZGVOYW1lKSAhPT0gLTEgJiYgZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KG9mZnNldFBhcmVudCwgJ3Bvc2l0aW9uJykgPT09ICdzdGF0aWMnKSB7XG4gICAgcmV0dXJuIGdldE9mZnNldFBhcmVudChvZmZzZXRQYXJlbnQpO1xuICB9XG5cbiAgcmV0dXJuIG9mZnNldFBhcmVudDtcbn1cblxuZnVuY3Rpb24gaXNPZmZzZXRDb250YWluZXIoZWxlbWVudCkge1xuICB2YXIgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lO1xuXG4gIGlmIChub2RlTmFtZSA9PT0gJ0JPRFknKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBub2RlTmFtZSA9PT0gJ0hUTUwnIHx8IGdldE9mZnNldFBhcmVudChlbGVtZW50LmZpcnN0RWxlbWVudENoaWxkKSA9PT0gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgcm9vdCBub2RlIChkb2N1bWVudCwgc2hhZG93RE9NIHJvb3QpIG9mIHRoZSBnaXZlbiBlbGVtZW50XG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IG5vZGVcbiAqIEByZXR1cm5zIHtFbGVtZW50fSByb290IG5vZGVcbiAqL1xuZnVuY3Rpb24gZ2V0Um9vdChub2RlKSB7XG4gIGlmIChub2RlLnBhcmVudE5vZGUgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZ2V0Um9vdChub2RlLnBhcmVudE5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbi8qKlxuICogRmluZHMgdGhlIG9mZnNldCBwYXJlbnQgY29tbW9uIHRvIHRoZSB0d28gcHJvdmlkZWQgbm9kZXNcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudDFcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudDJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBjb21tb24gb2Zmc2V0IHBhcmVudFxuICovXG5mdW5jdGlvbiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KGVsZW1lbnQxLCBlbGVtZW50Mikge1xuICAvLyBUaGlzIGNoZWNrIGlzIG5lZWRlZCB0byBhdm9pZCBlcnJvcnMgaW4gY2FzZSBvbmUgb2YgdGhlIGVsZW1lbnRzIGlzbid0IGRlZmluZWQgZm9yIGFueSByZWFzb25cbiAgaWYgKCFlbGVtZW50MSB8fCAhZWxlbWVudDEubm9kZVR5cGUgfHwgIWVsZW1lbnQyIHx8ICFlbGVtZW50Mi5ub2RlVHlwZSkge1xuICAgIHJldHVybiB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9XG5cbiAgLy8gSGVyZSB3ZSBtYWtlIHN1cmUgdG8gZ2l2ZSBhcyBcInN0YXJ0XCIgdGhlIGVsZW1lbnQgdGhhdCBjb21lcyBmaXJzdCBpbiB0aGUgRE9NXG4gIHZhciBvcmRlciA9IGVsZW1lbnQxLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGVsZW1lbnQyKSAmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fRk9MTE9XSU5HO1xuICB2YXIgc3RhcnQgPSBvcmRlciA/IGVsZW1lbnQxIDogZWxlbWVudDI7XG4gIHZhciBlbmQgPSBvcmRlciA/IGVsZW1lbnQyIDogZWxlbWVudDE7XG5cbiAgLy8gR2V0IGNvbW1vbiBhbmNlc3RvciBjb250YWluZXJcbiAgdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgcmFuZ2Uuc2V0U3RhcnQoc3RhcnQsIDApO1xuICByYW5nZS5zZXRFbmQoZW5kLCAwKTtcbiAgdmFyIGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyID0gcmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG5cbiAgLy8gQm90aCBub2RlcyBhcmUgaW5zaWRlICNkb2N1bWVudFxuXG4gIGlmIChlbGVtZW50MSAhPT0gY29tbW9uQW5jZXN0b3JDb250YWluZXIgJiYgZWxlbWVudDIgIT09IGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyIHx8IHN0YXJ0LmNvbnRhaW5zKGVuZCkpIHtcbiAgICBpZiAoaXNPZmZzZXRDb250YWluZXIoY29tbW9uQW5jZXN0b3JDb250YWluZXIpKSB7XG4gICAgICByZXR1cm4gY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldE9mZnNldFBhcmVudChjb21tb25BbmNlc3RvckNvbnRhaW5lcik7XG4gIH1cblxuICAvLyBvbmUgb2YgdGhlIG5vZGVzIGlzIGluc2lkZSBzaGFkb3dET00sIGZpbmQgd2hpY2ggb25lXG4gIHZhciBlbGVtZW50MXJvb3QgPSBnZXRSb290KGVsZW1lbnQxKTtcbiAgaWYgKGVsZW1lbnQxcm9vdC5ob3N0KSB7XG4gICAgcmV0dXJuIGZpbmRDb21tb25PZmZzZXRQYXJlbnQoZWxlbWVudDFyb290Lmhvc3QsIGVsZW1lbnQyKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmluZENvbW1vbk9mZnNldFBhcmVudChlbGVtZW50MSwgZ2V0Um9vdChlbGVtZW50MikuaG9zdCk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBzY3JvbGwgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQgaW4gdGhlIGdpdmVuIHNpZGUgKHRvcCBhbmQgbGVmdClcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHNpZGUgYHRvcGAgb3IgYGxlZnRgXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBhbW91bnQgb2Ygc2Nyb2xsZWQgcGl4ZWxzXG4gKi9cbmZ1bmN0aW9uIGdldFNjcm9sbChlbGVtZW50KSB7XG4gIHZhciBzaWRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAndG9wJztcblxuICB2YXIgdXBwZXJTaWRlID0gc2lkZSA9PT0gJ3RvcCcgPyAnc2Nyb2xsVG9wJyA6ICdzY3JvbGxMZWZ0JztcbiAgdmFyIG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZTtcblxuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgdmFyIGh0bWwgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHZhciBzY3JvbGxpbmdFbGVtZW50ID0gd2luZG93LmRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQgfHwgaHRtbDtcbiAgICByZXR1cm4gc2Nyb2xsaW5nRWxlbWVudFt1cHBlclNpZGVdO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRbdXBwZXJTaWRlXTtcbn1cblxuLypcbiAqIFN1bSBvciBzdWJ0cmFjdCB0aGUgZWxlbWVudCBzY3JvbGwgdmFsdWVzIChsZWZ0IGFuZCB0b3ApIGZyb20gYSBnaXZlbiByZWN0IG9iamVjdFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQHBhcmFtIHtPYmplY3R9IHJlY3QgLSBSZWN0IG9iamVjdCB5b3Ugd2FudCB0byBjaGFuZ2VcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZWxlbWVudCBmcm9tIHRoZSBmdW5jdGlvbiByZWFkcyB0aGUgc2Nyb2xsIHZhbHVlc1xuICogQHBhcmFtIHtCb29sZWFufSBzdWJ0cmFjdCAtIHNldCB0byB0cnVlIGlmIHlvdSB3YW50IHRvIHN1YnRyYWN0IHRoZSBzY3JvbGwgdmFsdWVzXG4gKiBAcmV0dXJuIHtPYmplY3R9IHJlY3QgLSBUaGUgbW9kaWZpZXIgcmVjdCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gaW5jbHVkZVNjcm9sbChyZWN0LCBlbGVtZW50KSB7XG4gIHZhciBzdWJ0cmFjdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG5cbiAgdmFyIHNjcm9sbFRvcCA9IGdldFNjcm9sbChlbGVtZW50LCAndG9wJyk7XG4gIHZhciBzY3JvbGxMZWZ0ID0gZ2V0U2Nyb2xsKGVsZW1lbnQsICdsZWZ0Jyk7XG4gIHZhciBtb2RpZmllciA9IHN1YnRyYWN0ID8gLTEgOiAxO1xuICByZWN0LnRvcCArPSBzY3JvbGxUb3AgKiBtb2RpZmllcjtcbiAgcmVjdC5ib3R0b20gKz0gc2Nyb2xsVG9wICogbW9kaWZpZXI7XG4gIHJlY3QubGVmdCArPSBzY3JvbGxMZWZ0ICogbW9kaWZpZXI7XG4gIHJlY3QucmlnaHQgKz0gc2Nyb2xsTGVmdCAqIG1vZGlmaWVyO1xuICByZXR1cm4gcmVjdDtcbn1cblxuLypcbiAqIEhlbHBlciB0byBkZXRlY3QgYm9yZGVycyBvZiBhIGdpdmVuIGVsZW1lbnRcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBwYXJhbSB7Q1NTU3R5bGVEZWNsYXJhdGlvbn0gc3R5bGVzXG4gKiBSZXN1bHQgb2YgYGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eWAgb24gdGhlIGdpdmVuIGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBheGlzIC0gYHhgIG9yIGB5YFxuICogQHJldHVybiB7bnVtYmVyfSBib3JkZXJzIC0gVGhlIGJvcmRlcnMgc2l6ZSBvZiB0aGUgZ2l2ZW4gYXhpc1xuICovXG5cbmZ1bmN0aW9uIGdldEJvcmRlcnNTaXplKHN0eWxlcywgYXhpcykge1xuICB2YXIgc2lkZUEgPSBheGlzID09PSAneCcgPyAnTGVmdCcgOiAnVG9wJztcbiAgdmFyIHNpZGVCID0gc2lkZUEgPT09ICdMZWZ0JyA/ICdSaWdodCcgOiAnQm90dG9tJztcblxuICByZXR1cm4gK3N0eWxlc1snYm9yZGVyJyArIHNpZGVBICsgJ1dpZHRoJ10uc3BsaXQoJ3B4JylbMF0gKyArc3R5bGVzWydib3JkZXInICsgc2lkZUIgKyAnV2lkdGgnXS5zcGxpdCgncHgnKVswXTtcbn1cblxuLyoqXG4gKiBUZWxscyBpZiB5b3UgYXJlIHJ1bm5pbmcgSW50ZXJuZXQgRXhwbG9yZXIgMTBcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEByZXR1cm5zIHtCb29sZWFufSBpc0lFMTBcbiAqL1xudmFyIGlzSUUxMCA9IHVuZGVmaW5lZDtcblxudmFyIGlzSUUxMCQxID0gZnVuY3Rpb24gaXNJRTEwJDEoKSB7XG4gIGlmIChpc0lFMTAgPT09IHVuZGVmaW5lZCkge1xuICAgIGlzSUUxMCA9IG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoJ01TSUUgMTAnKSAhPT0gLTE7XG4gIH1cbiAgcmV0dXJuIGlzSUUxMDtcbn07XG5cbmZ1bmN0aW9uIGdldFNpemUoYXhpcywgYm9keSwgaHRtbCwgY29tcHV0ZWRTdHlsZSkge1xuICByZXR1cm4gTWF0aC5tYXgoYm9keVsnb2Zmc2V0JyArIGF4aXNdLCBib2R5WydzY3JvbGwnICsgYXhpc10sIGh0bWxbJ2NsaWVudCcgKyBheGlzXSwgaHRtbFsnb2Zmc2V0JyArIGF4aXNdLCBodG1sWydzY3JvbGwnICsgYXhpc10sIGlzSUUxMCQxKCkgPyBodG1sWydvZmZzZXQnICsgYXhpc10gKyBjb21wdXRlZFN0eWxlWydtYXJnaW4nICsgKGF4aXMgPT09ICdIZWlnaHQnID8gJ1RvcCcgOiAnTGVmdCcpXSArIGNvbXB1dGVkU3R5bGVbJ21hcmdpbicgKyAoYXhpcyA9PT0gJ0hlaWdodCcgPyAnQm90dG9tJyA6ICdSaWdodCcpXSA6IDApO1xufVxuXG5mdW5jdGlvbiBnZXRXaW5kb3dTaXplcygpIHtcbiAgdmFyIGJvZHkgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTtcbiAgdmFyIGh0bWwgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB2YXIgY29tcHV0ZWRTdHlsZSA9IGlzSUUxMCQxKCkgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaHRtbCk7XG5cbiAgcmV0dXJuIHtcbiAgICBoZWlnaHQ6IGdldFNpemUoJ0hlaWdodCcsIGJvZHksIGh0bWwsIGNvbXB1dGVkU3R5bGUpLFxuICAgIHdpZHRoOiBnZXRTaXplKCdXaWR0aCcsIGJvZHksIGh0bWwsIGNvbXB1dGVkU3R5bGUpXG4gIH07XG59XG5cbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIGNsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbnZhciBjcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0oKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG4vKipcbiAqIEdpdmVuIGVsZW1lbnQgb2Zmc2V0cywgZ2VuZXJhdGUgYW4gb3V0cHV0IHNpbWlsYXIgdG8gZ2V0Qm91bmRpbmdDbGllbnRSZWN0XG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge09iamVjdH0gb2Zmc2V0c1xuICogQHJldHVybnMge09iamVjdH0gQ2xpZW50UmVjdCBsaWtlIG91dHB1dFxuICovXG5mdW5jdGlvbiBnZXRDbGllbnRSZWN0KG9mZnNldHMpIHtcbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBvZmZzZXRzLCB7XG4gICAgcmlnaHQ6IG9mZnNldHMubGVmdCArIG9mZnNldHMud2lkdGgsXG4gICAgYm90dG9tOiBvZmZzZXRzLnRvcCArIG9mZnNldHMuaGVpZ2h0XG4gIH0pO1xufVxuXG4vKipcbiAqIEdldCBib3VuZGluZyBjbGllbnQgcmVjdCBvZiBnaXZlbiBlbGVtZW50XG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJuIHtPYmplY3R9IGNsaWVudCByZWN0XG4gKi9cbmZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KSB7XG4gIHZhciByZWN0ID0ge307XG5cbiAgLy8gSUUxMCAxMCBGSVg6IFBsZWFzZSwgZG9uJ3QgYXNrLCB0aGUgZWxlbWVudCBpc24ndFxuICAvLyBjb25zaWRlcmVkIGluIERPTSBpbiBzb21lIGNpcmN1bXN0YW5jZXMuLi5cbiAgLy8gVGhpcyBpc24ndCByZXByb2R1Y2libGUgaW4gSUUxMCBjb21wYXRpYmlsaXR5IG1vZGUgb2YgSUUxMVxuICBpZiAoaXNJRTEwJDEoKSkge1xuICAgIHRyeSB7XG4gICAgICByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ3RvcCcpO1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ2xlZnQnKTtcbiAgICAgIHJlY3QudG9wICs9IHNjcm9sbFRvcDtcbiAgICAgIHJlY3QubGVmdCArPSBzY3JvbGxMZWZ0O1xuICAgICAgcmVjdC5ib3R0b20gKz0gc2Nyb2xsVG9wO1xuICAgICAgcmVjdC5yaWdodCArPSBzY3JvbGxMZWZ0O1xuICAgIH0gY2F0Y2ggKGVycikge31cbiAgfSBlbHNlIHtcbiAgICByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSB7XG4gICAgbGVmdDogcmVjdC5sZWZ0LFxuICAgIHRvcDogcmVjdC50b3AsXG4gICAgd2lkdGg6IHJlY3QucmlnaHQgLSByZWN0LmxlZnQsXG4gICAgaGVpZ2h0OiByZWN0LmJvdHRvbSAtIHJlY3QudG9wXG4gIH07XG5cbiAgLy8gc3VidHJhY3Qgc2Nyb2xsYmFyIHNpemUgZnJvbSBzaXplc1xuICB2YXIgc2l6ZXMgPSBlbGVtZW50Lm5vZGVOYW1lID09PSAnSFRNTCcgPyBnZXRXaW5kb3dTaXplcygpIDoge307XG4gIHZhciB3aWR0aCA9IHNpemVzLndpZHRoIHx8IGVsZW1lbnQuY2xpZW50V2lkdGggfHwgcmVzdWx0LnJpZ2h0IC0gcmVzdWx0LmxlZnQ7XG4gIHZhciBoZWlnaHQgPSBzaXplcy5oZWlnaHQgfHwgZWxlbWVudC5jbGllbnRIZWlnaHQgfHwgcmVzdWx0LmJvdHRvbSAtIHJlc3VsdC50b3A7XG5cbiAgdmFyIGhvcml6U2Nyb2xsYmFyID0gZWxlbWVudC5vZmZzZXRXaWR0aCAtIHdpZHRoO1xuICB2YXIgdmVydFNjcm9sbGJhciA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gaGVpZ2h0O1xuXG4gIC8vIGlmIGFuIGh5cG90aGV0aWNhbCBzY3JvbGxiYXIgaXMgZGV0ZWN0ZWQsIHdlIG11c3QgYmUgc3VyZSBpdCdzIG5vdCBhIGBib3JkZXJgXG4gIC8vIHdlIG1ha2UgdGhpcyBjaGVjayBjb25kaXRpb25hbCBmb3IgcGVyZm9ybWFuY2UgcmVhc29uc1xuICBpZiAoaG9yaXpTY3JvbGxiYXIgfHwgdmVydFNjcm9sbGJhcikge1xuICAgIHZhciBzdHlsZXMgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCk7XG4gICAgaG9yaXpTY3JvbGxiYXIgLT0gZ2V0Qm9yZGVyc1NpemUoc3R5bGVzLCAneCcpO1xuICAgIHZlcnRTY3JvbGxiYXIgLT0gZ2V0Qm9yZGVyc1NpemUoc3R5bGVzLCAneScpO1xuXG4gICAgcmVzdWx0LndpZHRoIC09IGhvcml6U2Nyb2xsYmFyO1xuICAgIHJlc3VsdC5oZWlnaHQgLT0gdmVydFNjcm9sbGJhcjtcbiAgfVxuXG4gIHJldHVybiBnZXRDbGllbnRSZWN0KHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShjaGlsZHJlbiwgcGFyZW50KSB7XG4gIHZhciBpc0lFMTAgPSBpc0lFMTAkMSgpO1xuICB2YXIgaXNIVE1MID0gcGFyZW50Lm5vZGVOYW1lID09PSAnSFRNTCc7XG4gIHZhciBjaGlsZHJlblJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoY2hpbGRyZW4pO1xuICB2YXIgcGFyZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChwYXJlbnQpO1xuICB2YXIgc2Nyb2xsUGFyZW50ID0gZ2V0U2Nyb2xsUGFyZW50KGNoaWxkcmVuKTtcblxuICB2YXIgc3R5bGVzID0gZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KHBhcmVudCk7XG4gIHZhciBib3JkZXJUb3BXaWR0aCA9ICtzdHlsZXMuYm9yZGVyVG9wV2lkdGguc3BsaXQoJ3B4JylbMF07XG4gIHZhciBib3JkZXJMZWZ0V2lkdGggPSArc3R5bGVzLmJvcmRlckxlZnRXaWR0aC5zcGxpdCgncHgnKVswXTtcblxuICB2YXIgb2Zmc2V0cyA9IGdldENsaWVudFJlY3Qoe1xuICAgIHRvcDogY2hpbGRyZW5SZWN0LnRvcCAtIHBhcmVudFJlY3QudG9wIC0gYm9yZGVyVG9wV2lkdGgsXG4gICAgbGVmdDogY2hpbGRyZW5SZWN0LmxlZnQgLSBwYXJlbnRSZWN0LmxlZnQgLSBib3JkZXJMZWZ0V2lkdGgsXG4gICAgd2lkdGg6IGNoaWxkcmVuUmVjdC53aWR0aCxcbiAgICBoZWlnaHQ6IGNoaWxkcmVuUmVjdC5oZWlnaHRcbiAgfSk7XG4gIG9mZnNldHMubWFyZ2luVG9wID0gMDtcbiAgb2Zmc2V0cy5tYXJnaW5MZWZ0ID0gMDtcblxuICAvLyBTdWJ0cmFjdCBtYXJnaW5zIG9mIGRvY3VtZW50RWxlbWVudCBpbiBjYXNlIGl0J3MgYmVpbmcgdXNlZCBhcyBwYXJlbnRcbiAgLy8gd2UgZG8gdGhpcyBvbmx5IG9uIEhUTUwgYmVjYXVzZSBpdCdzIHRoZSBvbmx5IGVsZW1lbnQgdGhhdCBiZWhhdmVzXG4gIC8vIGRpZmZlcmVudGx5IHdoZW4gbWFyZ2lucyBhcmUgYXBwbGllZCB0byBpdC4gVGhlIG1hcmdpbnMgYXJlIGluY2x1ZGVkIGluXG4gIC8vIHRoZSBib3ggb2YgdGhlIGRvY3VtZW50RWxlbWVudCwgaW4gdGhlIG90aGVyIGNhc2VzIG5vdC5cbiAgaWYgKCFpc0lFMTAgJiYgaXNIVE1MKSB7XG4gICAgdmFyIG1hcmdpblRvcCA9ICtzdHlsZXMubWFyZ2luVG9wLnNwbGl0KCdweCcpWzBdO1xuICAgIHZhciBtYXJnaW5MZWZ0ID0gK3N0eWxlcy5tYXJnaW5MZWZ0LnNwbGl0KCdweCcpWzBdO1xuXG4gICAgb2Zmc2V0cy50b3AgLT0gYm9yZGVyVG9wV2lkdGggLSBtYXJnaW5Ub3A7XG4gICAgb2Zmc2V0cy5ib3R0b20gLT0gYm9yZGVyVG9wV2lkdGggLSBtYXJnaW5Ub3A7XG4gICAgb2Zmc2V0cy5sZWZ0IC09IGJvcmRlckxlZnRXaWR0aCAtIG1hcmdpbkxlZnQ7XG4gICAgb2Zmc2V0cy5yaWdodCAtPSBib3JkZXJMZWZ0V2lkdGggLSBtYXJnaW5MZWZ0O1xuXG4gICAgLy8gQXR0YWNoIG1hcmdpblRvcCBhbmQgbWFyZ2luTGVmdCBiZWNhdXNlIGluIHNvbWUgY2lyY3Vtc3RhbmNlcyB3ZSBtYXkgbmVlZCB0aGVtXG4gICAgb2Zmc2V0cy5tYXJnaW5Ub3AgPSBtYXJnaW5Ub3A7XG4gICAgb2Zmc2V0cy5tYXJnaW5MZWZ0ID0gbWFyZ2luTGVmdDtcbiAgfVxuXG4gIGlmIChpc0lFMTAgPyBwYXJlbnQuY29udGFpbnMoc2Nyb2xsUGFyZW50KSA6IHBhcmVudCA9PT0gc2Nyb2xsUGFyZW50ICYmIHNjcm9sbFBhcmVudC5ub2RlTmFtZSAhPT0gJ0JPRFknKSB7XG4gICAgb2Zmc2V0cyA9IGluY2x1ZGVTY3JvbGwob2Zmc2V0cywgcGFyZW50KTtcbiAgfVxuXG4gIHJldHVybiBvZmZzZXRzO1xufVxuXG5mdW5jdGlvbiBnZXRWaWV3cG9ydE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJ0Yml0cmFyeU5vZGUoZWxlbWVudCkge1xuICB2YXIgaHRtbCA9IHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIHZhciByZWxhdGl2ZU9mZnNldCA9IGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShlbGVtZW50LCBodG1sKTtcbiAgdmFyIHdpZHRoID0gTWF0aC5tYXgoaHRtbC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XG4gIHZhciBoZWlnaHQgPSBNYXRoLm1heChodG1sLmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApO1xuXG4gIHZhciBzY3JvbGxUb3AgPSBnZXRTY3JvbGwoaHRtbCk7XG4gIHZhciBzY3JvbGxMZWZ0ID0gZ2V0U2Nyb2xsKGh0bWwsICdsZWZ0Jyk7XG5cbiAgdmFyIG9mZnNldCA9IHtcbiAgICB0b3A6IHNjcm9sbFRvcCAtIHJlbGF0aXZlT2Zmc2V0LnRvcCArIHJlbGF0aXZlT2Zmc2V0Lm1hcmdpblRvcCxcbiAgICBsZWZ0OiBzY3JvbGxMZWZ0IC0gcmVsYXRpdmVPZmZzZXQubGVmdCArIHJlbGF0aXZlT2Zmc2V0Lm1hcmdpbkxlZnQsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH07XG5cbiAgcmV0dXJuIGdldENsaWVudFJlY3Qob2Zmc2V0KTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBmaXhlZCBvciBpcyBpbnNpZGUgYSBmaXhlZCBwYXJlbnRcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBjdXN0b21Db250YWluZXJcbiAqIEByZXR1cm5zIHtCb29sZWFufSBhbnN3ZXIgdG8gXCJpc0ZpeGVkP1wiXG4gKi9cbmZ1bmN0aW9uIGlzRml4ZWQoZWxlbWVudCkge1xuICB2YXIgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lO1xuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCwgJ3Bvc2l0aW9uJykgPT09ICdmaXhlZCcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gaXNGaXhlZChnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcbn1cblxuLyoqXG4gKiBDb21wdXRlZCB0aGUgYm91bmRhcmllcyBsaW1pdHMgYW5kIHJldHVybiB0aGVtXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJlZmVyZW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmdcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJvdW5kYXJpZXNFbGVtZW50IC0gRWxlbWVudCB1c2VkIHRvIGRlZmluZSB0aGUgYm91bmRhcmllc1xuICogQHJldHVybnMge09iamVjdH0gQ29vcmRpbmF0ZXMgb2YgdGhlIGJvdW5kYXJpZXNcbiAqL1xuZnVuY3Rpb24gZ2V0Qm91bmRhcmllcyhwb3BwZXIsIHJlZmVyZW5jZSwgcGFkZGluZywgYm91bmRhcmllc0VsZW1lbnQpIHtcbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcbiAgdmFyIGJvdW5kYXJpZXMgPSB7IHRvcDogMCwgbGVmdDogMCB9O1xuICB2YXIgb2Zmc2V0UGFyZW50ID0gZmluZENvbW1vbk9mZnNldFBhcmVudChwb3BwZXIsIHJlZmVyZW5jZSk7XG5cbiAgLy8gSGFuZGxlIHZpZXdwb3J0IGNhc2VcbiAgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAndmlld3BvcnQnKSB7XG4gICAgYm91bmRhcmllcyA9IGdldFZpZXdwb3J0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcnRiaXRyYXJ5Tm9kZShvZmZzZXRQYXJlbnQpO1xuICB9IGVsc2Uge1xuICAgIC8vIEhhbmRsZSBvdGhlciBjYXNlcyBiYXNlZCBvbiBET00gZWxlbWVudCB1c2VkIGFzIGJvdW5kYXJpZXNcbiAgICB2YXIgYm91bmRhcmllc05vZGUgPSB2b2lkIDA7XG4gICAgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAnc2Nyb2xsUGFyZW50Jykge1xuICAgICAgYm91bmRhcmllc05vZGUgPSBnZXRTY3JvbGxQYXJlbnQoZ2V0UGFyZW50Tm9kZShwb3BwZXIpKTtcbiAgICAgIGlmIChib3VuZGFyaWVzTm9kZS5ub2RlTmFtZSA9PT0gJ0JPRFknKSB7XG4gICAgICAgIGJvdW5kYXJpZXNOb2RlID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAnd2luZG93Jykge1xuICAgICAgYm91bmRhcmllc05vZGUgPSB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICBib3VuZGFyaWVzTm9kZSA9IGJvdW5kYXJpZXNFbGVtZW50O1xuICAgIH1cblxuICAgIHZhciBvZmZzZXRzID0gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKGJvdW5kYXJpZXNOb2RlLCBvZmZzZXRQYXJlbnQpO1xuXG4gICAgLy8gSW4gY2FzZSBvZiBIVE1MLCB3ZSBuZWVkIGEgZGlmZmVyZW50IGNvbXB1dGF0aW9uXG4gICAgaWYgKGJvdW5kYXJpZXNOb2RlLm5vZGVOYW1lID09PSAnSFRNTCcgJiYgIWlzRml4ZWQob2Zmc2V0UGFyZW50KSkge1xuICAgICAgdmFyIF9nZXRXaW5kb3dTaXplcyA9IGdldFdpbmRvd1NpemVzKCksXG4gICAgICAgICAgaGVpZ2h0ID0gX2dldFdpbmRvd1NpemVzLmhlaWdodCxcbiAgICAgICAgICB3aWR0aCA9IF9nZXRXaW5kb3dTaXplcy53aWR0aDtcblxuICAgICAgYm91bmRhcmllcy50b3AgKz0gb2Zmc2V0cy50b3AgLSBvZmZzZXRzLm1hcmdpblRvcDtcbiAgICAgIGJvdW5kYXJpZXMuYm90dG9tID0gaGVpZ2h0ICsgb2Zmc2V0cy50b3A7XG4gICAgICBib3VuZGFyaWVzLmxlZnQgKz0gb2Zmc2V0cy5sZWZ0IC0gb2Zmc2V0cy5tYXJnaW5MZWZ0O1xuICAgICAgYm91bmRhcmllcy5yaWdodCA9IHdpZHRoICsgb2Zmc2V0cy5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBmb3IgYWxsIHRoZSBvdGhlciBET00gZWxlbWVudHMsIHRoaXMgb25lIGlzIGdvb2RcbiAgICAgIGJvdW5kYXJpZXMgPSBvZmZzZXRzO1xuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCBwYWRkaW5nc1xuICBib3VuZGFyaWVzLmxlZnQgKz0gcGFkZGluZztcbiAgYm91bmRhcmllcy50b3AgKz0gcGFkZGluZztcbiAgYm91bmRhcmllcy5yaWdodCAtPSBwYWRkaW5nO1xuICBib3VuZGFyaWVzLmJvdHRvbSAtPSBwYWRkaW5nO1xuXG4gIHJldHVybiBib3VuZGFyaWVzO1xufVxuXG5mdW5jdGlvbiBnZXRBcmVhKF9yZWYpIHtcbiAgdmFyIHdpZHRoID0gX3JlZi53aWR0aCxcbiAgICAgIGhlaWdodCA9IF9yZWYuaGVpZ2h0O1xuXG4gIHJldHVybiB3aWR0aCAqIGhlaWdodDtcbn1cblxuLyoqXG4gKiBVdGlsaXR5IHVzZWQgdG8gdHJhbnNmb3JtIHRoZSBgYXV0b2AgcGxhY2VtZW50IHRvIHRoZSBwbGFjZW1lbnQgd2l0aCBtb3JlXG4gKiBhdmFpbGFibGUgc3BhY2UuXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5mdW5jdGlvbiBjb21wdXRlQXV0b1BsYWNlbWVudChwbGFjZW1lbnQsIHJlZlJlY3QsIHBvcHBlciwgcmVmZXJlbmNlLCBib3VuZGFyaWVzRWxlbWVudCkge1xuICB2YXIgcGFkZGluZyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDogMDtcblxuICBpZiAocGxhY2VtZW50LmluZGV4T2YoJ2F1dG8nKSA9PT0gLTEpIHtcbiAgICByZXR1cm4gcGxhY2VtZW50O1xuICB9XG5cbiAgdmFyIGJvdW5kYXJpZXMgPSBnZXRCb3VuZGFyaWVzKHBvcHBlciwgcmVmZXJlbmNlLCBwYWRkaW5nLCBib3VuZGFyaWVzRWxlbWVudCk7XG5cbiAgdmFyIHJlY3RzID0ge1xuICAgIHRvcDoge1xuICAgICAgd2lkdGg6IGJvdW5kYXJpZXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHJlZlJlY3QudG9wIC0gYm91bmRhcmllcy50b3BcbiAgICB9LFxuICAgIHJpZ2h0OiB7XG4gICAgICB3aWR0aDogYm91bmRhcmllcy5yaWdodCAtIHJlZlJlY3QucmlnaHQsXG4gICAgICBoZWlnaHQ6IGJvdW5kYXJpZXMuaGVpZ2h0XG4gICAgfSxcbiAgICBib3R0b206IHtcbiAgICAgIHdpZHRoOiBib3VuZGFyaWVzLndpZHRoLFxuICAgICAgaGVpZ2h0OiBib3VuZGFyaWVzLmJvdHRvbSAtIHJlZlJlY3QuYm90dG9tXG4gICAgfSxcbiAgICBsZWZ0OiB7XG4gICAgICB3aWR0aDogcmVmUmVjdC5sZWZ0IC0gYm91bmRhcmllcy5sZWZ0LFxuICAgICAgaGVpZ2h0OiBib3VuZGFyaWVzLmhlaWdodFxuICAgIH1cbiAgfTtcblxuICB2YXIgc29ydGVkQXJlYXMgPSBPYmplY3Qua2V5cyhyZWN0cykubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAga2V5OiBrZXlcbiAgICB9LCByZWN0c1trZXldLCB7XG4gICAgICBhcmVhOiBnZXRBcmVhKHJlY3RzW2tleV0pXG4gICAgfSk7XG4gIH0pLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYi5hcmVhIC0gYS5hcmVhO1xuICB9KTtcblxuICB2YXIgZmlsdGVyZWRBcmVhcyA9IHNvcnRlZEFyZWFzLmZpbHRlcihmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICB2YXIgd2lkdGggPSBfcmVmMi53aWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gX3JlZjIuaGVpZ2h0O1xuICAgIHJldHVybiB3aWR0aCA+PSBwb3BwZXIuY2xpZW50V2lkdGggJiYgaGVpZ2h0ID49IHBvcHBlci5jbGllbnRIZWlnaHQ7XG4gIH0pO1xuXG4gIHZhciBjb21wdXRlZFBsYWNlbWVudCA9IGZpbHRlcmVkQXJlYXMubGVuZ3RoID4gMCA/IGZpbHRlcmVkQXJlYXNbMF0ua2V5IDogc29ydGVkQXJlYXNbMF0ua2V5O1xuXG4gIHZhciB2YXJpYXRpb24gPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcblxuICByZXR1cm4gY29tcHV0ZWRQbGFjZW1lbnQgKyAodmFyaWF0aW9uID8gJy0nICsgdmFyaWF0aW9uIDogJycpO1xufVxuXG4vKipcbiAqIEdldCBvZmZzZXRzIHRvIHRoZSByZWZlcmVuY2UgZWxlbWVudFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlciAtIHRoZSBwb3BwZXIgZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSByZWZlcmVuY2UgLSB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgKHRoZSBwb3BwZXIgd2lsbCBiZSByZWxhdGl2ZSB0byB0aGlzKVxuICogQHJldHVybnMge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9mZnNldHMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXJcbiAqL1xuZnVuY3Rpb24gZ2V0UmVmZXJlbmNlT2Zmc2V0cyhzdGF0ZSwgcG9wcGVyLCByZWZlcmVuY2UpIHtcbiAgdmFyIGNvbW1vbk9mZnNldFBhcmVudCA9IGZpbmRDb21tb25PZmZzZXRQYXJlbnQocG9wcGVyLCByZWZlcmVuY2UpO1xuICByZXR1cm4gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKHJlZmVyZW5jZSwgY29tbW9uT2Zmc2V0UGFyZW50KTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIG91dGVyIHNpemVzIG9mIHRoZSBnaXZlbiBlbGVtZW50IChvZmZzZXQgc2l6ZSArIG1hcmdpbnMpXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9iamVjdCBjb250YWluaW5nIHdpZHRoIGFuZCBoZWlnaHQgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBnZXRPdXRlclNpemVzKGVsZW1lbnQpIHtcbiAgdmFyIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICB2YXIgeCA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpblRvcCkgKyBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5Cb3R0b20pO1xuICB2YXIgeSA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luUmlnaHQpO1xuICB2YXIgcmVzdWx0ID0ge1xuICAgIHdpZHRoOiBlbGVtZW50Lm9mZnNldFdpZHRoICsgeSxcbiAgICBoZWlnaHQ6IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgeFxuICB9O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldCB0aGUgb3Bwb3NpdGUgcGxhY2VtZW50IG9mIHRoZSBnaXZlbiBvbmVcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwbGFjZW1lbnRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IGZsaXBwZWQgcGxhY2VtZW50XG4gKi9cbmZ1bmN0aW9uIGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICB2YXIgaGFzaCA9IHsgbGVmdDogJ3JpZ2h0JywgcmlnaHQ6ICdsZWZ0JywgYm90dG9tOiAndG9wJywgdG9wOiAnYm90dG9tJyB9O1xuICByZXR1cm4gcGxhY2VtZW50LnJlcGxhY2UoL2xlZnR8cmlnaHR8Ym90dG9tfHRvcC9nLCBmdW5jdGlvbiAobWF0Y2hlZCkge1xuICAgIHJldHVybiBoYXNoW21hdGNoZWRdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBHZXQgb2Zmc2V0cyB0byB0aGUgcG9wcGVyXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gLSBDU1MgcG9zaXRpb24gdGhlIFBvcHBlciB3aWxsIGdldCBhcHBsaWVkXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXIgLSB0aGUgcG9wcGVyIGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWZlcmVuY2VPZmZzZXRzIC0gdGhlIHJlZmVyZW5jZSBvZmZzZXRzICh0aGUgcG9wcGVyIHdpbGwgYmUgcmVsYXRpdmUgdG8gdGhpcylcbiAqIEBwYXJhbSB7U3RyaW5nfSBwbGFjZW1lbnQgLSBvbmUgb2YgdGhlIHZhbGlkIHBsYWNlbWVudCBvcHRpb25zXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBwb3BwZXJPZmZzZXRzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9mZnNldHMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXJcbiAqL1xuZnVuY3Rpb24gZ2V0UG9wcGVyT2Zmc2V0cyhwb3BwZXIsIHJlZmVyZW5jZU9mZnNldHMsIHBsYWNlbWVudCkge1xuICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcblxuICAvLyBHZXQgcG9wcGVyIG5vZGUgc2l6ZXNcbiAgdmFyIHBvcHBlclJlY3QgPSBnZXRPdXRlclNpemVzKHBvcHBlcik7XG5cbiAgLy8gQWRkIHBvc2l0aW9uLCB3aWR0aCBhbmQgaGVpZ2h0IHRvIG91ciBvZmZzZXRzIG9iamVjdFxuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHtcbiAgICB3aWR0aDogcG9wcGVyUmVjdC53aWR0aCxcbiAgICBoZWlnaHQ6IHBvcHBlclJlY3QuaGVpZ2h0XG4gIH07XG5cbiAgLy8gZGVwZW5kaW5nIGJ5IHRoZSBwb3BwZXIgcGxhY2VtZW50IHdlIGhhdmUgdG8gY29tcHV0ZSBpdHMgb2Zmc2V0cyBzbGlnaHRseSBkaWZmZXJlbnRseVxuICB2YXIgaXNIb3JpeiA9IFsncmlnaHQnLCAnbGVmdCddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XG4gIHZhciBtYWluU2lkZSA9IGlzSG9yaXogPyAndG9wJyA6ICdsZWZ0JztcbiAgdmFyIHNlY29uZGFyeVNpZGUgPSBpc0hvcml6ID8gJ2xlZnQnIDogJ3RvcCc7XG4gIHZhciBtZWFzdXJlbWVudCA9IGlzSG9yaXogPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG4gIHZhciBzZWNvbmRhcnlNZWFzdXJlbWVudCA9ICFpc0hvcml6ID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gIHBvcHBlck9mZnNldHNbbWFpblNpZGVdID0gcmVmZXJlbmNlT2Zmc2V0c1ttYWluU2lkZV0gKyByZWZlcmVuY2VPZmZzZXRzW21lYXN1cmVtZW50XSAvIDIgLSBwb3BwZXJSZWN0W21lYXN1cmVtZW50XSAvIDI7XG4gIGlmIChwbGFjZW1lbnQgPT09IHNlY29uZGFyeVNpZGUpIHtcbiAgICBwb3BwZXJPZmZzZXRzW3NlY29uZGFyeVNpZGVdID0gcmVmZXJlbmNlT2Zmc2V0c1tzZWNvbmRhcnlTaWRlXSAtIHBvcHBlclJlY3Rbc2Vjb25kYXJ5TWVhc3VyZW1lbnRdO1xuICB9IGVsc2Uge1xuICAgIHBvcHBlck9mZnNldHNbc2Vjb25kYXJ5U2lkZV0gPSByZWZlcmVuY2VPZmZzZXRzW2dldE9wcG9zaXRlUGxhY2VtZW50KHNlY29uZGFyeVNpZGUpXTtcbiAgfVxuXG4gIHJldHVybiBwb3BwZXJPZmZzZXRzO1xufVxuXG4vKipcbiAqIE1pbWljcyB0aGUgYGZpbmRgIG1ldGhvZCBvZiBBcnJheVxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtBcnJheX0gYXJyXG4gKiBAYXJndW1lbnQgcHJvcFxuICogQGFyZ3VtZW50IHZhbHVlXG4gKiBAcmV0dXJucyBpbmRleCBvciAtMVxuICovXG5mdW5jdGlvbiBmaW5kJDEoYXJyLCBjaGVjaykge1xuICAvLyB1c2UgbmF0aXZlIGZpbmQgaWYgc3VwcG9ydGVkXG4gIGlmIChBcnJheS5wcm90b3R5cGUuZmluZCkge1xuICAgIHJldHVybiBhcnIuZmluZChjaGVjayk7XG4gIH1cblxuICAvLyB1c2UgYGZpbHRlcmAgdG8gb2J0YWluIHRoZSBzYW1lIGJlaGF2aW9yIG9mIGBmaW5kYFxuICByZXR1cm4gYXJyLmZpbHRlcihjaGVjaylbMF07XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hpbmcgb2JqZWN0XG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge0FycmF5fSBhcnJcbiAqIEBhcmd1bWVudCBwcm9wXG4gKiBAYXJndW1lbnQgdmFsdWVcbiAqIEByZXR1cm5zIGluZGV4IG9yIC0xXG4gKi9cbmZ1bmN0aW9uIGZpbmRJbmRleCQxKGFyciwgcHJvcCwgdmFsdWUpIHtcbiAgLy8gdXNlIG5hdGl2ZSBmaW5kSW5kZXggaWYgc3VwcG9ydGVkXG4gIGlmIChBcnJheS5wcm90b3R5cGUuZmluZEluZGV4KSB7XG4gICAgcmV0dXJuIGFyci5maW5kSW5kZXgoZnVuY3Rpb24gKGN1cikge1xuICAgICAgcmV0dXJuIGN1cltwcm9wXSA9PT0gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICAvLyB1c2UgYGZpbmRgICsgYGluZGV4T2ZgIGlmIGBmaW5kSW5kZXhgIGlzbid0IHN1cHBvcnRlZFxuICB2YXIgbWF0Y2ggPSBmaW5kJDEoYXJyLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIG9ialtwcm9wXSA9PT0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gYXJyLmluZGV4T2YobWF0Y2gpO1xufVxuXG4vKipcbiAqIExvb3AgdHJvdWdoIHRoZSBsaXN0IG9mIG1vZGlmaWVycyBhbmQgcnVuIHRoZW0gaW4gb3JkZXIsXG4gKiBlYWNoIG9mIHRoZW0gd2lsbCB0aGVuIGVkaXQgdGhlIGRhdGEgb2JqZWN0LlxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQHBhcmFtIHtkYXRhT2JqZWN0fSBkYXRhXG4gKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBlbmRzIC0gT3B0aW9uYWwgbW9kaWZpZXIgbmFtZSB1c2VkIGFzIHN0b3BwZXJcbiAqIEByZXR1cm5zIHtkYXRhT2JqZWN0fVxuICovXG5mdW5jdGlvbiBydW5Nb2RpZmllcnMobW9kaWZpZXJzLCBkYXRhLCBlbmRzKSB7XG4gIHZhciBtb2RpZmllcnNUb1J1biA9IGVuZHMgPT09IHVuZGVmaW5lZCA/IG1vZGlmaWVycyA6IG1vZGlmaWVycy5zbGljZSgwLCBmaW5kSW5kZXgkMShtb2RpZmllcnMsICduYW1lJywgZW5kcykpO1xuXG4gIG1vZGlmaWVyc1RvUnVuLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgaWYgKG1vZGlmaWVyLmZ1bmN0aW9uKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ2Btb2RpZmllci5mdW5jdGlvbmAgaXMgZGVwcmVjYXRlZCwgdXNlIGBtb2RpZmllci5mbmAhJyk7XG4gICAgfVxuICAgIHZhciBmbiA9IG1vZGlmaWVyLmZ1bmN0aW9uIHx8IG1vZGlmaWVyLmZuO1xuICAgIGlmIChtb2RpZmllci5lbmFibGVkICYmIGlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICAvLyBBZGQgcHJvcGVydGllcyB0byBvZmZzZXRzIHRvIG1ha2UgdGhlbSBhIGNvbXBsZXRlIGNsaWVudFJlY3Qgb2JqZWN0XG4gICAgICAvLyB3ZSBkbyB0aGlzIGJlZm9yZSBlYWNoIG1vZGlmaWVyIHRvIG1ha2Ugc3VyZSB0aGUgcHJldmlvdXMgb25lIGRvZXNuJ3RcbiAgICAgIC8vIG1lc3Mgd2l0aCB0aGVzZSB2YWx1ZXNcbiAgICAgIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBnZXRDbGllbnRSZWN0KGRhdGEub2Zmc2V0cy5wb3BwZXIpO1xuICAgICAgZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSA9IGdldENsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSk7XG5cbiAgICAgIGRhdGEgPSBmbihkYXRhLCBtb2RpZmllcik7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9wcGVyLCBjb21wdXRpbmcgdGhlIG5ldyBvZmZzZXRzIGFuZCBhcHBseWluZ1xuICogdGhlIG5ldyBzdHlsZS48YnIgLz5cbiAqIFByZWZlciBgc2NoZWR1bGVVcGRhdGVgIG92ZXIgYHVwZGF0ZWAgYmVjYXVzZSBvZiBwZXJmb3JtYW5jZSByZWFzb25zLlxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlclxuICovXG5mdW5jdGlvbiB1cGRhdGUoKSB7XG4gIC8vIGlmIHBvcHBlciBpcyBkZXN0cm95ZWQsIGRvbid0IHBlcmZvcm0gYW55IGZ1cnRoZXIgdXBkYXRlXG4gIGlmICh0aGlzLnN0YXRlLmlzRGVzdHJveWVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGRhdGEgPSB7XG4gICAgaW5zdGFuY2U6IHRoaXMsXG4gICAgc3R5bGVzOiB7fSxcbiAgICBhcnJvd1N0eWxlczoge30sXG4gICAgYXR0cmlidXRlczoge30sXG4gICAgZmxpcHBlZDogZmFsc2UsXG4gICAgb2Zmc2V0czoge31cbiAgfTtcblxuICAvLyBjb21wdXRlIHJlZmVyZW5jZSBlbGVtZW50IG9mZnNldHNcbiAgZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSA9IGdldFJlZmVyZW5jZU9mZnNldHModGhpcy5zdGF0ZSwgdGhpcy5wb3BwZXIsIHRoaXMucmVmZXJlbmNlKTtcblxuICAvLyBjb21wdXRlIGF1dG8gcGxhY2VtZW50LCBzdG9yZSBwbGFjZW1lbnQgaW5zaWRlIHRoZSBkYXRhIG9iamVjdCxcbiAgLy8gbW9kaWZpZXJzIHdpbGwgYmUgYWJsZSB0byBlZGl0IGBwbGFjZW1lbnRgIGlmIG5lZWRlZFxuICAvLyBhbmQgcmVmZXIgdG8gb3JpZ2luYWxQbGFjZW1lbnQgdG8ga25vdyB0aGUgb3JpZ2luYWwgdmFsdWVcbiAgZGF0YS5wbGFjZW1lbnQgPSBjb21wdXRlQXV0b1BsYWNlbWVudCh0aGlzLm9wdGlvbnMucGxhY2VtZW50LCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCB0aGlzLnBvcHBlciwgdGhpcy5yZWZlcmVuY2UsIHRoaXMub3B0aW9ucy5tb2RpZmllcnMuZmxpcC5ib3VuZGFyaWVzRWxlbWVudCwgdGhpcy5vcHRpb25zLm1vZGlmaWVycy5mbGlwLnBhZGRpbmcpO1xuXG4gIC8vIHN0b3JlIHRoZSBjb21wdXRlZCBwbGFjZW1lbnQgaW5zaWRlIGBvcmlnaW5hbFBsYWNlbWVudGBcbiAgZGF0YS5vcmlnaW5hbFBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50O1xuXG4gIC8vIGNvbXB1dGUgdGhlIHBvcHBlciBvZmZzZXRzXG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBnZXRQb3BwZXJPZmZzZXRzKHRoaXMucG9wcGVyLCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCBkYXRhLnBsYWNlbWVudCk7XG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXG4gIC8vIHJ1biB0aGUgbW9kaWZpZXJzXG4gIGRhdGEgPSBydW5Nb2RpZmllcnModGhpcy5tb2RpZmllcnMsIGRhdGEpO1xuXG4gIC8vIHRoZSBmaXJzdCBgdXBkYXRlYCB3aWxsIGNhbGwgYG9uQ3JlYXRlYCBjYWxsYmFja1xuICAvLyB0aGUgb3RoZXIgb25lcyB3aWxsIGNhbGwgYG9uVXBkYXRlYCBjYWxsYmFja1xuICBpZiAoIXRoaXMuc3RhdGUuaXNDcmVhdGVkKSB7XG4gICAgdGhpcy5zdGF0ZS5pc0NyZWF0ZWQgPSB0cnVlO1xuICAgIHRoaXMub3B0aW9ucy5vbkNyZWF0ZShkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm9wdGlvbnMub25VcGRhdGUoZGF0YSk7XG4gIH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgdXNlZCB0byBrbm93IGlmIHRoZSBnaXZlbiBtb2RpZmllciBpcyBlbmFibGVkLlxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzTW9kaWZpZXJFbmFibGVkKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gIHJldHVybiBtb2RpZmllcnMuc29tZShmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBuYW1lID0gX3JlZi5uYW1lLFxuICAgICAgICBlbmFibGVkID0gX3JlZi5lbmFibGVkO1xuICAgIHJldHVybiBlbmFibGVkICYmIG5hbWUgPT09IG1vZGlmaWVyTmFtZTtcbiAgfSk7XG59XG5cbi8qKlxuICogR2V0IHRoZSBwcmVmaXhlZCBzdXBwb3J0ZWQgcHJvcGVydHkgbmFtZVxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtTdHJpbmd9IHByb3BlcnR5IChjYW1lbENhc2UpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBwcmVmaXhlZCBwcm9wZXJ0eSAoY2FtZWxDYXNlIG9yIFBhc2NhbENhc2UsIGRlcGVuZGluZyBvbiB0aGUgdmVuZG9yIHByZWZpeClcbiAqL1xuZnVuY3Rpb24gZ2V0U3VwcG9ydGVkUHJvcGVydHlOYW1lKHByb3BlcnR5KSB7XG4gIHZhciBwcmVmaXhlcyA9IFtmYWxzZSwgJ21zJywgJ1dlYmtpdCcsICdNb3onLCAnTyddO1xuICB2YXIgdXBwZXJQcm9wID0gcHJvcGVydHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zbGljZSgxKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIHZhciBwcmVmaXggPSBwcmVmaXhlc1tpXTtcbiAgICB2YXIgdG9DaGVjayA9IHByZWZpeCA/ICcnICsgcHJlZml4ICsgdXBwZXJQcm9wIDogcHJvcGVydHk7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQuYm9keS5zdHlsZVt0b0NoZWNrXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB0b0NoZWNrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBEZXN0cm95IHRoZSBwb3BwZXJcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXJcbiAqL1xuZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgdGhpcy5zdGF0ZS5pc0Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgLy8gdG91Y2ggRE9NIG9ubHkgaWYgYGFwcGx5U3R5bGVgIG1vZGlmaWVyIGlzIGVuYWJsZWRcbiAgaWYgKGlzTW9kaWZpZXJFbmFibGVkKHRoaXMubW9kaWZpZXJzLCAnYXBwbHlTdHlsZScpKSB7XG4gICAgdGhpcy5wb3BwZXIucmVtb3ZlQXR0cmlidXRlKCd4LXBsYWNlbWVudCcpO1xuICAgIHRoaXMucG9wcGVyLnN0eWxlLmxlZnQgPSAnJztcbiAgICB0aGlzLnBvcHBlci5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICAgIHRoaXMucG9wcGVyLnN0eWxlLnRvcCA9ICcnO1xuICAgIHRoaXMucG9wcGVyLnN0eWxlW2dldFN1cHBvcnRlZFByb3BlcnR5TmFtZSgndHJhbnNmb3JtJyldID0gJyc7XG4gIH1cblxuICB0aGlzLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xuXG4gIC8vIHJlbW92ZSB0aGUgcG9wcGVyIGlmIHVzZXIgZXhwbGljaXR5IGFza2VkIGZvciB0aGUgZGVsZXRpb24gb24gZGVzdHJveVxuICAvLyBkbyBub3QgdXNlIGByZW1vdmVgIGJlY2F1c2UgSUUxMSBkb2Vzbid0IHN1cHBvcnQgaXRcbiAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdmVPbkRlc3Ryb3kpIHtcbiAgICB0aGlzLnBvcHBlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMucG9wcGVyKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gYXR0YWNoVG9TY3JvbGxQYXJlbnRzKHNjcm9sbFBhcmVudCwgZXZlbnQsIGNhbGxiYWNrLCBzY3JvbGxQYXJlbnRzKSB7XG4gIHZhciBpc0JvZHkgPSBzY3JvbGxQYXJlbnQubm9kZU5hbWUgPT09ICdCT0RZJztcbiAgdmFyIHRhcmdldCA9IGlzQm9keSA/IHdpbmRvdyA6IHNjcm9sbFBhcmVudDtcbiAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCB7IHBhc3NpdmU6IHRydWUgfSk7XG5cbiAgaWYgKCFpc0JvZHkpIHtcbiAgICBhdHRhY2hUb1Njcm9sbFBhcmVudHMoZ2V0U2Nyb2xsUGFyZW50KHRhcmdldC5wYXJlbnROb2RlKSwgZXZlbnQsIGNhbGxiYWNrLCBzY3JvbGxQYXJlbnRzKTtcbiAgfVxuICBzY3JvbGxQYXJlbnRzLnB1c2godGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBTZXR1cCBuZWVkZWQgZXZlbnQgbGlzdGVuZXJzIHVzZWQgdG8gdXBkYXRlIHRoZSBwb3BwZXIgcG9zaXRpb25cbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNldHVwRXZlbnRMaXN0ZW5lcnMocmVmZXJlbmNlLCBvcHRpb25zLCBzdGF0ZSwgdXBkYXRlQm91bmQpIHtcbiAgLy8gUmVzaXplIGV2ZW50IGxpc3RlbmVyIG9uIHdpbmRvd1xuICBzdGF0ZS51cGRhdGVCb3VuZCA9IHVwZGF0ZUJvdW5kO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgc3RhdGUudXBkYXRlQm91bmQsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcblxuICAvLyBTY3JvbGwgZXZlbnQgbGlzdGVuZXIgb24gc2Nyb2xsIHBhcmVudHNcbiAgdmFyIHNjcm9sbEVsZW1lbnQgPSBnZXRTY3JvbGxQYXJlbnQocmVmZXJlbmNlKTtcbiAgYXR0YWNoVG9TY3JvbGxQYXJlbnRzKHNjcm9sbEVsZW1lbnQsICdzY3JvbGwnLCBzdGF0ZS51cGRhdGVCb3VuZCwgc3RhdGUuc2Nyb2xsUGFyZW50cyk7XG4gIHN0YXRlLnNjcm9sbEVsZW1lbnQgPSBzY3JvbGxFbGVtZW50O1xuICBzdGF0ZS5ldmVudHNFbmFibGVkID0gdHJ1ZTtcblxuICByZXR1cm4gc3RhdGU7XG59XG5cbi8qKlxuICogSXQgd2lsbCBhZGQgcmVzaXplL3Njcm9sbCBldmVudHMgYW5kIHN0YXJ0IHJlY2FsY3VsYXRpbmdcbiAqIHBvc2l0aW9uIG9mIHRoZSBwb3BwZXIgZWxlbWVudCB3aGVuIHRoZXkgYXJlIHRyaWdnZXJlZC5cbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXJcbiAqL1xuZnVuY3Rpb24gZW5hYmxlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gIGlmICghdGhpcy5zdGF0ZS5ldmVudHNFbmFibGVkKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHNldHVwRXZlbnRMaXN0ZW5lcnModGhpcy5yZWZlcmVuY2UsIHRoaXMub3B0aW9ucywgdGhpcy5zdGF0ZSwgdGhpcy5zY2hlZHVsZVVwZGF0ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXJzIHVzZWQgdG8gdXBkYXRlIHRoZSBwb3BwZXIgcG9zaXRpb25cbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHJlZmVyZW5jZSwgc3RhdGUpIHtcbiAgLy8gUmVtb3ZlIHJlc2l6ZSBldmVudCBsaXN0ZW5lciBvbiB3aW5kb3dcbiAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHN0YXRlLnVwZGF0ZUJvdW5kKTtcblxuICAvLyBSZW1vdmUgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIG9uIHNjcm9sbCBwYXJlbnRzXG4gIHN0YXRlLnNjcm9sbFBhcmVudHMuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHN0YXRlLnVwZGF0ZUJvdW5kKTtcbiAgfSk7XG5cbiAgLy8gUmVzZXQgc3RhdGVcbiAgc3RhdGUudXBkYXRlQm91bmQgPSBudWxsO1xuICBzdGF0ZS5zY3JvbGxQYXJlbnRzID0gW107XG4gIHN0YXRlLnNjcm9sbEVsZW1lbnQgPSBudWxsO1xuICBzdGF0ZS5ldmVudHNFbmFibGVkID0gZmFsc2U7XG4gIHJldHVybiBzdGF0ZTtcbn1cblxuLyoqXG4gKiBJdCB3aWxsIHJlbW92ZSByZXNpemUvc2Nyb2xsIGV2ZW50cyBhbmQgd29uJ3QgcmVjYWxjdWxhdGUgcG9wcGVyIHBvc2l0aW9uXG4gKiB3aGVuIHRoZXkgYXJlIHRyaWdnZXJlZC4gSXQgYWxzbyB3b24ndCB0cmlnZ2VyIG9uVXBkYXRlIGNhbGxiYWNrIGFueW1vcmUsXG4gKiB1bmxlc3MgeW91IGNhbGwgYHVwZGF0ZWAgbWV0aG9kIG1hbnVhbGx5LlxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlclxuICovXG5mdW5jdGlvbiBkaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gIGlmICh0aGlzLnN0YXRlLmV2ZW50c0VuYWJsZWQpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5zY2hlZHVsZVVwZGF0ZSk7XG4gICAgdGhpcy5zdGF0ZSA9IHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMucmVmZXJlbmNlLCB0aGlzLnN0YXRlKTtcbiAgfVxufVxuXG4vKipcbiAqIFRlbGxzIGlmIGEgZ2l2ZW4gaW5wdXQgaXMgYSBudW1iZXJcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBwYXJhbSB7Kn0gaW5wdXQgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzTnVtZXJpYyhuKSB7XG4gIHJldHVybiBuICE9PSAnJyAmJiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG59XG5cbi8qKlxuICogU2V0IHRoZSBzdHlsZSB0byB0aGUgZ2l2ZW4gcG9wcGVyXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQgLSBFbGVtZW50IHRvIGFwcGx5IHRoZSBzdHlsZSB0b1xuICogQGFyZ3VtZW50IHtPYmplY3R9IHN0eWxlc1xuICogT2JqZWN0IHdpdGggYSBsaXN0IG9mIHByb3BlcnRpZXMgYW5kIHZhbHVlcyB3aGljaCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gc2V0U3R5bGVzKGVsZW1lbnQsIHN0eWxlcykge1xuICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICB2YXIgdW5pdCA9ICcnO1xuICAgIC8vIGFkZCB1bml0IGlmIHRoZSB2YWx1ZSBpcyBudW1lcmljIGFuZCBpcyBvbmUgb2YgdGhlIGZvbGxvd2luZ1xuICAgIGlmIChbJ3dpZHRoJywgJ2hlaWdodCcsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXS5pbmRleE9mKHByb3ApICE9PSAtMSAmJiBpc051bWVyaWMoc3R5bGVzW3Byb3BdKSkge1xuICAgICAgdW5pdCA9ICdweCc7XG4gICAgfVxuICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBzdHlsZXNbcHJvcF0gKyB1bml0O1xuICB9KTtcbn1cblxuLyoqXG4gKiBTZXQgdGhlIGF0dHJpYnV0ZXMgdG8gdGhlIGdpdmVuIHBvcHBlclxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50IC0gRWxlbWVudCB0byBhcHBseSB0aGUgYXR0cmlidXRlcyB0b1xuICogQGFyZ3VtZW50IHtPYmplY3R9IHN0eWxlc1xuICogT2JqZWN0IHdpdGggYSBsaXN0IG9mIHByb3BlcnRpZXMgYW5kIHZhbHVlcyB3aGljaCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW3Byb3BdO1xuICAgIGlmICh2YWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJpYnV0ZXNbcHJvcF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEuc3R5bGVzIC0gTGlzdCBvZiBzdHlsZSBwcm9wZXJ0aWVzIC0gdmFsdWVzIHRvIGFwcGx5IHRvIHBvcHBlciBlbGVtZW50XG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YS5hdHRyaWJ1dGVzIC0gTGlzdCBvZiBhdHRyaWJ1dGUgcHJvcGVydGllcyAtIHZhbHVlcyB0byBhcHBseSB0byBwb3BwZXIgZWxlbWVudFxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xuICogQHJldHVybnMge09iamVjdH0gVGhlIHNhbWUgZGF0YSBvYmplY3RcbiAqL1xuZnVuY3Rpb24gYXBwbHlTdHlsZShkYXRhKSB7XG4gIC8vIGFueSBwcm9wZXJ0eSBwcmVzZW50IGluIGBkYXRhLnN0eWxlc2Agd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIsXG4gIC8vIGluIHRoaXMgd2F5IHdlIGNhbiBtYWtlIHRoZSAzcmQgcGFydHkgbW9kaWZpZXJzIGFkZCBjdXN0b20gc3R5bGVzIHRvIGl0XG4gIC8vIEJlIGF3YXJlLCBtb2RpZmllcnMgY291bGQgb3ZlcnJpZGUgdGhlIHByb3BlcnRpZXMgZGVmaW5lZCBpbiB0aGUgcHJldmlvdXNcbiAgLy8gbGluZXMgb2YgdGhpcyBtb2RpZmllciFcbiAgc2V0U3R5bGVzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLnN0eWxlcyk7XG5cbiAgLy8gYW55IHByb3BlcnR5IHByZXNlbnQgaW4gYGRhdGEuYXR0cmlidXRlc2Agd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIsXG4gIC8vIHRoZXkgd2lsbCBiZSBzZXQgYXMgSFRNTCBhdHRyaWJ1dGVzIG9mIHRoZSBlbGVtZW50XG4gIHNldEF0dHJpYnV0ZXMoZGF0YS5pbnN0YW5jZS5wb3BwZXIsIGRhdGEuYXR0cmlidXRlcyk7XG5cbiAgLy8gaWYgYXJyb3dFbGVtZW50IGlzIGRlZmluZWQgYW5kIGFycm93U3R5bGVzIGhhcyBzb21lIHByb3BlcnRpZXNcbiAgaWYgKGRhdGEuYXJyb3dFbGVtZW50ICYmIE9iamVjdC5rZXlzKGRhdGEuYXJyb3dTdHlsZXMpLmxlbmd0aCkge1xuICAgIHNldFN0eWxlcyhkYXRhLmFycm93RWxlbWVudCwgZGF0YS5hcnJvd1N0eWxlcyk7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBTZXQgdGhlIHgtcGxhY2VtZW50IGF0dHJpYnV0ZSBiZWZvcmUgZXZlcnl0aGluZyBlbHNlIGJlY2F1c2UgaXQgY291bGQgYmUgdXNlZFxuICogdG8gYWRkIG1hcmdpbnMgdG8gdGhlIHBvcHBlciBtYXJnaW5zIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgdG8gZ2V0IHRoZVxuICogY29ycmVjdCBwb3BwZXIgb2Zmc2V0cy5cbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIubW9kaWZpZXJzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByZWZlcmVuY2UgLSBUaGUgcmVmZXJlbmNlIGVsZW1lbnQgdXNlZCB0byBwb3NpdGlvbiB0aGUgcG9wcGVyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXIgLSBUaGUgSFRNTCBlbGVtZW50IHVzZWQgYXMgcG9wcGVyLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBQb3BwZXIuanMgb3B0aW9uc1xuICovXG5mdW5jdGlvbiBhcHBseVN0eWxlT25Mb2FkKHJlZmVyZW5jZSwgcG9wcGVyLCBvcHRpb25zLCBtb2RpZmllck9wdGlvbnMsIHN0YXRlKSB7XG4gIC8vIGNvbXB1dGUgcmVmZXJlbmNlIGVsZW1lbnQgb2Zmc2V0c1xuICB2YXIgcmVmZXJlbmNlT2Zmc2V0cyA9IGdldFJlZmVyZW5jZU9mZnNldHMoc3RhdGUsIHBvcHBlciwgcmVmZXJlbmNlKTtcblxuICAvLyBjb21wdXRlIGF1dG8gcGxhY2VtZW50LCBzdG9yZSBwbGFjZW1lbnQgaW5zaWRlIHRoZSBkYXRhIG9iamVjdCxcbiAgLy8gbW9kaWZpZXJzIHdpbGwgYmUgYWJsZSB0byBlZGl0IGBwbGFjZW1lbnRgIGlmIG5lZWRlZFxuICAvLyBhbmQgcmVmZXIgdG8gb3JpZ2luYWxQbGFjZW1lbnQgdG8ga25vdyB0aGUgb3JpZ2luYWwgdmFsdWVcbiAgdmFyIHBsYWNlbWVudCA9IGNvbXB1dGVBdXRvUGxhY2VtZW50KG9wdGlvbnMucGxhY2VtZW50LCByZWZlcmVuY2VPZmZzZXRzLCBwb3BwZXIsIHJlZmVyZW5jZSwgb3B0aW9ucy5tb2RpZmllcnMuZmxpcC5ib3VuZGFyaWVzRWxlbWVudCwgb3B0aW9ucy5tb2RpZmllcnMuZmxpcC5wYWRkaW5nKTtcblxuICBwb3BwZXIuc2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcsIHBsYWNlbWVudCk7XG5cbiAgLy8gQXBwbHkgYHBvc2l0aW9uYCB0byBwb3BwZXIgYmVmb3JlIGFueXRoaW5nIGVsc2UgYmVjYXVzZVxuICAvLyB3aXRob3V0IHRoZSBwb3NpdGlvbiBhcHBsaWVkIHdlIGNhbid0IGd1YXJhbnRlZSBjb3JyZWN0IGNvbXB1dGF0aW9uc1xuICBzZXRTdHlsZXMocG9wcGVyLCB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnIH0pO1xuXG4gIHJldHVybiBvcHRpb25zO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5mdW5jdGlvbiBjb21wdXRlU3R5bGUoZGF0YSwgb3B0aW9ucykge1xuICB2YXIgeCA9IG9wdGlvbnMueCxcbiAgICAgIHkgPSBvcHRpb25zLnk7XG4gIHZhciBwb3BwZXIgPSBkYXRhLm9mZnNldHMucG9wcGVyO1xuXG4gIC8vIFJlbW92ZSB0aGlzIGxlZ2FjeSBzdXBwb3J0IGluIFBvcHBlci5qcyB2MlxuXG4gIHZhciBsZWdhY3lHcHVBY2NlbGVyYXRpb25PcHRpb24gPSBmaW5kJDEoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsIGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIHJldHVybiBtb2RpZmllci5uYW1lID09PSAnYXBwbHlTdHlsZSc7XG4gIH0pLmdwdUFjY2VsZXJhdGlvbjtcbiAgaWYgKGxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBgZ3B1QWNjZWxlcmF0aW9uYCBvcHRpb24gbW92ZWQgdG8gYGNvbXB1dGVTdHlsZWAgbW9kaWZpZXIgYW5kIHdpbGwgbm90IGJlIHN1cHBvcnRlZCBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgUG9wcGVyLmpzIScpO1xuICB9XG4gIHZhciBncHVBY2NlbGVyYXRpb24gPSBsZWdhY3lHcHVBY2NlbGVyYXRpb25PcHRpb24gIT09IHVuZGVmaW5lZCA/IGxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiA6IG9wdGlvbnMuZ3B1QWNjZWxlcmF0aW9uO1xuXG4gIHZhciBvZmZzZXRQYXJlbnQgPSBnZXRPZmZzZXRQYXJlbnQoZGF0YS5pbnN0YW5jZS5wb3BwZXIpO1xuICB2YXIgb2Zmc2V0UGFyZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChvZmZzZXRQYXJlbnQpO1xuXG4gIC8vIFN0eWxlc1xuICB2YXIgc3R5bGVzID0ge1xuICAgIHBvc2l0aW9uOiBwb3BwZXIucG9zaXRpb25cbiAgfTtcblxuICAvLyBmbG9vciBzaWRlcyB0byBhdm9pZCBibHVycnkgdGV4dFxuICB2YXIgb2Zmc2V0cyA9IHtcbiAgICBsZWZ0OiBNYXRoLmZsb29yKHBvcHBlci5sZWZ0KSxcbiAgICB0b3A6IE1hdGguZmxvb3IocG9wcGVyLnRvcCksXG4gICAgYm90dG9tOiBNYXRoLmZsb29yKHBvcHBlci5ib3R0b20pLFxuICAgIHJpZ2h0OiBNYXRoLmZsb29yKHBvcHBlci5yaWdodClcbiAgfTtcblxuICB2YXIgc2lkZUEgPSB4ID09PSAnYm90dG9tJyA/ICd0b3AnIDogJ2JvdHRvbSc7XG4gIHZhciBzaWRlQiA9IHkgPT09ICdyaWdodCcgPyAnbGVmdCcgOiAncmlnaHQnO1xuXG4gIC8vIGlmIGdwdUFjY2VsZXJhdGlvbiBpcyBzZXQgdG8gYHRydWVgIGFuZCB0cmFuc2Zvcm0gaXMgc3VwcG9ydGVkLFxuICAvLyAgd2UgdXNlIGB0cmFuc2xhdGUzZGAgdG8gYXBwbHkgdGhlIHBvc2l0aW9uIHRvIHRoZSBwb3BwZXIgd2VcbiAgLy8gYXV0b21hdGljYWxseSB1c2UgdGhlIHN1cHBvcnRlZCBwcmVmaXhlZCB2ZXJzaW9uIGlmIG5lZWRlZFxuICB2YXIgcHJlZml4ZWRQcm9wZXJ0eSA9IGdldFN1cHBvcnRlZFByb3BlcnR5TmFtZSgndHJhbnNmb3JtJyk7XG5cbiAgLy8gbm93LCBsZXQncyBtYWtlIGEgc3RlcCBiYWNrIGFuZCBsb29rIGF0IHRoaXMgY29kZSBjbG9zZWx5ICh3dGY/KVxuICAvLyBJZiB0aGUgY29udGVudCBvZiB0aGUgcG9wcGVyIGdyb3dzIG9uY2UgaXQncyBiZWVuIHBvc2l0aW9uZWQsIGl0XG4gIC8vIG1heSBoYXBwZW4gdGhhdCB0aGUgcG9wcGVyIGdldHMgbWlzcGxhY2VkIGJlY2F1c2Ugb2YgdGhlIG5ldyBjb250ZW50XG4gIC8vIG92ZXJmbG93aW5nIGl0cyByZWZlcmVuY2UgZWxlbWVudFxuICAvLyBUbyBhdm9pZCB0aGlzIHByb2JsZW0sIHdlIHByb3ZpZGUgdHdvIG9wdGlvbnMgKHggYW5kIHkpLCB3aGljaCBhbGxvd1xuICAvLyB0aGUgY29uc3VtZXIgdG8gZGVmaW5lIHRoZSBvZmZzZXQgb3JpZ2luLlxuICAvLyBJZiB3ZSBwb3NpdGlvbiBhIHBvcHBlciBvbiB0b3Agb2YgYSByZWZlcmVuY2UgZWxlbWVudCwgd2UgY2FuIHNldFxuICAvLyBgeGAgdG8gYHRvcGAgdG8gbWFrZSB0aGUgcG9wcGVyIGdyb3cgdG93YXJkcyBpdHMgdG9wIGluc3RlYWQgb2ZcbiAgLy8gaXRzIGJvdHRvbS5cbiAgdmFyIGxlZnQgPSB2b2lkIDAsXG4gICAgICB0b3AgPSB2b2lkIDA7XG4gIGlmIChzaWRlQSA9PT0gJ2JvdHRvbScpIHtcbiAgICB0b3AgPSAtb2Zmc2V0UGFyZW50UmVjdC5oZWlnaHQgKyBvZmZzZXRzLmJvdHRvbTtcbiAgfSBlbHNlIHtcbiAgICB0b3AgPSBvZmZzZXRzLnRvcDtcbiAgfVxuICBpZiAoc2lkZUIgPT09ICdyaWdodCcpIHtcbiAgICBsZWZ0ID0gLW9mZnNldFBhcmVudFJlY3Qud2lkdGggKyBvZmZzZXRzLnJpZ2h0O1xuICB9IGVsc2Uge1xuICAgIGxlZnQgPSBvZmZzZXRzLmxlZnQ7XG4gIH1cbiAgaWYgKGdwdUFjY2VsZXJhdGlvbiAmJiBwcmVmaXhlZFByb3BlcnR5KSB7XG4gICAgc3R5bGVzW3ByZWZpeGVkUHJvcGVydHldID0gJ3RyYW5zbGF0ZTNkKCcgKyBsZWZ0ICsgJ3B4LCAnICsgdG9wICsgJ3B4LCAwKSc7XG4gICAgc3R5bGVzW3NpZGVBXSA9IDA7XG4gICAgc3R5bGVzW3NpZGVCXSA9IDA7XG4gICAgc3R5bGVzLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcbiAgfSBlbHNlIHtcbiAgICAvLyBvdGh3ZXJpc2UsIHdlIHVzZSB0aGUgc3RhbmRhcmQgYHRvcGAsIGBsZWZ0YCwgYGJvdHRvbWAgYW5kIGByaWdodGAgcHJvcGVydGllc1xuICAgIHZhciBpbnZlcnRUb3AgPSBzaWRlQSA9PT0gJ2JvdHRvbScgPyAtMSA6IDE7XG4gICAgdmFyIGludmVydExlZnQgPSBzaWRlQiA9PT0gJ3JpZ2h0JyA/IC0xIDogMTtcbiAgICBzdHlsZXNbc2lkZUFdID0gdG9wICogaW52ZXJ0VG9wO1xuICAgIHN0eWxlc1tzaWRlQl0gPSBsZWZ0ICogaW52ZXJ0TGVmdDtcbiAgICBzdHlsZXMud2lsbENoYW5nZSA9IHNpZGVBICsgJywgJyArIHNpZGVCO1xuICB9XG5cbiAgLy8gQXR0cmlidXRlc1xuICB2YXIgYXR0cmlidXRlcyA9IHtcbiAgICAneC1wbGFjZW1lbnQnOiBkYXRhLnBsYWNlbWVudFxuICB9O1xuXG4gIC8vIFVwZGF0ZSBgZGF0YWAgYXR0cmlidXRlcywgc3R5bGVzIGFuZCBhcnJvd1N0eWxlc1xuICBkYXRhLmF0dHJpYnV0ZXMgPSBfZXh0ZW5kcyh7fSwgYXR0cmlidXRlcywgZGF0YS5hdHRyaWJ1dGVzKTtcbiAgZGF0YS5zdHlsZXMgPSBfZXh0ZW5kcyh7fSwgc3R5bGVzLCBkYXRhLnN0eWxlcyk7XG4gIGRhdGEuYXJyb3dTdHlsZXMgPSBfZXh0ZW5kcyh7fSwgZGF0YS5vZmZzZXRzLmFycm93LCBkYXRhLmFycm93U3R5bGVzKTtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgdXNlZCB0byBrbm93IGlmIHRoZSBnaXZlbiBtb2RpZmllciBkZXBlbmRzIGZyb20gYW5vdGhlciBvbmUuPGJyIC8+XG4gKiBJdCBjaGVja3MgaWYgdGhlIG5lZWRlZCBtb2RpZmllciBpcyBsaXN0ZWQgYW5kIGVuYWJsZWQuXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnMgLSBsaXN0IG9mIG1vZGlmaWVyc1xuICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RpbmdOYW1lIC0gbmFtZSBvZiByZXF1ZXN0aW5nIG1vZGlmaWVyXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdGVkTmFtZSAtIG5hbWUgb2YgcmVxdWVzdGVkIG1vZGlmaWVyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNNb2RpZmllclJlcXVpcmVkKG1vZGlmaWVycywgcmVxdWVzdGluZ05hbWUsIHJlcXVlc3RlZE5hbWUpIHtcbiAgdmFyIHJlcXVlc3RpbmcgPSBmaW5kJDEobW9kaWZpZXJzLCBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBuYW1lID0gX3JlZi5uYW1lO1xuICAgIHJldHVybiBuYW1lID09PSByZXF1ZXN0aW5nTmFtZTtcbiAgfSk7XG5cbiAgdmFyIGlzUmVxdWlyZWQgPSAhIXJlcXVlc3RpbmcgJiYgbW9kaWZpZXJzLnNvbWUoZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgcmV0dXJuIG1vZGlmaWVyLm5hbWUgPT09IHJlcXVlc3RlZE5hbWUgJiYgbW9kaWZpZXIuZW5hYmxlZCAmJiBtb2RpZmllci5vcmRlciA8IHJlcXVlc3Rpbmcub3JkZXI7XG4gIH0pO1xuXG4gIGlmICghaXNSZXF1aXJlZCkge1xuICAgIHZhciBfcmVxdWVzdGluZyA9ICdgJyArIHJlcXVlc3RpbmdOYW1lICsgJ2AnO1xuICAgIHZhciByZXF1ZXN0ZWQgPSAnYCcgKyByZXF1ZXN0ZWROYW1lICsgJ2AnO1xuICAgIGNvbnNvbGUud2FybihyZXF1ZXN0ZWQgKyAnIG1vZGlmaWVyIGlzIHJlcXVpcmVkIGJ5ICcgKyBfcmVxdWVzdGluZyArICcgbW9kaWZpZXIgaW4gb3JkZXIgdG8gd29yaywgYmUgc3VyZSB0byBpbmNsdWRlIGl0IGJlZm9yZSAnICsgX3JlcXVlc3RpbmcgKyAnIScpO1xuICB9XG4gIHJldHVybiBpc1JlcXVpcmVkO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAqL1xuZnVuY3Rpb24gYXJyb3coZGF0YSwgb3B0aW9ucykge1xuICAvLyBhcnJvdyBkZXBlbmRzIG9uIGtlZXBUb2dldGhlciBpbiBvcmRlciB0byB3b3JrXG4gIGlmICghaXNNb2RpZmllclJlcXVpcmVkKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCAnYXJyb3cnLCAna2VlcFRvZ2V0aGVyJykpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHZhciBhcnJvd0VsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQ7XG5cbiAgLy8gaWYgYXJyb3dFbGVtZW50IGlzIGEgc3RyaW5nLCBzdXBwb3NlIGl0J3MgYSBDU1Mgc2VsZWN0b3JcbiAgaWYgKHR5cGVvZiBhcnJvd0VsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgYXJyb3dFbGVtZW50ID0gZGF0YS5pbnN0YW5jZS5wb3BwZXIucXVlcnlTZWxlY3RvcihhcnJvd0VsZW1lbnQpO1xuXG4gICAgLy8gaWYgYXJyb3dFbGVtZW50IGlzIG5vdCBmb3VuZCwgZG9uJ3QgcnVuIHRoZSBtb2RpZmllclxuICAgIGlmICghYXJyb3dFbGVtZW50KSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgdGhlIGFycm93RWxlbWVudCBpc24ndCBhIHF1ZXJ5IHNlbGVjdG9yIHdlIG11c3QgY2hlY2sgdGhhdCB0aGVcbiAgICAvLyBwcm92aWRlZCBET00gbm9kZSBpcyBjaGlsZCBvZiBpdHMgcG9wcGVyIG5vZGVcbiAgICBpZiAoIWRhdGEuaW5zdGFuY2UucG9wcGVyLmNvbnRhaW5zKGFycm93RWxlbWVudCkpIHtcbiAgICAgIGNvbnNvbGUud2FybignV0FSTklORzogYGFycm93LmVsZW1lbnRgIG11c3QgYmUgY2hpbGQgb2YgaXRzIHBvcHBlciBlbGVtZW50IScpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICB9XG5cbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMF07XG4gIHZhciBfZGF0YSRvZmZzZXRzID0gZGF0YS5vZmZzZXRzLFxuICAgICAgcG9wcGVyID0gX2RhdGEkb2Zmc2V0cy5wb3BwZXIsXG4gICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZTtcblxuICB2YXIgaXNWZXJ0aWNhbCA9IFsnbGVmdCcsICdyaWdodCddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XG5cbiAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG4gIHZhciBzaWRlQ2FwaXRhbGl6ZWQgPSBpc1ZlcnRpY2FsID8gJ1RvcCcgOiAnTGVmdCc7XG4gIHZhciBzaWRlID0gc2lkZUNhcGl0YWxpemVkLnRvTG93ZXJDYXNlKCk7XG4gIHZhciBhbHRTaWRlID0gaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnO1xuICB2YXIgb3BTaWRlID0gaXNWZXJ0aWNhbCA/ICdib3R0b20nIDogJ3JpZ2h0JztcbiAgdmFyIGFycm93RWxlbWVudFNpemUgPSBnZXRPdXRlclNpemVzKGFycm93RWxlbWVudClbbGVuXTtcblxuICAvL1xuICAvLyBleHRlbmRzIGtlZXBUb2dldGhlciBiZWhhdmlvciBtYWtpbmcgc3VyZSB0aGUgcG9wcGVyIGFuZCBpdHNcbiAgLy8gcmVmZXJlbmNlIGhhdmUgZW5vdWdoIHBpeGVscyBpbiBjb25qdWN0aW9uXG4gIC8vXG5cbiAgLy8gdG9wL2xlZnQgc2lkZVxuICBpZiAocmVmZXJlbmNlW29wU2lkZV0gLSBhcnJvd0VsZW1lbnRTaXplIDwgcG9wcGVyW3NpZGVdKSB7XG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSAtPSBwb3BwZXJbc2lkZV0gLSAocmVmZXJlbmNlW29wU2lkZV0gLSBhcnJvd0VsZW1lbnRTaXplKTtcbiAgfVxuICAvLyBib3R0b20vcmlnaHQgc2lkZVxuICBpZiAocmVmZXJlbmNlW3NpZGVdICsgYXJyb3dFbGVtZW50U2l6ZSA+IHBvcHBlcltvcFNpZGVdKSB7XG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSArPSByZWZlcmVuY2Vbc2lkZV0gKyBhcnJvd0VsZW1lbnRTaXplIC0gcG9wcGVyW29wU2lkZV07XG4gIH1cblxuICAvLyBjb21wdXRlIGNlbnRlciBvZiB0aGUgcG9wcGVyXG4gIHZhciBjZW50ZXIgPSByZWZlcmVuY2Vbc2lkZV0gKyByZWZlcmVuY2VbbGVuXSAvIDIgLSBhcnJvd0VsZW1lbnRTaXplIC8gMjtcblxuICAvLyBDb21wdXRlIHRoZSBzaWRlVmFsdWUgdXNpbmcgdGhlIHVwZGF0ZWQgcG9wcGVyIG9mZnNldHNcbiAgLy8gdGFrZSBwb3BwZXIgbWFyZ2luIGluIGFjY291bnQgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIHRoaXMgaW5mbyBhdmFpbGFibGVcbiAgdmFyIHBvcHBlck1hcmdpblNpZGUgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZGF0YS5pbnN0YW5jZS5wb3BwZXIsICdtYXJnaW4nICsgc2lkZUNhcGl0YWxpemVkKS5yZXBsYWNlKCdweCcsICcnKTtcbiAgdmFyIHNpZGVWYWx1ZSA9IGNlbnRlciAtIGdldENsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnBvcHBlcilbc2lkZV0gLSBwb3BwZXJNYXJnaW5TaWRlO1xuXG4gIC8vIHByZXZlbnQgYXJyb3dFbGVtZW50IGZyb20gYmVpbmcgcGxhY2VkIG5vdCBjb250aWd1b3VzbHkgdG8gaXRzIHBvcHBlclxuICBzaWRlVmFsdWUgPSBNYXRoLm1heChNYXRoLm1pbihwb3BwZXJbbGVuXSAtIGFycm93RWxlbWVudFNpemUsIHNpZGVWYWx1ZSksIDApO1xuXG4gIGRhdGEuYXJyb3dFbGVtZW50ID0gYXJyb3dFbGVtZW50O1xuICBkYXRhLm9mZnNldHMuYXJyb3cgPSB7fTtcbiAgZGF0YS5vZmZzZXRzLmFycm93W3NpZGVdID0gTWF0aC5yb3VuZChzaWRlVmFsdWUpO1xuICBkYXRhLm9mZnNldHMuYXJyb3dbYWx0U2lkZV0gPSAnJzsgLy8gbWFrZSBzdXJlIHRvIHVuc2V0IGFueSBldmVudHVhbCBhbHRTaWRlIHZhbHVlIGZyb20gdGhlIERPTSBub2RlXG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbi8qKlxuICogR2V0IHRoZSBvcHBvc2l0ZSBwbGFjZW1lbnQgdmFyaWF0aW9uIG9mIHRoZSBnaXZlbiBvbmVcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwbGFjZW1lbnQgdmFyaWF0aW9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBmbGlwcGVkIHBsYWNlbWVudCB2YXJpYXRpb25cbiAqL1xuZnVuY3Rpb24gZ2V0T3Bwb3NpdGVWYXJpYXRpb24odmFyaWF0aW9uKSB7XG4gIGlmICh2YXJpYXRpb24gPT09ICdlbmQnKSB7XG4gICAgcmV0dXJuICdzdGFydCc7XG4gIH0gZWxzZSBpZiAodmFyaWF0aW9uID09PSAnc3RhcnQnKSB7XG4gICAgcmV0dXJuICdlbmQnO1xuICB9XG4gIHJldHVybiB2YXJpYXRpb247XG59XG5cbi8qKlxuICogTGlzdCBvZiBhY2NlcHRlZCBwbGFjZW1lbnRzIHRvIHVzZSBhcyB2YWx1ZXMgb2YgdGhlIGBwbGFjZW1lbnRgIG9wdGlvbi48YnIgLz5cbiAqIFZhbGlkIHBsYWNlbWVudHMgYXJlOlxuICogLSBgYXV0b2BcbiAqIC0gYHRvcGBcbiAqIC0gYHJpZ2h0YFxuICogLSBgYm90dG9tYFxuICogLSBgbGVmdGBcbiAqXG4gKiBFYWNoIHBsYWNlbWVudCBjYW4gaGF2ZSBhIHZhcmlhdGlvbiBmcm9tIHRoaXMgbGlzdDpcbiAqIC0gYC1zdGFydGBcbiAqIC0gYC1lbmRgXG4gKlxuICogVmFyaWF0aW9ucyBhcmUgaW50ZXJwcmV0ZWQgZWFzaWx5IGlmIHlvdSB0aGluayBvZiB0aGVtIGFzIHRoZSBsZWZ0IHRvIHJpZ2h0XG4gKiB3cml0dGVuIGxhbmd1YWdlcy4gSG9yaXpvbnRhbGx5IChgdG9wYCBhbmQgYGJvdHRvbWApLCBgc3RhcnRgIGlzIGxlZnQgYW5kIGBlbmRgXG4gKiBpcyByaWdodC48YnIgLz5cbiAqIFZlcnRpY2FsbHkgKGBsZWZ0YCBhbmQgYHJpZ2h0YCksIGBzdGFydGAgaXMgdG9wIGFuZCBgZW5kYCBpcyBib3R0b20uXG4gKlxuICogU29tZSB2YWxpZCBleGFtcGxlcyBhcmU6XG4gKiAtIGB0b3AtZW5kYCAob24gdG9wIG9mIHJlZmVyZW5jZSwgcmlnaHQgYWxpZ25lZClcbiAqIC0gYHJpZ2h0LXN0YXJ0YCAob24gcmlnaHQgb2YgcmVmZXJlbmNlLCB0b3AgYWxpZ25lZClcbiAqIC0gYGJvdHRvbWAgKG9uIGJvdHRvbSwgY2VudGVyZWQpXG4gKiAtIGBhdXRvLXJpZ2h0YCAob24gdGhlIHNpZGUgd2l0aCBtb3JlIHNwYWNlIGF2YWlsYWJsZSwgYWxpZ25tZW50IGRlcGVuZHMgYnkgcGxhY2VtZW50KVxuICpcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtBcnJheX1cbiAqIEBlbnVtIHtTdHJpbmd9XG4gKiBAcmVhZG9ubHlcbiAqIEBtZXRob2QgcGxhY2VtZW50c1xuICogQG1lbWJlcm9mIFBvcHBlclxuICovXG52YXIgcGxhY2VtZW50cyA9IFsnYXV0by1zdGFydCcsICdhdXRvJywgJ2F1dG8tZW5kJywgJ3RvcC1zdGFydCcsICd0b3AnLCAndG9wLWVuZCcsICdyaWdodC1zdGFydCcsICdyaWdodCcsICdyaWdodC1lbmQnLCAnYm90dG9tLWVuZCcsICdib3R0b20nLCAnYm90dG9tLXN0YXJ0JywgJ2xlZnQtZW5kJywgJ2xlZnQnLCAnbGVmdC1zdGFydCddO1xuXG4vLyBHZXQgcmlkIG9mIGBhdXRvYCBgYXV0by1zdGFydGAgYW5kIGBhdXRvLWVuZGBcbnZhciB2YWxpZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzLnNsaWNlKDMpO1xuXG4vKipcbiAqIEdpdmVuIGFuIGluaXRpYWwgcGxhY2VtZW50LCByZXR1cm5zIGFsbCB0aGUgc3Vic2VxdWVudCBwbGFjZW1lbnRzXG4gKiBjbG9ja3dpc2UgKG9yIGNvdW50ZXItY2xvY2t3aXNlKS5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge1N0cmluZ30gcGxhY2VtZW50IC0gQSB2YWxpZCBwbGFjZW1lbnQgKGl0IGFjY2VwdHMgdmFyaWF0aW9ucylcbiAqIEBhcmd1bWVudCB7Qm9vbGVhbn0gY291bnRlciAtIFNldCB0byB0cnVlIHRvIHdhbGsgdGhlIHBsYWNlbWVudHMgY291bnRlcmNsb2Nrd2lzZVxuICogQHJldHVybnMge0FycmF5fSBwbGFjZW1lbnRzIGluY2x1ZGluZyB0aGVpciB2YXJpYXRpb25zXG4gKi9cbmZ1bmN0aW9uIGNsb2Nrd2lzZShwbGFjZW1lbnQpIHtcbiAgdmFyIGNvdW50ZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuXG4gIHZhciBpbmRleCA9IHZhbGlkUGxhY2VtZW50cy5pbmRleE9mKHBsYWNlbWVudCk7XG4gIHZhciBhcnIgPSB2YWxpZFBsYWNlbWVudHMuc2xpY2UoaW5kZXggKyAxKS5jb25jYXQodmFsaWRQbGFjZW1lbnRzLnNsaWNlKDAsIGluZGV4KSk7XG4gIHJldHVybiBjb3VudGVyID8gYXJyLnJldmVyc2UoKSA6IGFycjtcbn1cblxudmFyIEJFSEFWSU9SUyA9IHtcbiAgRkxJUDogJ2ZsaXAnLFxuICBDTE9DS1dJU0U6ICdjbG9ja3dpc2UnLFxuICBDT1VOVEVSQ0xPQ0tXSVNFOiAnY291bnRlcmNsb2Nrd2lzZSdcbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5mdW5jdGlvbiBmbGlwKGRhdGEsIG9wdGlvbnMpIHtcbiAgLy8gaWYgYGlubmVyYCBtb2RpZmllciBpcyBlbmFibGVkLCB3ZSBjYW4ndCB1c2UgdGhlIGBmbGlwYCBtb2RpZmllclxuICBpZiAoaXNNb2RpZmllckVuYWJsZWQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsICdpbm5lcicpKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBpZiAoZGF0YS5mbGlwcGVkICYmIGRhdGEucGxhY2VtZW50ID09PSBkYXRhLm9yaWdpbmFsUGxhY2VtZW50KSB7XG4gICAgLy8gc2VlbXMgbGlrZSBmbGlwIGlzIHRyeWluZyB0byBsb29wLCBwcm9iYWJseSB0aGVyZSdzIG5vdCBlbm91Z2ggc3BhY2Ugb24gYW55IG9mIHRoZSBmbGlwcGFibGUgc2lkZXNcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHZhciBib3VuZGFyaWVzID0gZ2V0Qm91bmRhcmllcyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5pbnN0YW5jZS5yZWZlcmVuY2UsIG9wdGlvbnMucGFkZGluZywgb3B0aW9ucy5ib3VuZGFyaWVzRWxlbWVudCk7XG5cbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMF07XG4gIHZhciBwbGFjZW1lbnRPcHBvc2l0ZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHZhciB2YXJpYXRpb24gPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzFdIHx8ICcnO1xuXG4gIHZhciBmbGlwT3JkZXIgPSBbXTtcblxuICBzd2l0Y2ggKG9wdGlvbnMuYmVoYXZpb3IpIHtcbiAgICBjYXNlIEJFSEFWSU9SUy5GTElQOlxuICAgICAgZmxpcE9yZGVyID0gW3BsYWNlbWVudCwgcGxhY2VtZW50T3Bwb3NpdGVdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBCRUhBVklPUlMuQ0xPQ0tXSVNFOlxuICAgICAgZmxpcE9yZGVyID0gY2xvY2t3aXNlKHBsYWNlbWVudCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIEJFSEFWSU9SUy5DT1VOVEVSQ0xPQ0tXSVNFOlxuICAgICAgZmxpcE9yZGVyID0gY2xvY2t3aXNlKHBsYWNlbWVudCwgdHJ1ZSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgZmxpcE9yZGVyID0gb3B0aW9ucy5iZWhhdmlvcjtcbiAgfVxuXG4gIGZsaXBPcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChzdGVwLCBpbmRleCkge1xuICAgIGlmIChwbGFjZW1lbnQgIT09IHN0ZXAgfHwgZmxpcE9yZGVyLmxlbmd0aCA9PT0gaW5kZXggKyAxKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xuICAgIHBsYWNlbWVudE9wcG9zaXRlID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcblxuICAgIHZhciBwb3BwZXJPZmZzZXRzID0gZGF0YS5vZmZzZXRzLnBvcHBlcjtcbiAgICB2YXIgcmVmT2Zmc2V0cyA9IGRhdGEub2Zmc2V0cy5yZWZlcmVuY2U7XG5cbiAgICAvLyB1c2luZyBmbG9vciBiZWNhdXNlIHRoZSByZWZlcmVuY2Ugb2Zmc2V0cyBtYXkgY29udGFpbiBkZWNpbWFscyB3ZSBhcmUgbm90IGdvaW5nIHRvIGNvbnNpZGVyIGhlcmVcbiAgICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuICAgIHZhciBvdmVybGFwc1JlZiA9IHBsYWNlbWVudCA9PT0gJ2xlZnQnICYmIGZsb29yKHBvcHBlck9mZnNldHMucmlnaHQpID4gZmxvb3IocmVmT2Zmc2V0cy5sZWZ0KSB8fCBwbGFjZW1lbnQgPT09ICdyaWdodCcgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy5sZWZ0KSA8IGZsb29yKHJlZk9mZnNldHMucmlnaHQpIHx8IHBsYWNlbWVudCA9PT0gJ3RvcCcgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy5ib3R0b20pID4gZmxvb3IocmVmT2Zmc2V0cy50b3ApIHx8IHBsYWNlbWVudCA9PT0gJ2JvdHRvbScgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy50b3ApIDwgZmxvb3IocmVmT2Zmc2V0cy5ib3R0b20pO1xuXG4gICAgdmFyIG92ZXJmbG93c0xlZnQgPSBmbG9vcihwb3BwZXJPZmZzZXRzLmxlZnQpIDwgZmxvb3IoYm91bmRhcmllcy5sZWZ0KTtcbiAgICB2YXIgb3ZlcmZsb3dzUmlnaHQgPSBmbG9vcihwb3BwZXJPZmZzZXRzLnJpZ2h0KSA+IGZsb29yKGJvdW5kYXJpZXMucmlnaHQpO1xuICAgIHZhciBvdmVyZmxvd3NUb3AgPSBmbG9vcihwb3BwZXJPZmZzZXRzLnRvcCkgPCBmbG9vcihib3VuZGFyaWVzLnRvcCk7XG4gICAgdmFyIG92ZXJmbG93c0JvdHRvbSA9IGZsb29yKHBvcHBlck9mZnNldHMuYm90dG9tKSA+IGZsb29yKGJvdW5kYXJpZXMuYm90dG9tKTtcblxuICAgIHZhciBvdmVyZmxvd3NCb3VuZGFyaWVzID0gcGxhY2VtZW50ID09PSAnbGVmdCcgJiYgb3ZlcmZsb3dzTGVmdCB8fCBwbGFjZW1lbnQgPT09ICdyaWdodCcgJiYgb3ZlcmZsb3dzUmlnaHQgfHwgcGxhY2VtZW50ID09PSAndG9wJyAmJiBvdmVyZmxvd3NUb3AgfHwgcGxhY2VtZW50ID09PSAnYm90dG9tJyAmJiBvdmVyZmxvd3NCb3R0b207XG5cbiAgICAvLyBmbGlwIHRoZSB2YXJpYXRpb24gaWYgcmVxdWlyZWRcbiAgICB2YXIgaXNWZXJ0aWNhbCA9IFsndG9wJywgJ2JvdHRvbSddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XG4gICAgdmFyIGZsaXBwZWRWYXJpYXRpb24gPSAhIW9wdGlvbnMuZmxpcFZhcmlhdGlvbnMgJiYgKGlzVmVydGljYWwgJiYgdmFyaWF0aW9uID09PSAnc3RhcnQnICYmIG92ZXJmbG93c0xlZnQgfHwgaXNWZXJ0aWNhbCAmJiB2YXJpYXRpb24gPT09ICdlbmQnICYmIG92ZXJmbG93c1JpZ2h0IHx8ICFpc1ZlcnRpY2FsICYmIHZhcmlhdGlvbiA9PT0gJ3N0YXJ0JyAmJiBvdmVyZmxvd3NUb3AgfHwgIWlzVmVydGljYWwgJiYgdmFyaWF0aW9uID09PSAnZW5kJyAmJiBvdmVyZmxvd3NCb3R0b20pO1xuXG4gICAgaWYgKG92ZXJsYXBzUmVmIHx8IG92ZXJmbG93c0JvdW5kYXJpZXMgfHwgZmxpcHBlZFZhcmlhdGlvbikge1xuICAgICAgLy8gdGhpcyBib29sZWFuIHRvIGRldGVjdCBhbnkgZmxpcCBsb29wXG4gICAgICBkYXRhLmZsaXBwZWQgPSB0cnVlO1xuXG4gICAgICBpZiAob3ZlcmxhcHNSZWYgfHwgb3ZlcmZsb3dzQm91bmRhcmllcykge1xuICAgICAgICBwbGFjZW1lbnQgPSBmbGlwT3JkZXJbaW5kZXggKyAxXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZsaXBwZWRWYXJpYXRpb24pIHtcbiAgICAgICAgdmFyaWF0aW9uID0gZ2V0T3Bwb3NpdGVWYXJpYXRpb24odmFyaWF0aW9uKTtcbiAgICAgIH1cblxuICAgICAgZGF0YS5wbGFjZW1lbnQgPSBwbGFjZW1lbnQgKyAodmFyaWF0aW9uID8gJy0nICsgdmFyaWF0aW9uIDogJycpO1xuXG4gICAgICAvLyB0aGlzIG9iamVjdCBjb250YWlucyBgcG9zaXRpb25gLCB3ZSB3YW50IHRvIHByZXNlcnZlIGl0IGFsb25nIHdpdGhcbiAgICAgIC8vIGFueSBhZGRpdGlvbmFsIHByb3BlcnR5IHdlIG1heSBhZGQgaW4gdGhlIGZ1dHVyZVxuICAgICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IF9leHRlbmRzKHt9LCBkYXRhLm9mZnNldHMucG9wcGVyLCBnZXRQb3BwZXJPZmZzZXRzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCBkYXRhLnBsYWNlbWVudCkpO1xuXG4gICAgICBkYXRhID0gcnVuTW9kaWZpZXJzKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCBkYXRhLCAnZmxpcCcpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAqL1xuZnVuY3Rpb24ga2VlcFRvZ2V0aGVyKGRhdGEpIHtcbiAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xuXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xuICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuICB2YXIgaXNWZXJ0aWNhbCA9IFsndG9wJywgJ2JvdHRvbSddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XG4gIHZhciBzaWRlID0gaXNWZXJ0aWNhbCA/ICdyaWdodCcgOiAnYm90dG9tJztcbiAgdmFyIG9wU2lkZSA9IGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJztcbiAgdmFyIG1lYXN1cmVtZW50ID0gaXNWZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcblxuICBpZiAocG9wcGVyW3NpZGVdIDwgZmxvb3IocmVmZXJlbmNlW29wU2lkZV0pKSB7XG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltvcFNpZGVdID0gZmxvb3IocmVmZXJlbmNlW29wU2lkZV0pIC0gcG9wcGVyW21lYXN1cmVtZW50XTtcbiAgfVxuICBpZiAocG9wcGVyW29wU2lkZV0gPiBmbG9vcihyZWZlcmVuY2Vbc2lkZV0pKSB7XG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltvcFNpZGVdID0gZmxvb3IocmVmZXJlbmNlW3NpZGVdKTtcbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgc3RyaW5nIGNvbnRhaW5pbmcgdmFsdWUgKyB1bml0IGludG8gYSBweCB2YWx1ZSBudW1iZXJcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlcm9mIHttb2RpZmllcnN+b2Zmc2V0fVxuICogQHByaXZhdGVcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBzdHIgLSBWYWx1ZSArIHVuaXQgc3RyaW5nXG4gKiBAYXJndW1lbnQge1N0cmluZ30gbWVhc3VyZW1lbnQgLSBgaGVpZ2h0YCBvciBgd2lkdGhgXG4gKiBAYXJndW1lbnQge09iamVjdH0gcG9wcGVyT2Zmc2V0c1xuICogQGFyZ3VtZW50IHtPYmplY3R9IHJlZmVyZW5jZU9mZnNldHNcbiAqIEByZXR1cm5zIHtOdW1iZXJ8U3RyaW5nfVxuICogVmFsdWUgaW4gcGl4ZWxzLCBvciBvcmlnaW5hbCBzdHJpbmcgaWYgbm8gdmFsdWVzIHdlcmUgZXh0cmFjdGVkXG4gKi9cbmZ1bmN0aW9uIHRvVmFsdWUoc3RyLCBtZWFzdXJlbWVudCwgcG9wcGVyT2Zmc2V0cywgcmVmZXJlbmNlT2Zmc2V0cykge1xuICAvLyBzZXBhcmF0ZSB2YWx1ZSBmcm9tIHVuaXRcbiAgdmFyIHNwbGl0ID0gc3RyLm1hdGNoKC8oKD86XFwtfFxcKyk/XFxkKlxcLj9cXGQqKSguKikvKTtcbiAgdmFyIHZhbHVlID0gK3NwbGl0WzFdO1xuICB2YXIgdW5pdCA9IHNwbGl0WzJdO1xuXG4gIC8vIElmIGl0J3Mgbm90IGEgbnVtYmVyIGl0J3MgYW4gb3BlcmF0b3IsIEkgZ3Vlc3NcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBpZiAodW5pdC5pbmRleE9mKCclJykgPT09IDApIHtcbiAgICB2YXIgZWxlbWVudCA9IHZvaWQgMDtcbiAgICBzd2l0Y2ggKHVuaXQpIHtcbiAgICAgIGNhc2UgJyVwJzpcbiAgICAgICAgZWxlbWVudCA9IHBvcHBlck9mZnNldHM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnJSc6XG4gICAgICBjYXNlICclcic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBlbGVtZW50ID0gcmVmZXJlbmNlT2Zmc2V0cztcbiAgICB9XG5cbiAgICB2YXIgcmVjdCA9IGdldENsaWVudFJlY3QoZWxlbWVudCk7XG4gICAgcmV0dXJuIHJlY3RbbWVhc3VyZW1lbnRdIC8gMTAwICogdmFsdWU7XG4gIH0gZWxzZSBpZiAodW5pdCA9PT0gJ3ZoJyB8fCB1bml0ID09PSAndncnKSB7XG4gICAgLy8gaWYgaXMgYSB2aCBvciB2dywgd2UgY2FsY3VsYXRlIHRoZSBzaXplIGJhc2VkIG9uIHRoZSB2aWV3cG9ydFxuICAgIHZhciBzaXplID0gdm9pZCAwO1xuICAgIGlmICh1bml0ID09PSAndmgnKSB7XG4gICAgICBzaXplID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaXplID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICB9XG4gICAgcmV0dXJuIHNpemUgLyAxMDAgKiB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBpZiBpcyBhbiBleHBsaWNpdCBwaXhlbCB1bml0LCB3ZSBnZXQgcmlkIG9mIHRoZSB1bml0IGFuZCBrZWVwIHRoZSB2YWx1ZVxuICAgIC8vIGlmIGlzIGFuIGltcGxpY2l0IHVuaXQsIGl0J3MgcHgsIGFuZCB3ZSByZXR1cm4ganVzdCB0aGUgdmFsdWVcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSBhbiBgb2Zmc2V0YCBzdHJpbmcgdG8gZXh0cmFwb2xhdGUgYHhgIGFuZCBgeWAgbnVtZXJpYyBvZmZzZXRzLlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyb2Yge21vZGlmaWVyc35vZmZzZXR9XG4gKiBAcHJpdmF0ZVxuICogQGFyZ3VtZW50IHtTdHJpbmd9IG9mZnNldFxuICogQGFyZ3VtZW50IHtPYmplY3R9IHBvcHBlck9mZnNldHNcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSByZWZlcmVuY2VPZmZzZXRzXG4gKiBAYXJndW1lbnQge1N0cmluZ30gYmFzZVBsYWNlbWVudFxuICogQHJldHVybnMge0FycmF5fSBhIHR3byBjZWxscyBhcnJheSB3aXRoIHggYW5kIHkgb2Zmc2V0cyBpbiBudW1iZXJzXG4gKi9cbmZ1bmN0aW9uIHBhcnNlT2Zmc2V0KG9mZnNldCwgcG9wcGVyT2Zmc2V0cywgcmVmZXJlbmNlT2Zmc2V0cywgYmFzZVBsYWNlbWVudCkge1xuICB2YXIgb2Zmc2V0cyA9IFswLCAwXTtcblxuICAvLyBVc2UgaGVpZ2h0IGlmIHBsYWNlbWVudCBpcyBsZWZ0IG9yIHJpZ2h0IGFuZCBpbmRleCBpcyAwIG90aGVyd2lzZSB1c2Ugd2lkdGhcbiAgLy8gaW4gdGhpcyB3YXkgdGhlIGZpcnN0IG9mZnNldCB3aWxsIHVzZSBhbiBheGlzIGFuZCB0aGUgc2Vjb25kIG9uZVxuICAvLyB3aWxsIHVzZSB0aGUgb3RoZXIgb25lXG4gIHZhciB1c2VIZWlnaHQgPSBbJ3JpZ2h0JywgJ2xlZnQnXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcblxuICAvLyBTcGxpdCB0aGUgb2Zmc2V0IHN0cmluZyB0byBvYnRhaW4gYSBsaXN0IG9mIHZhbHVlcyBhbmQgb3BlcmFuZHNcbiAgLy8gVGhlIHJlZ2V4IGFkZHJlc3NlcyB2YWx1ZXMgd2l0aCB0aGUgcGx1cyBvciBtaW51cyBzaWduIGluIGZyb250ICgrMTAsIC0yMCwgZXRjKVxuICB2YXIgZnJhZ21lbnRzID0gb2Zmc2V0LnNwbGl0KC8oXFwrfFxcLSkvKS5tYXAoZnVuY3Rpb24gKGZyYWcpIHtcbiAgICByZXR1cm4gZnJhZy50cmltKCk7XG4gIH0pO1xuXG4gIC8vIERldGVjdCBpZiB0aGUgb2Zmc2V0IHN0cmluZyBjb250YWlucyBhIHBhaXIgb2YgdmFsdWVzIG9yIGEgc2luZ2xlIG9uZVxuICAvLyB0aGV5IGNvdWxkIGJlIHNlcGFyYXRlZCBieSBjb21tYSBvciBzcGFjZVxuICB2YXIgZGl2aWRlciA9IGZyYWdtZW50cy5pbmRleE9mKGZpbmQkMShmcmFnbWVudHMsIGZ1bmN0aW9uIChmcmFnKSB7XG4gICAgcmV0dXJuIGZyYWcuc2VhcmNoKC8sfFxccy8pICE9PSAtMTtcbiAgfSkpO1xuXG4gIGlmIChmcmFnbWVudHNbZGl2aWRlcl0gJiYgZnJhZ21lbnRzW2RpdmlkZXJdLmluZGV4T2YoJywnKSA9PT0gLTEpIHtcbiAgICBjb25zb2xlLndhcm4oJ09mZnNldHMgc2VwYXJhdGVkIGJ5IHdoaXRlIHNwYWNlKHMpIGFyZSBkZXByZWNhdGVkLCB1c2UgYSBjb21tYSAoLCkgaW5zdGVhZC4nKTtcbiAgfVxuXG4gIC8vIElmIGRpdmlkZXIgaXMgZm91bmQsIHdlIGRpdmlkZSB0aGUgbGlzdCBvZiB2YWx1ZXMgYW5kIG9wZXJhbmRzIHRvIGRpdmlkZVxuICAvLyB0aGVtIGJ5IG9mc2V0IFggYW5kIFkuXG4gIHZhciBzcGxpdFJlZ2V4ID0gL1xccyosXFxzKnxcXHMrLztcbiAgdmFyIG9wcyA9IGRpdmlkZXIgIT09IC0xID8gW2ZyYWdtZW50cy5zbGljZSgwLCBkaXZpZGVyKS5jb25jYXQoW2ZyYWdtZW50c1tkaXZpZGVyXS5zcGxpdChzcGxpdFJlZ2V4KVswXV0pLCBbZnJhZ21lbnRzW2RpdmlkZXJdLnNwbGl0KHNwbGl0UmVnZXgpWzFdXS5jb25jYXQoZnJhZ21lbnRzLnNsaWNlKGRpdmlkZXIgKyAxKSldIDogW2ZyYWdtZW50c107XG5cbiAgLy8gQ29udmVydCB0aGUgdmFsdWVzIHdpdGggdW5pdHMgdG8gYWJzb2x1dGUgcGl4ZWxzIHRvIGFsbG93IG91ciBjb21wdXRhdGlvbnNcbiAgb3BzID0gb3BzLm1hcChmdW5jdGlvbiAob3AsIGluZGV4KSB7XG4gICAgLy8gTW9zdCBvZiB0aGUgdW5pdHMgcmVseSBvbiB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHBvcHBlclxuICAgIHZhciBtZWFzdXJlbWVudCA9IChpbmRleCA9PT0gMSA/ICF1c2VIZWlnaHQgOiB1c2VIZWlnaHQpID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuICAgIHZhciBtZXJnZVdpdGhQcmV2aW91cyA9IGZhbHNlO1xuICAgIHJldHVybiBvcFxuICAgIC8vIFRoaXMgYWdncmVnYXRlcyBhbnkgYCtgIG9yIGAtYCBzaWduIHRoYXQgYXJlbid0IGNvbnNpZGVyZWQgb3BlcmF0b3JzXG4gICAgLy8gZS5nLjogMTAgKyArNSA9PiBbMTAsICssICs1XVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIGlmIChhW2EubGVuZ3RoIC0gMV0gPT09ICcnICYmIFsnKycsICctJ10uaW5kZXhPZihiKSAhPT0gLTEpIHtcbiAgICAgICAgYVthLmxlbmd0aCAtIDFdID0gYjtcbiAgICAgICAgbWVyZ2VXaXRoUHJldmlvdXMgPSB0cnVlO1xuICAgICAgICByZXR1cm4gYTtcbiAgICAgIH0gZWxzZSBpZiAobWVyZ2VXaXRoUHJldmlvdXMpIHtcbiAgICAgICAgYVthLmxlbmd0aCAtIDFdICs9IGI7XG4gICAgICAgIG1lcmdlV2l0aFByZXZpb3VzID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGEuY29uY2F0KGIpO1xuICAgICAgfVxuICAgIH0sIFtdKVxuICAgIC8vIEhlcmUgd2UgY29udmVydCB0aGUgc3RyaW5nIHZhbHVlcyBpbnRvIG51bWJlciB2YWx1ZXMgKGluIHB4KVxuICAgIC5tYXAoZnVuY3Rpb24gKHN0cikge1xuICAgICAgcmV0dXJuIHRvVmFsdWUoc3RyLCBtZWFzdXJlbWVudCwgcG9wcGVyT2Zmc2V0cywgcmVmZXJlbmNlT2Zmc2V0cyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIExvb3AgdHJvdWdoIHRoZSBvZmZzZXRzIGFycmF5cyBhbmQgZXhlY3V0ZSB0aGUgb3BlcmF0aW9uc1xuICBvcHMuZm9yRWFjaChmdW5jdGlvbiAob3AsIGluZGV4KSB7XG4gICAgb3AuZm9yRWFjaChmdW5jdGlvbiAoZnJhZywgaW5kZXgyKSB7XG4gICAgICBpZiAoaXNOdW1lcmljKGZyYWcpKSB7XG4gICAgICAgIG9mZnNldHNbaW5kZXhdICs9IGZyYWcgKiAob3BbaW5kZXgyIC0gMV0gPT09ICctJyA/IC0xIDogMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2Zmc2V0cztcbn1cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXG4gKiBAYXJndW1lbnQge051bWJlcnxTdHJpbmd9IG9wdGlvbnMub2Zmc2V0PTBcbiAqIFRoZSBvZmZzZXQgdmFsdWUgYXMgZGVzY3JpYmVkIGluIHRoZSBtb2RpZmllciBkZXNjcmlwdGlvblxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5mdW5jdGlvbiBvZmZzZXQoZGF0YSwgX3JlZikge1xuICB2YXIgb2Zmc2V0ID0gX3JlZi5vZmZzZXQ7XG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudCxcbiAgICAgIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xuXG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XG5cbiAgdmFyIG9mZnNldHMgPSB2b2lkIDA7XG4gIGlmIChpc051bWVyaWMoK29mZnNldCkpIHtcbiAgICBvZmZzZXRzID0gWytvZmZzZXQsIDBdO1xuICB9IGVsc2Uge1xuICAgIG9mZnNldHMgPSBwYXJzZU9mZnNldChvZmZzZXQsIHBvcHBlciwgcmVmZXJlbmNlLCBiYXNlUGxhY2VtZW50KTtcbiAgfVxuXG4gIGlmIChiYXNlUGxhY2VtZW50ID09PSAnbGVmdCcpIHtcbiAgICBwb3BwZXIudG9wICs9IG9mZnNldHNbMF07XG4gICAgcG9wcGVyLmxlZnQgLT0gb2Zmc2V0c1sxXTtcbiAgfSBlbHNlIGlmIChiYXNlUGxhY2VtZW50ID09PSAncmlnaHQnKSB7XG4gICAgcG9wcGVyLnRvcCArPSBvZmZzZXRzWzBdO1xuICAgIHBvcHBlci5sZWZ0ICs9IG9mZnNldHNbMV07XG4gIH0gZWxzZSBpZiAoYmFzZVBsYWNlbWVudCA9PT0gJ3RvcCcpIHtcbiAgICBwb3BwZXIubGVmdCArPSBvZmZzZXRzWzBdO1xuICAgIHBvcHBlci50b3AgLT0gb2Zmc2V0c1sxXTtcbiAgfSBlbHNlIGlmIChiYXNlUGxhY2VtZW50ID09PSAnYm90dG9tJykge1xuICAgIHBvcHBlci5sZWZ0ICs9IG9mZnNldHNbMF07XG4gICAgcG9wcGVyLnRvcCArPSBvZmZzZXRzWzFdO1xuICB9XG5cbiAgZGF0YS5wb3BwZXIgPSBwb3BwZXI7XG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5mdW5jdGlvbiBwcmV2ZW50T3ZlcmZsb3coZGF0YSwgb3B0aW9ucykge1xuICB2YXIgYm91bmRhcmllc0VsZW1lbnQgPSBvcHRpb25zLmJvdW5kYXJpZXNFbGVtZW50IHx8IGdldE9mZnNldFBhcmVudChkYXRhLmluc3RhbmNlLnBvcHBlcik7XG5cbiAgLy8gSWYgb2Zmc2V0UGFyZW50IGlzIHRoZSByZWZlcmVuY2UgZWxlbWVudCwgd2UgcmVhbGx5IHdhbnQgdG9cbiAgLy8gZ28gb25lIHN0ZXAgdXAgYW5kIHVzZSB0aGUgbmV4dCBvZmZzZXRQYXJlbnQgYXMgcmVmZXJlbmNlIHRvXG4gIC8vIGF2b2lkIHRvIG1ha2UgdGhpcyBtb2RpZmllciBjb21wbGV0ZWx5IHVzZWxlc3MgYW5kIGxvb2sgbGlrZSBicm9rZW5cbiAgaWYgKGRhdGEuaW5zdGFuY2UucmVmZXJlbmNlID09PSBib3VuZGFyaWVzRWxlbWVudCkge1xuICAgIGJvdW5kYXJpZXNFbGVtZW50ID0gZ2V0T2Zmc2V0UGFyZW50KGJvdW5kYXJpZXNFbGVtZW50KTtcbiAgfVxuXG4gIHZhciBib3VuZGFyaWVzID0gZ2V0Qm91bmRhcmllcyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5pbnN0YW5jZS5yZWZlcmVuY2UsIG9wdGlvbnMucGFkZGluZywgYm91bmRhcmllc0VsZW1lbnQpO1xuICBvcHRpb25zLmJvdW5kYXJpZXMgPSBib3VuZGFyaWVzO1xuXG4gIHZhciBvcmRlciA9IG9wdGlvbnMucHJpb3JpdHk7XG4gIHZhciBwb3BwZXIgPSBkYXRhLm9mZnNldHMucG9wcGVyO1xuXG4gIHZhciBjaGVjayA9IHtcbiAgICBwcmltYXJ5OiBmdW5jdGlvbiBwcmltYXJ5KHBsYWNlbWVudCkge1xuICAgICAgdmFyIHZhbHVlID0gcG9wcGVyW3BsYWNlbWVudF07XG4gICAgICBpZiAocG9wcGVyW3BsYWNlbWVudF0gPCBib3VuZGFyaWVzW3BsYWNlbWVudF0gJiYgIW9wdGlvbnMuZXNjYXBlV2l0aFJlZmVyZW5jZSkge1xuICAgICAgICB2YWx1ZSA9IE1hdGgubWF4KHBvcHBlcltwbGFjZW1lbnRdLCBib3VuZGFyaWVzW3BsYWNlbWVudF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KHt9LCBwbGFjZW1lbnQsIHZhbHVlKTtcbiAgICB9LFxuICAgIHNlY29uZGFyeTogZnVuY3Rpb24gc2Vjb25kYXJ5KHBsYWNlbWVudCkge1xuICAgICAgdmFyIG1haW5TaWRlID0gcGxhY2VtZW50ID09PSAncmlnaHQnID8gJ2xlZnQnIDogJ3RvcCc7XG4gICAgICB2YXIgdmFsdWUgPSBwb3BwZXJbbWFpblNpZGVdO1xuICAgICAgaWYgKHBvcHBlcltwbGFjZW1lbnRdID4gYm91bmRhcmllc1twbGFjZW1lbnRdICYmICFvcHRpb25zLmVzY2FwZVdpdGhSZWZlcmVuY2UpIHtcbiAgICAgICAgdmFsdWUgPSBNYXRoLm1pbihwb3BwZXJbbWFpblNpZGVdLCBib3VuZGFyaWVzW3BsYWNlbWVudF0gLSAocGxhY2VtZW50ID09PSAncmlnaHQnID8gcG9wcGVyLndpZHRoIDogcG9wcGVyLmhlaWdodCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KHt9LCBtYWluU2lkZSwgdmFsdWUpO1xuICAgIH1cbiAgfTtcblxuICBvcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICB2YXIgc2lkZSA9IFsnbGVmdCcsICd0b3AnXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xID8gJ3ByaW1hcnknIDogJ3NlY29uZGFyeSc7XG4gICAgcG9wcGVyID0gX2V4dGVuZHMoe30sIHBvcHBlciwgY2hlY2tbc2lkZV0ocGxhY2VtZW50KSk7XG4gIH0pO1xuXG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBwb3BwZXI7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXG4gKi9cbmZ1bmN0aW9uIHNoaWZ0KGRhdGEpIHtcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50O1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xuICB2YXIgc2hpZnR2YXJpYXRpb24gPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcblxuICAvLyBpZiBzaGlmdCBzaGlmdHZhcmlhdGlvbiBpcyBzcGVjaWZpZWQsIHJ1biB0aGUgbW9kaWZpZXJcbiAgaWYgKHNoaWZ0dmFyaWF0aW9uKSB7XG4gICAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXG4gICAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlLFxuICAgICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcjtcblxuICAgIHZhciBpc1ZlcnRpY2FsID0gWydib3R0b20nLCAndG9wJ10uaW5kZXhPZihiYXNlUGxhY2VtZW50KSAhPT0gLTE7XG4gICAgdmFyIHNpZGUgPSBpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCc7XG4gICAgdmFyIG1lYXN1cmVtZW50ID0gaXNWZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcblxuICAgIHZhciBzaGlmdE9mZnNldHMgPSB7XG4gICAgICBzdGFydDogZGVmaW5lUHJvcGVydHkoe30sIHNpZGUsIHJlZmVyZW5jZVtzaWRlXSksXG4gICAgICBlbmQ6IGRlZmluZVByb3BlcnR5KHt9LCBzaWRlLCByZWZlcmVuY2Vbc2lkZV0gKyByZWZlcmVuY2VbbWVhc3VyZW1lbnRdIC0gcG9wcGVyW21lYXN1cmVtZW50XSlcbiAgICB9O1xuXG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IF9leHRlbmRzKHt9LCBwb3BwZXIsIHNoaWZ0T2Zmc2V0c1tzaGlmdHZhcmlhdGlvbl0pO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5mdW5jdGlvbiBoaWRlKGRhdGEpIHtcbiAgaWYgKCFpc01vZGlmaWVyUmVxdWlyZWQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsICdoaWRlJywgJ3ByZXZlbnRPdmVyZmxvdycpKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICB2YXIgcmVmUmVjdCA9IGRhdGEub2Zmc2V0cy5yZWZlcmVuY2U7XG4gIHZhciBib3VuZCA9IGZpbmQkMShkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgcmV0dXJuIG1vZGlmaWVyLm5hbWUgPT09ICdwcmV2ZW50T3ZlcmZsb3cnO1xuICB9KS5ib3VuZGFyaWVzO1xuXG4gIGlmIChyZWZSZWN0LmJvdHRvbSA8IGJvdW5kLnRvcCB8fCByZWZSZWN0LmxlZnQgPiBib3VuZC5yaWdodCB8fCByZWZSZWN0LnRvcCA+IGJvdW5kLmJvdHRvbSB8fCByZWZSZWN0LnJpZ2h0IDwgYm91bmQubGVmdCkge1xuICAgIC8vIEF2b2lkIHVubmVjZXNzYXJ5IERPTSBhY2Nlc3MgaWYgdmlzaWJpbGl0eSBoYXNuJ3QgY2hhbmdlZFxuICAgIGlmIChkYXRhLmhpZGUgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGRhdGEuaGlkZSA9IHRydWU7XG4gICAgZGF0YS5hdHRyaWJ1dGVzWyd4LW91dC1vZi1ib3VuZGFyaWVzJ10gPSAnJztcbiAgfSBlbHNlIHtcbiAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBET00gYWNjZXNzIGlmIHZpc2liaWxpdHkgaGFzbid0IGNoYW5nZWRcbiAgICBpZiAoZGF0YS5oaWRlID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgZGF0YS5oaWRlID0gZmFsc2U7XG4gICAgZGF0YS5hdHRyaWJ1dGVzWyd4LW91dC1vZi1ib3VuZGFyaWVzJ10gPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5mdW5jdGlvbiBpbm5lcihkYXRhKSB7XG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudDtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcbiAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xuXG4gIHZhciBpc0hvcml6ID0gWydsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZihiYXNlUGxhY2VtZW50KSAhPT0gLTE7XG5cbiAgdmFyIHN1YnRyYWN0TGVuZ3RoID0gWyd0b3AnLCAnbGVmdCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPT09IC0xO1xuXG4gIHBvcHBlcltpc0hvcml6ID8gJ2xlZnQnIDogJ3RvcCddID0gcmVmZXJlbmNlW2Jhc2VQbGFjZW1lbnRdIC0gKHN1YnRyYWN0TGVuZ3RoID8gcG9wcGVyW2lzSG9yaXogPyAnd2lkdGgnIDogJ2hlaWdodCddIDogMCk7XG5cbiAgZGF0YS5wbGFjZW1lbnQgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuICBkYXRhLm9mZnNldHMucG9wcGVyID0gZ2V0Q2xpZW50UmVjdChwb3BwZXIpO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIE1vZGlmaWVyIGZ1bmN0aW9uLCBlYWNoIG1vZGlmaWVyIGNhbiBoYXZlIGEgZnVuY3Rpb24gb2YgdGhpcyB0eXBlIGFzc2lnbmVkXG4gKiB0byBpdHMgYGZuYCBwcm9wZXJ0eS48YnIgLz5cbiAqIFRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIGNhbGxlZCBvbiBlYWNoIHVwZGF0ZSwgdGhpcyBtZWFucyB0aGF0IHlvdSBtdXN0XG4gKiBtYWtlIHN1cmUgdGhleSBhcmUgcGVyZm9ybWFudCBlbm91Z2ggdG8gYXZvaWQgcGVyZm9ybWFuY2UgYm90dGxlbmVja3MuXG4gKlxuICogQGZ1bmN0aW9uIE1vZGlmaWVyRm5cbiAqIEBhcmd1bWVudCB7ZGF0YU9iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXG4gKiBAcmV0dXJucyB7ZGF0YU9iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5cbi8qKlxuICogTW9kaWZpZXJzIGFyZSBwbHVnaW5zIHVzZWQgdG8gYWx0ZXIgdGhlIGJlaGF2aW9yIG9mIHlvdXIgcG9wcGVycy48YnIgLz5cbiAqIFBvcHBlci5qcyB1c2VzIGEgc2V0IG9mIDkgbW9kaWZpZXJzIHRvIHByb3ZpZGUgYWxsIHRoZSBiYXNpYyBmdW5jdGlvbmFsaXRpZXNcbiAqIG5lZWRlZCBieSB0aGUgbGlicmFyeS5cbiAqXG4gKiBVc3VhbGx5IHlvdSBkb24ndCB3YW50IHRvIG92ZXJyaWRlIHRoZSBgb3JkZXJgLCBgZm5gIGFuZCBgb25Mb2FkYCBwcm9wcy5cbiAqIEFsbCB0aGUgb3RoZXIgcHJvcGVydGllcyBhcmUgY29uZmlndXJhdGlvbnMgdGhhdCBjb3VsZCBiZSB0d2Vha2VkLlxuICogQG5hbWVzcGFjZSBtb2RpZmllcnNcbiAqL1xudmFyIG1vZGlmaWVycyA9IHtcbiAgLyoqXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gc2hpZnQgdGhlIHBvcHBlciBvbiB0aGUgc3RhcnQgb3IgZW5kIG9mIGl0cyByZWZlcmVuY2VcbiAgICogZWxlbWVudC48YnIgLz5cbiAgICogSXQgd2lsbCByZWFkIHRoZSB2YXJpYXRpb24gb2YgdGhlIGBwbGFjZW1lbnRgIHByb3BlcnR5LjxiciAvPlxuICAgKiBJdCBjYW4gYmUgb25lIGVpdGhlciBgLWVuZGAgb3IgYC1zdGFydGAuXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcbiAgICogQGlubmVyXG4gICAqL1xuICBzaGlmdDoge1xuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj0xMDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXG4gICAgb3JkZXI6IDEwMCxcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXG4gICAgZm46IHNoaWZ0XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBgb2Zmc2V0YCBtb2RpZmllciBjYW4gc2hpZnQgeW91ciBwb3BwZXIgb24gYm90aCBpdHMgYXhpcy5cbiAgICpcbiAgICogSXQgYWNjZXB0cyB0aGUgZm9sbG93aW5nIHVuaXRzOlxuICAgKiAtIGBweGAgb3IgdW5pdGxlc3MsIGludGVycHJldGVkIGFzIHBpeGVsc1xuICAgKiAtIGAlYCBvciBgJXJgLCBwZXJjZW50YWdlIHJlbGF0aXZlIHRvIHRoZSBsZW5ndGggb2YgdGhlIHJlZmVyZW5jZSBlbGVtZW50XG4gICAqIC0gYCVwYCwgcGVyY2VudGFnZSByZWxhdGl2ZSB0byB0aGUgbGVuZ3RoIG9mIHRoZSBwb3BwZXIgZWxlbWVudFxuICAgKiAtIGB2d2AsIENTUyB2aWV3cG9ydCB3aWR0aCB1bml0XG4gICAqIC0gYHZoYCwgQ1NTIHZpZXdwb3J0IGhlaWdodCB1bml0XG4gICAqXG4gICAqIEZvciBsZW5ndGggaXMgaW50ZW5kZWQgdGhlIG1haW4gYXhpcyByZWxhdGl2ZSB0byB0aGUgcGxhY2VtZW50IG9mIHRoZSBwb3BwZXIuPGJyIC8+XG4gICAqIFRoaXMgbWVhbnMgdGhhdCBpZiB0aGUgcGxhY2VtZW50IGlzIGB0b3BgIG9yIGBib3R0b21gLCB0aGUgbGVuZ3RoIHdpbGwgYmUgdGhlXG4gICAqIGB3aWR0aGAuIEluIGNhc2Ugb2YgYGxlZnRgIG9yIGByaWdodGAsIGl0IHdpbGwgYmUgdGhlIGhlaWdodC5cbiAgICpcbiAgICogWW91IGNhbiBwcm92aWRlIGEgc2luZ2xlIHZhbHVlIChhcyBgTnVtYmVyYCBvciBgU3RyaW5nYCksIG9yIGEgcGFpciBvZiB2YWx1ZXNcbiAgICogYXMgYFN0cmluZ2AgZGl2aWRlZCBieSBhIGNvbW1hIG9yIG9uZSAob3IgbW9yZSkgd2hpdGUgc3BhY2VzLjxiciAvPlxuICAgKiBUaGUgbGF0dGVyIGlzIGEgZGVwcmVjYXRlZCBtZXRob2QgYmVjYXVzZSBpdCBsZWFkcyB0byBjb25mdXNpb24gYW5kIHdpbGwgYmVcbiAgICogcmVtb3ZlZCBpbiB2Mi48YnIgLz5cbiAgICogQWRkaXRpb25hbGx5LCBpdCBhY2NlcHRzIGFkZGl0aW9ucyBhbmQgc3VidHJhY3Rpb25zIGJldHdlZW4gZGlmZmVyZW50IHVuaXRzLlxuICAgKiBOb3RlIHRoYXQgbXVsdGlwbGljYXRpb25zIGFuZCBkaXZpc2lvbnMgYXJlbid0IHN1cHBvcnRlZC5cbiAgICpcbiAgICogVmFsaWQgZXhhbXBsZXMgYXJlOlxuICAgKiBgYGBcbiAgICogMTBcbiAgICogJzEwJSdcbiAgICogJzEwLCAxMCdcbiAgICogJzEwJSwgMTAnXG4gICAqICcxMCArIDEwJSdcbiAgICogJzEwIC0gNXZoICsgMyUnXG4gICAqICctMTBweCArIDV2aCwgNXB4IC0gNiUnXG4gICAqIGBgYFxuICAgKiA+ICoqTkIqKjogSWYgeW91IGRlc2lyZSB0byBhcHBseSBvZmZzZXRzIHRvIHlvdXIgcG9wcGVycyBpbiBhIHdheSB0aGF0IG1heSBtYWtlIHRoZW0gb3ZlcmxhcFxuICAgKiA+IHdpdGggdGhlaXIgcmVmZXJlbmNlIGVsZW1lbnQsIHVuZm9ydHVuYXRlbHksIHlvdSB3aWxsIGhhdmUgdG8gZGlzYWJsZSB0aGUgYGZsaXBgIG1vZGlmaWVyLlxuICAgKiA+IE1vcmUgb24gdGhpcyBbcmVhZGluZyB0aGlzIGlzc3VlXShodHRwczovL2dpdGh1Yi5jb20vRmV6VnJhc3RhL3BvcHBlci5qcy9pc3N1ZXMvMzczKVxuICAgKlxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXG4gICAqIEBpbm5lclxuICAgKi9cbiAgb2Zmc2V0OiB7XG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTIwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cbiAgICBvcmRlcjogMjAwLFxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cbiAgICBmbjogb2Zmc2V0LFxuICAgIC8qKiBAcHJvcCB7TnVtYmVyfFN0cmluZ30gb2Zmc2V0PTBcbiAgICAgKiBUaGUgb2Zmc2V0IHZhbHVlIGFzIGRlc2NyaWJlZCBpbiB0aGUgbW9kaWZpZXIgZGVzY3JpcHRpb25cbiAgICAgKi9cbiAgICBvZmZzZXQ6IDBcbiAgfSxcblxuICAvKipcbiAgICogTW9kaWZpZXIgdXNlZCB0byBwcmV2ZW50IHRoZSBwb3BwZXIgZnJvbSBiZWluZyBwb3NpdGlvbmVkIG91dHNpZGUgdGhlIGJvdW5kYXJ5LlxuICAgKlxuICAgKiBBbiBzY2VuYXJpbyBleGlzdHMgd2hlcmUgdGhlIHJlZmVyZW5jZSBpdHNlbGYgaXMgbm90IHdpdGhpbiB0aGUgYm91bmRhcmllcy48YnIgLz5cbiAgICogV2UgY2FuIHNheSBpdCBoYXMgXCJlc2NhcGVkIHRoZSBib3VuZGFyaWVzXCIg4oCUIG9yIGp1c3QgXCJlc2NhcGVkXCIuPGJyIC8+XG4gICAqIEluIHRoaXMgY2FzZSB3ZSBuZWVkIHRvIGRlY2lkZSB3aGV0aGVyIHRoZSBwb3BwZXIgc2hvdWxkIGVpdGhlcjpcbiAgICpcbiAgICogLSBkZXRhY2ggZnJvbSB0aGUgcmVmZXJlbmNlIGFuZCByZW1haW4gXCJ0cmFwcGVkXCIgaW4gdGhlIGJvdW5kYXJpZXMsIG9yXG4gICAqIC0gaWYgaXQgc2hvdWxkIGlnbm9yZSB0aGUgYm91bmRhcnkgYW5kIFwiZXNjYXBlIHdpdGggaXRzIHJlZmVyZW5jZVwiXG4gICAqXG4gICAqIFdoZW4gYGVzY2FwZVdpdGhSZWZlcmVuY2VgIGlzIHNldCB0b2B0cnVlYCBhbmQgcmVmZXJlbmNlIGlzIGNvbXBsZXRlbHlcbiAgICogb3V0c2lkZSBpdHMgYm91bmRhcmllcywgdGhlIHBvcHBlciB3aWxsIG92ZXJmbG93IChvciBjb21wbGV0ZWx5IGxlYXZlKVxuICAgKiB0aGUgYm91bmRhcmllcyBpbiBvcmRlciB0byByZW1haW4gYXR0YWNoZWQgdG8gdGhlIGVkZ2Ugb2YgdGhlIHJlZmVyZW5jZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xuICAgKiBAaW5uZXJcbiAgICovXG4gIHByZXZlbnRPdmVyZmxvdzoge1xuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj0zMDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXG4gICAgb3JkZXI6IDMwMCxcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXG4gICAgZm46IHByZXZlbnRPdmVyZmxvdyxcbiAgICAvKipcbiAgICAgKiBAcHJvcCB7QXJyYXl9IFtwcmlvcml0eT1bJ2xlZnQnLCdyaWdodCcsJ3RvcCcsJ2JvdHRvbSddXVxuICAgICAqIFBvcHBlciB3aWxsIHRyeSB0byBwcmV2ZW50IG92ZXJmbG93IGZvbGxvd2luZyB0aGVzZSBwcmlvcml0aWVzIGJ5IGRlZmF1bHQsXG4gICAgICogdGhlbiwgaXQgY291bGQgb3ZlcmZsb3cgb24gdGhlIGxlZnQgYW5kIG9uIHRvcCBvZiB0aGUgYGJvdW5kYXJpZXNFbGVtZW50YFxuICAgICAqL1xuICAgIHByaW9yaXR5OiBbJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbSddLFxuICAgIC8qKlxuICAgICAqIEBwcm9wIHtudW1iZXJ9IHBhZGRpbmc9NVxuICAgICAqIEFtb3VudCBvZiBwaXhlbCB1c2VkIHRvIGRlZmluZSBhIG1pbmltdW0gZGlzdGFuY2UgYmV0d2VlbiB0aGUgYm91bmRhcmllc1xuICAgICAqIGFuZCB0aGUgcG9wcGVyIHRoaXMgbWFrZXMgc3VyZSB0aGUgcG9wcGVyIGhhcyBhbHdheXMgYSBsaXR0bGUgcGFkZGluZ1xuICAgICAqIGJldHdlZW4gdGhlIGVkZ2VzIG9mIGl0cyBjb250YWluZXJcbiAgICAgKi9cbiAgICBwYWRkaW5nOiA1LFxuICAgIC8qKlxuICAgICAqIEBwcm9wIHtTdHJpbmd8SFRNTEVsZW1lbnR9IGJvdW5kYXJpZXNFbGVtZW50PSdzY3JvbGxQYXJlbnQnXG4gICAgICogQm91bmRhcmllcyB1c2VkIGJ5IHRoZSBtb2RpZmllciwgY2FuIGJlIGBzY3JvbGxQYXJlbnRgLCBgd2luZG93YCxcbiAgICAgKiBgdmlld3BvcnRgIG9yIGFueSBET00gZWxlbWVudC5cbiAgICAgKi9cbiAgICBib3VuZGFyaWVzRWxlbWVudDogJ3Njcm9sbFBhcmVudCdcbiAgfSxcblxuICAvKipcbiAgICogTW9kaWZpZXIgdXNlZCB0byBtYWtlIHN1cmUgdGhlIHJlZmVyZW5jZSBhbmQgaXRzIHBvcHBlciBzdGF5IG5lYXIgZWFjaG90aGVyc1xuICAgKiB3aXRob3V0IGxlYXZpbmcgYW55IGdhcCBiZXR3ZWVuIHRoZSB0d28uIEV4cGVjaWFsbHkgdXNlZnVsIHdoZW4gdGhlIGFycm93IGlzXG4gICAqIGVuYWJsZWQgYW5kIHlvdSB3YW50IHRvIGFzc3VyZSBpdCB0byBwb2ludCB0byBpdHMgcmVmZXJlbmNlIGVsZW1lbnQuXG4gICAqIEl0IGNhcmVzIG9ubHkgYWJvdXQgdGhlIGZpcnN0IGF4aXMsIHlvdSBjYW4gc3RpbGwgaGF2ZSBwb3BwZXJzIHdpdGggbWFyZ2luXG4gICAqIGJldHdlZW4gdGhlIHBvcHBlciBhbmQgaXRzIHJlZmVyZW5jZSBlbGVtZW50LlxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXG4gICAqIEBpbm5lclxuICAgKi9cbiAga2VlcFRvZ2V0aGVyOiB7XG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTQwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cbiAgICBvcmRlcjogNDAwLFxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cbiAgICBmbjoga2VlcFRvZ2V0aGVyXG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kaWZpZXIgaXMgdXNlZCB0byBtb3ZlIHRoZSBgYXJyb3dFbGVtZW50YCBvZiB0aGUgcG9wcGVyIHRvIG1ha2VcbiAgICogc3VyZSBpdCBpcyBwb3NpdGlvbmVkIGJldHdlZW4gdGhlIHJlZmVyZW5jZSBlbGVtZW50IGFuZCBpdHMgcG9wcGVyIGVsZW1lbnQuXG4gICAqIEl0IHdpbGwgcmVhZCB0aGUgb3V0ZXIgc2l6ZSBvZiB0aGUgYGFycm93RWxlbWVudGAgbm9kZSB0byBkZXRlY3QgaG93IG1hbnlcbiAgICogcGl4ZWxzIG9mIGNvbmp1Y3Rpb24gYXJlIG5lZWRlZC5cbiAgICpcbiAgICogSXQgaGFzIG5vIGVmZmVjdCBpZiBubyBgYXJyb3dFbGVtZW50YCBpcyBwcm92aWRlZC5cbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xuICAgKiBAaW5uZXJcbiAgICovXG4gIGFycm93OiB7XG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTUwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cbiAgICBvcmRlcjogNTAwLFxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cbiAgICBmbjogYXJyb3csXG4gICAgLyoqIEBwcm9wIHtTdHJpbmd8SFRNTEVsZW1lbnR9IGVsZW1lbnQ9J1t4LWFycm93XScgLSBTZWxlY3RvciBvciBub2RlIHVzZWQgYXMgYXJyb3cgKi9cbiAgICBlbGVtZW50OiAnW3gtYXJyb3ddJ1xuICB9LFxuXG4gIC8qKlxuICAgKiBNb2RpZmllciB1c2VkIHRvIGZsaXAgdGhlIHBvcHBlcidzIHBsYWNlbWVudCB3aGVuIGl0IHN0YXJ0cyB0byBvdmVybGFwIGl0c1xuICAgKiByZWZlcmVuY2UgZWxlbWVudC5cbiAgICpcbiAgICogUmVxdWlyZXMgdGhlIGBwcmV2ZW50T3ZlcmZsb3dgIG1vZGlmaWVyIGJlZm9yZSBpdCBpbiBvcmRlciB0byB3b3JrLlxuICAgKlxuICAgKiAqKk5PVEU6KiogdGhpcyBtb2RpZmllciB3aWxsIGludGVycnVwdCB0aGUgY3VycmVudCB1cGRhdGUgY3ljbGUgYW5kIHdpbGxcbiAgICogcmVzdGFydCBpdCBpZiBpdCBkZXRlY3RzIHRoZSBuZWVkIHRvIGZsaXAgdGhlIHBsYWNlbWVudC5cbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xuICAgKiBAaW5uZXJcbiAgICovXG4gIGZsaXA6IHtcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9NjAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xuICAgIG9yZGVyOiA2MDAsXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xuICAgIGZuOiBmbGlwLFxuICAgIC8qKlxuICAgICAqIEBwcm9wIHtTdHJpbmd8QXJyYXl9IGJlaGF2aW9yPSdmbGlwJ1xuICAgICAqIFRoZSBiZWhhdmlvciB1c2VkIHRvIGNoYW5nZSB0aGUgcG9wcGVyJ3MgcGxhY2VtZW50LiBJdCBjYW4gYmUgb25lIG9mXG4gICAgICogYGZsaXBgLCBgY2xvY2t3aXNlYCwgYGNvdW50ZXJjbG9ja3dpc2VgIG9yIGFuIGFycmF5IHdpdGggYSBsaXN0IG9mIHZhbGlkXG4gICAgICogcGxhY2VtZW50cyAod2l0aCBvcHRpb25hbCB2YXJpYXRpb25zKS5cbiAgICAgKi9cbiAgICBiZWhhdmlvcjogJ2ZsaXAnLFxuICAgIC8qKlxuICAgICAqIEBwcm9wIHtudW1iZXJ9IHBhZGRpbmc9NVxuICAgICAqIFRoZSBwb3BwZXIgd2lsbCBmbGlwIGlmIGl0IGhpdHMgdGhlIGVkZ2VzIG9mIHRoZSBgYm91bmRhcmllc0VsZW1lbnRgXG4gICAgICovXG4gICAgcGFkZGluZzogNSxcbiAgICAvKipcbiAgICAgKiBAcHJvcCB7U3RyaW5nfEhUTUxFbGVtZW50fSBib3VuZGFyaWVzRWxlbWVudD0ndmlld3BvcnQnXG4gICAgICogVGhlIGVsZW1lbnQgd2hpY2ggd2lsbCBkZWZpbmUgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIHBvcHBlciBwb3NpdGlvbixcbiAgICAgKiB0aGUgcG9wcGVyIHdpbGwgbmV2ZXIgYmUgcGxhY2VkIG91dHNpZGUgb2YgdGhlIGRlZmluZWQgYm91bmRhcmllc1xuICAgICAqIChleGNlcHQgaWYga2VlcFRvZ2V0aGVyIGlzIGVuYWJsZWQpXG4gICAgICovXG4gICAgYm91bmRhcmllc0VsZW1lbnQ6ICd2aWV3cG9ydCdcbiAgfSxcblxuICAvKipcbiAgICogTW9kaWZpZXIgdXNlZCB0byBtYWtlIHRoZSBwb3BwZXIgZmxvdyB0b3dhcmQgdGhlIGlubmVyIG9mIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cbiAgICogQnkgZGVmYXVsdCwgd2hlbiB0aGlzIG1vZGlmaWVyIGlzIGRpc2FibGVkLCB0aGUgcG9wcGVyIHdpbGwgYmUgcGxhY2VkIG91dHNpZGVcbiAgICogdGhlIHJlZmVyZW5jZSBlbGVtZW50LlxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXG4gICAqIEBpbm5lclxuICAgKi9cbiAgaW5uZXI6IHtcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9NzAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xuICAgIG9yZGVyOiA3MDAsXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPWZhbHNlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXG4gICAgZm46IGlubmVyXG4gIH0sXG5cbiAgLyoqXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gaGlkZSB0aGUgcG9wcGVyIHdoZW4gaXRzIHJlZmVyZW5jZSBlbGVtZW50IGlzIG91dHNpZGUgb2YgdGhlXG4gICAqIHBvcHBlciBib3VuZGFyaWVzLiBJdCB3aWxsIHNldCBhIGB4LW91dC1vZi1ib3VuZGFyaWVzYCBhdHRyaWJ1dGUgd2hpY2ggY2FuXG4gICAqIGJlIHVzZWQgdG8gaGlkZSB3aXRoIGEgQ1NTIHNlbGVjdG9yIHRoZSBwb3BwZXIgd2hlbiBpdHMgcmVmZXJlbmNlIGlzXG4gICAqIG91dCBvZiBib3VuZGFyaWVzLlxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGUgYHByZXZlbnRPdmVyZmxvd2AgbW9kaWZpZXIgYmVmb3JlIGl0IGluIG9yZGVyIHRvIHdvcmsuXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcbiAgICogQGlubmVyXG4gICAqL1xuICBoaWRlOiB7XG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTgwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cbiAgICBvcmRlcjogODAwLFxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cbiAgICBmbjogaGlkZVxuICB9LFxuXG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgc3R5bGUgdGhhdCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlciBlbGVtZW50IHRvIGdldHNcbiAgICogcHJvcGVybHkgcG9zaXRpb25lZC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgbW9kaWZpZXIgd2lsbCBub3QgdG91Y2ggdGhlIERPTSwgaXQganVzdCBwcmVwYXJlcyB0aGUgc3R5bGVzXG4gICAqIHNvIHRoYXQgYGFwcGx5U3R5bGVgIG1vZGlmaWVyIGNhbiBhcHBseSBpdC4gVGhpcyBzZXBhcmF0aW9uIGlzIHVzZWZ1bFxuICAgKiBpbiBjYXNlIHlvdSBuZWVkIHRvIHJlcGxhY2UgYGFwcGx5U3R5bGVgIHdpdGggYSBjdXN0b20gaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIFRoaXMgbW9kaWZpZXIgaGFzIGA4NTBgIGFzIGBvcmRlcmAgdmFsdWUgdG8gbWFpbnRhaW4gYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgKiB3aXRoIHByZXZpb3VzIHZlcnNpb25zIG9mIFBvcHBlci5qcy4gRXhwZWN0IHRoZSBtb2RpZmllcnMgb3JkZXJpbmcgbWV0aG9kXG4gICAqIHRvIGNoYW5nZSBpbiBmdXR1cmUgbWFqb3IgdmVyc2lvbnMgb2YgdGhlIGxpYnJhcnkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcbiAgICogQGlubmVyXG4gICAqL1xuICBjb21wdXRlU3R5bGU6IHtcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9ODUwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xuICAgIG9yZGVyOiA4NTAsXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xuICAgIGZuOiBjb21wdXRlU3R5bGUsXG4gICAgLyoqXG4gICAgICogQHByb3Age0Jvb2xlYW59IGdwdUFjY2VsZXJhdGlvbj10cnVlXG4gICAgICogSWYgdHJ1ZSwgaXQgdXNlcyB0aGUgQ1NTIDNkIHRyYW5zZm9ybWF0aW9uIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXIuXG4gICAgICogT3RoZXJ3aXNlLCBpdCB3aWxsIHVzZSB0aGUgYHRvcGAgYW5kIGBsZWZ0YCBwcm9wZXJ0aWVzLlxuICAgICAqL1xuICAgIGdwdUFjY2VsZXJhdGlvbjogdHJ1ZSxcbiAgICAvKipcbiAgICAgKiBAcHJvcCB7c3RyaW5nfSBbeD0nYm90dG9tJ11cbiAgICAgKiBXaGVyZSB0byBhbmNob3IgdGhlIFggYXhpcyAoYGJvdHRvbWAgb3IgYHRvcGApLiBBS0EgWCBvZmZzZXQgb3JpZ2luLlxuICAgICAqIENoYW5nZSB0aGlzIGlmIHlvdXIgcG9wcGVyIHNob3VsZCBncm93IGluIGEgZGlyZWN0aW9uIGRpZmZlcmVudCBmcm9tIGBib3R0b21gXG4gICAgICovXG4gICAgeDogJ2JvdHRvbScsXG4gICAgLyoqXG4gICAgICogQHByb3Age3N0cmluZ30gW3g9J2xlZnQnXVxuICAgICAqIFdoZXJlIHRvIGFuY2hvciB0aGUgWSBheGlzIChgbGVmdGAgb3IgYHJpZ2h0YCkuIEFLQSBZIG9mZnNldCBvcmlnaW4uXG4gICAgICogQ2hhbmdlIHRoaXMgaWYgeW91ciBwb3BwZXIgc2hvdWxkIGdyb3cgaW4gYSBkaXJlY3Rpb24gZGlmZmVyZW50IGZyb20gYHJpZ2h0YFxuICAgICAqL1xuICAgIHk6ICdyaWdodCdcbiAgfSxcblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgY29tcHV0ZWQgc3R5bGVzIHRvIHRoZSBwb3BwZXIgZWxlbWVudC5cbiAgICpcbiAgICogQWxsIHRoZSBET00gbWFuaXB1bGF0aW9ucyBhcmUgbGltaXRlZCB0byB0aGlzIG1vZGlmaWVyLiBUaGlzIGlzIHVzZWZ1bCBpbiBjYXNlXG4gICAqIHlvdSB3YW50IHRvIGludGVncmF0ZSBQb3BwZXIuanMgaW5zaWRlIGEgZnJhbWV3b3JrIG9yIHZpZXcgbGlicmFyeSBhbmQgeW91XG4gICAqIHdhbnQgdG8gZGVsZWdhdGUgYWxsIHRoZSBET00gbWFuaXB1bGF0aW9ucyB0byBpdC5cbiAgICpcbiAgICogTm90ZSB0aGF0IGlmIHlvdSBkaXNhYmxlIHRoaXMgbW9kaWZpZXIsIHlvdSBtdXN0IG1ha2Ugc3VyZSB0aGUgcG9wcGVyIGVsZW1lbnRcbiAgICogaGFzIGl0cyBwb3NpdGlvbiBzZXQgdG8gYGFic29sdXRlYCBiZWZvcmUgUG9wcGVyLmpzIGNhbiBkbyBpdHMgd29yayFcbiAgICpcbiAgICogSnVzdCBkaXNhYmxlIHRoaXMgbW9kaWZpZXIgYW5kIGRlZmluZSB5b3Ugb3duIHRvIGFjaGlldmUgdGhlIGRlc2lyZWQgZWZmZWN0LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXG4gICAqIEBpbm5lclxuICAgKi9cbiAgYXBwbHlTdHlsZToge1xuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj05MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXG4gICAgb3JkZXI6IDkwMCxcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXG4gICAgZm46IGFwcGx5U3R5bGUsXG4gICAgLyoqIEBwcm9wIHtGdW5jdGlvbn0gKi9cbiAgICBvbkxvYWQ6IGFwcGx5U3R5bGVPbkxvYWQsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAxLjEwLjAsIHRoZSBwcm9wZXJ0eSBtb3ZlZCB0byBgY29tcHV0ZVN0eWxlYCBtb2RpZmllclxuICAgICAqIEBwcm9wIHtCb29sZWFufSBncHVBY2NlbGVyYXRpb249dHJ1ZVxuICAgICAqIElmIHRydWUsIGl0IHVzZXMgdGhlIENTUyAzZCB0cmFuc2Zvcm1hdGlvbiB0byBwb3NpdGlvbiB0aGUgcG9wcGVyLlxuICAgICAqIE90aGVyd2lzZSwgaXQgd2lsbCB1c2UgdGhlIGB0b3BgIGFuZCBgbGVmdGAgcHJvcGVydGllcy5cbiAgICAgKi9cbiAgICBncHVBY2NlbGVyYXRpb246IHVuZGVmaW5lZFxuICB9XG59O1xuXG4vKipcbiAqIFRoZSBgZGF0YU9iamVjdGAgaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBpbmZvcm1hdGlvbnMgdXNlZCBieSBQb3BwZXIuanNcbiAqIHRoaXMgb2JqZWN0IGdldCBwYXNzZWQgdG8gbW9kaWZpZXJzIGFuZCB0byB0aGUgYG9uQ3JlYXRlYCBhbmQgYG9uVXBkYXRlYCBjYWxsYmFja3MuXG4gKiBAbmFtZSBkYXRhT2JqZWN0XG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5pbnN0YW5jZSBUaGUgUG9wcGVyLmpzIGluc3RhbmNlXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZGF0YS5wbGFjZW1lbnQgUGxhY2VtZW50IGFwcGxpZWQgdG8gcG9wcGVyXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZGF0YS5vcmlnaW5hbFBsYWNlbWVudCBQbGFjZW1lbnQgb3JpZ2luYWxseSBkZWZpbmVkIG9uIGluaXRcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGF0YS5mbGlwcGVkIFRydWUgaWYgcG9wcGVyIGhhcyBiZWVuIGZsaXBwZWQgYnkgZmxpcCBtb2RpZmllclxuICogQHByb3BlcnR5IHtCb29sZWFufSBkYXRhLmhpZGUgVHJ1ZSBpZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgaXMgb3V0IG9mIGJvdW5kYXJpZXMsIHVzZWZ1bCB0byBrbm93IHdoZW4gdG8gaGlkZSB0aGUgcG9wcGVyLlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZGF0YS5hcnJvd0VsZW1lbnQgTm9kZSB1c2VkIGFzIGFycm93IGJ5IGFycm93IG1vZGlmaWVyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5zdHlsZXMgQW55IENTUyBwcm9wZXJ0eSBkZWZpbmVkIGhlcmUgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIsIGl0IGV4cGVjdHMgdGhlIEphdmFTY3JpcHQgbm9tZW5jbGF0dXJlIChlZy4gYG1hcmdpbkJvdHRvbWApXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5hcnJvd1N0eWxlcyBBbnkgQ1NTIHByb3BlcnR5IGRlZmluZWQgaGVyZSB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlciBhcnJvdywgaXQgZXhwZWN0cyB0aGUgSmF2YVNjcmlwdCBub21lbmNsYXR1cmUgKGVnLiBgbWFyZ2luQm90dG9tYClcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLmJvdW5kYXJpZXMgT2Zmc2V0cyBvZiB0aGUgcG9wcGVyIGJvdW5kYXJpZXNcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMgVGhlIG1lYXN1cmVtZW50cyBvZiBwb3BwZXIsIHJlZmVyZW5jZSBhbmQgYXJyb3cgZWxlbWVudHMuXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5vZmZzZXRzLnBvcHBlciBgdG9wYCwgYGxlZnRgLCBgd2lkdGhgLCBgaGVpZ2h0YCB2YWx1ZXNcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMucmVmZXJlbmNlIGB0b3BgLCBgbGVmdGAsIGB3aWR0aGAsIGBoZWlnaHRgIHZhbHVlc1xuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEub2Zmc2V0cy5hcnJvd10gYHRvcGAgYW5kIGBsZWZ0YCBvZmZzZXRzLCBvbmx5IG9uZSBvZiB0aGVtIHdpbGwgYmUgZGlmZmVyZW50IGZyb20gMFxuICovXG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIHByb3ZpZGVkIHRvIFBvcHBlci5qcyBjb25zdHJ1Y3Rvci48YnIgLz5cbiAqIFRoZXNlIGNhbiBiZSBvdmVycmlkZW4gdXNpbmcgdGhlIGBvcHRpb25zYCBhcmd1bWVudCBvZiBQb3BwZXIuanMuPGJyIC8+XG4gKiBUbyBvdmVycmlkZSBhbiBvcHRpb24sIHNpbXBseSBwYXNzIGFzIDNyZCBhcmd1bWVudCBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZVxuICogc3RydWN0dXJlIG9mIHRoaXMgb2JqZWN0LCBleGFtcGxlOlxuICogYGBgXG4gKiBuZXcgUG9wcGVyKHJlZiwgcG9wLCB7XG4gKiAgIG1vZGlmaWVyczoge1xuICogICAgIHByZXZlbnRPdmVyZmxvdzogeyBlbmFibGVkOiBmYWxzZSB9XG4gKiAgIH1cbiAqIH0pXG4gKiBgYGBcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyb2YgUG9wcGVyXG4gKi9cbnZhciBEZWZhdWx0cyQxID0ge1xuICAvKipcbiAgICogUG9wcGVyJ3MgcGxhY2VtZW50XG4gICAqIEBwcm9wIHtQb3BwZXIucGxhY2VtZW50c30gcGxhY2VtZW50PSdib3R0b20nXG4gICAqL1xuICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGV2ZW50cyAocmVzaXplLCBzY3JvbGwpIGFyZSBpbml0aWFsbHkgZW5hYmxlZFxuICAgKiBAcHJvcCB7Qm9vbGVhbn0gZXZlbnRzRW5hYmxlZD10cnVlXG4gICAqL1xuICBldmVudHNFbmFibGVkOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBTZXQgdG8gdHJ1ZSBpZiB5b3Ugd2FudCB0byBhdXRvbWF0aWNhbGx5IHJlbW92ZSB0aGUgcG9wcGVyIHdoZW5cbiAgICogeW91IGNhbGwgdGhlIGBkZXN0cm95YCBtZXRob2QuXG4gICAqIEBwcm9wIHtCb29sZWFufSByZW1vdmVPbkRlc3Ryb3k9ZmFsc2VcbiAgICovXG4gIHJlbW92ZU9uRGVzdHJveTogZmFsc2UsXG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBwb3BwZXIgaXMgY3JlYXRlZC48YnIgLz5cbiAgICogQnkgZGVmYXVsdCwgaXMgc2V0IHRvIG5vLW9wLjxiciAvPlxuICAgKiBBY2Nlc3MgUG9wcGVyLmpzIGluc3RhbmNlIHdpdGggYGRhdGEuaW5zdGFuY2VgLlxuICAgKiBAcHJvcCB7b25DcmVhdGV9XG4gICAqL1xuICBvbkNyZWF0ZTogZnVuY3Rpb24gb25DcmVhdGUoKSB7fSxcblxuICAvKipcbiAgICogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHBvcHBlciBpcyB1cGRhdGVkLCB0aGlzIGNhbGxiYWNrIGlzIG5vdCBjYWxsZWRcbiAgICogb24gdGhlIGluaXRpYWxpemF0aW9uL2NyZWF0aW9uIG9mIHRoZSBwb3BwZXIsIGJ1dCBvbmx5IG9uIHN1YnNlcXVlbnRcbiAgICogdXBkYXRlcy48YnIgLz5cbiAgICogQnkgZGVmYXVsdCwgaXMgc2V0IHRvIG5vLW9wLjxiciAvPlxuICAgKiBBY2Nlc3MgUG9wcGVyLmpzIGluc3RhbmNlIHdpdGggYGRhdGEuaW5zdGFuY2VgLlxuICAgKiBAcHJvcCB7b25VcGRhdGV9XG4gICAqL1xuICBvblVwZGF0ZTogZnVuY3Rpb24gb25VcGRhdGUoKSB7fSxcblxuICAvKipcbiAgICogTGlzdCBvZiBtb2RpZmllcnMgdXNlZCB0byBtb2RpZnkgdGhlIG9mZnNldHMgYmVmb3JlIHRoZXkgYXJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlci5cbiAgICogVGhleSBwcm92aWRlIG1vc3Qgb2YgdGhlIGZ1bmN0aW9uYWxpdGllcyBvZiBQb3BwZXIuanNcbiAgICogQHByb3Age21vZGlmaWVyc31cbiAgICovXG4gIG1vZGlmaWVyczogbW9kaWZpZXJzXG59O1xuXG4vKipcbiAqIEBjYWxsYmFjayBvbkNyZWF0ZVxuICogQHBhcmFtIHtkYXRhT2JqZWN0fSBkYXRhXG4gKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgb25VcGRhdGVcbiAqIEBwYXJhbSB7ZGF0YU9iamVjdH0gZGF0YVxuICovXG5cbi8vIFV0aWxzXG4vLyBNZXRob2RzXG52YXIgUG9wcGVyID0gZnVuY3Rpb24gKCkge1xuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IFBvcHBlci5qcyBpbnN0YW5jZVxuICAgKiBAY2xhc3MgUG9wcGVyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8cmVmZXJlbmNlT2JqZWN0fSByZWZlcmVuY2UgLSBUaGUgcmVmZXJlbmNlIGVsZW1lbnQgdXNlZCB0byBwb3NpdGlvbiB0aGUgcG9wcGVyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlciAtIFRoZSBIVE1MIGVsZW1lbnQgdXNlZCBhcyBwb3BwZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gWW91ciBjdXN0b20gb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgb25lcyBkZWZpbmVkIGluIFtEZWZhdWx0c10oI2RlZmF1bHRzKVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGluc3RhbmNlIC0gVGhlIGdlbmVyYXRlZCBQb3BwZXIuanMgaW5zdGFuY2VcbiAgICovXG4gIGZ1bmN0aW9uIFBvcHBlcihyZWZlcmVuY2UsIHBvcHBlcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgUG9wcGVyKTtcblxuICAgIHRoaXMuc2NoZWR1bGVVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKF90aGlzLnVwZGF0ZSk7XG4gICAgfTtcblxuICAgIC8vIG1ha2UgdXBkYXRlKCkgZGVib3VuY2VkLCBzbyB0aGF0IGl0IG9ubHkgcnVucyBhdCBtb3N0IG9uY2UtcGVyLXRpY2tcbiAgICB0aGlzLnVwZGF0ZSA9IGRlYm91bmNlKHRoaXMudXBkYXRlLmJpbmQodGhpcykpO1xuXG4gICAgLy8gd2l0aCB7fSB3ZSBjcmVhdGUgYSBuZXcgb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgaW5zaWRlIGl0XG4gICAgdGhpcy5vcHRpb25zID0gX2V4dGVuZHMoe30sIFBvcHBlci5EZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAvLyBpbml0IHN0YXRlXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzRGVzdHJveWVkOiBmYWxzZSxcbiAgICAgIGlzQ3JlYXRlZDogZmFsc2UsXG4gICAgICBzY3JvbGxQYXJlbnRzOiBbXVxuICAgIH07XG5cbiAgICAvLyBnZXQgcmVmZXJlbmNlIGFuZCBwb3BwZXIgZWxlbWVudHMgKGFsbG93IGpRdWVyeSB3cmFwcGVycylcbiAgICB0aGlzLnJlZmVyZW5jZSA9IHJlZmVyZW5jZS5qcXVlcnkgPyByZWZlcmVuY2VbMF0gOiByZWZlcmVuY2U7XG4gICAgdGhpcy5wb3BwZXIgPSBwb3BwZXIuanF1ZXJ5ID8gcG9wcGVyWzBdIDogcG9wcGVyO1xuXG4gICAgLy8gRGVlcCBtZXJnZSBtb2RpZmllcnMgb3B0aW9uc1xuICAgIHRoaXMub3B0aW9ucy5tb2RpZmllcnMgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhfZXh0ZW5kcyh7fSwgUG9wcGVyLkRlZmF1bHRzLm1vZGlmaWVycywgb3B0aW9ucy5tb2RpZmllcnMpKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBfdGhpcy5vcHRpb25zLm1vZGlmaWVyc1tuYW1lXSA9IF9leHRlbmRzKHt9LCBQb3BwZXIuRGVmYXVsdHMubW9kaWZpZXJzW25hbWVdIHx8IHt9LCBvcHRpb25zLm1vZGlmaWVycyA/IG9wdGlvbnMubW9kaWZpZXJzW25hbWVdIDoge30pO1xuICAgIH0pO1xuXG4gICAgLy8gUmVmYWN0b3JpbmcgbW9kaWZpZXJzJyBsaXN0IChPYmplY3QgPT4gQXJyYXkpXG4gICAgdGhpcy5tb2RpZmllcnMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMubW9kaWZpZXJzKS5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICAgIG5hbWU6IG5hbWVcbiAgICAgIH0sIF90aGlzLm9wdGlvbnMubW9kaWZpZXJzW25hbWVdKTtcbiAgICB9KVxuICAgIC8vIHNvcnQgdGhlIG1vZGlmaWVycyBieSBvcmRlclxuICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XG4gICAgfSk7XG5cbiAgICAvLyBtb2RpZmllcnMgaGF2ZSB0aGUgYWJpbGl0eSB0byBleGVjdXRlIGFyYml0cmFyeSBjb2RlIHdoZW4gUG9wcGVyLmpzIGdldCBpbml0ZWRcbiAgICAvLyBzdWNoIGNvZGUgaXMgZXhlY3V0ZWQgaW4gdGhlIHNhbWUgb3JkZXIgb2YgaXRzIG1vZGlmaWVyXG4gICAgLy8gdGhleSBjb3VsZCBhZGQgbmV3IHByb3BlcnRpZXMgdG8gdGhlaXIgb3B0aW9ucyBjb25maWd1cmF0aW9uXG4gICAgLy8gQkUgQVdBUkU6IGRvbid0IGFkZCBvcHRpb25zIHRvIGBvcHRpb25zLm1vZGlmaWVycy5uYW1lYCBidXQgdG8gYG1vZGlmaWVyT3B0aW9uc2AhXG4gICAgdGhpcy5tb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXJPcHRpb25zKSB7XG4gICAgICBpZiAobW9kaWZpZXJPcHRpb25zLmVuYWJsZWQgJiYgaXNGdW5jdGlvbihtb2RpZmllck9wdGlvbnMub25Mb2FkKSkge1xuICAgICAgICBtb2RpZmllck9wdGlvbnMub25Mb2FkKF90aGlzLnJlZmVyZW5jZSwgX3RoaXMucG9wcGVyLCBfdGhpcy5vcHRpb25zLCBtb2RpZmllck9wdGlvbnMsIF90aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGZpcmUgdGhlIGZpcnN0IHVwZGF0ZSB0byBwb3NpdGlvbiB0aGUgcG9wcGVyIGluIHRoZSByaWdodCBwbGFjZVxuICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICB2YXIgZXZlbnRzRW5hYmxlZCA9IHRoaXMub3B0aW9ucy5ldmVudHNFbmFibGVkO1xuICAgIGlmIChldmVudHNFbmFibGVkKSB7XG4gICAgICAvLyBzZXR1cCBldmVudCBsaXN0ZW5lcnMsIHRoZXkgd2lsbCB0YWtlIGNhcmUgb2YgdXBkYXRlIHRoZSBwb3NpdGlvbiBpbiBzcGVjaWZpYyBzaXR1YXRpb25zXG4gICAgICB0aGlzLmVuYWJsZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZS5ldmVudHNFbmFibGVkID0gZXZlbnRzRW5hYmxlZDtcbiAgfVxuXG4gIC8vIFdlIGNhbid0IHVzZSBjbGFzcyBwcm9wZXJ0aWVzIGJlY2F1c2UgdGhleSBkb24ndCBnZXQgbGlzdGVkIGluIHRoZVxuICAvLyBjbGFzcyBwcm90b3R5cGUgYW5kIGJyZWFrIHN0dWZmIGxpa2UgU2lub24gc3R1YnNcblxuXG4gIGNyZWF0ZUNsYXNzKFBvcHBlciwgW3tcbiAgICBrZXk6ICd1cGRhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUkJDEoKSB7XG4gICAgICByZXR1cm4gdXBkYXRlLmNhbGwodGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZGVzdHJveScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3kkJDEoKSB7XG4gICAgICByZXR1cm4gZGVzdHJveS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2VuYWJsZUV2ZW50TGlzdGVuZXJzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5hYmxlRXZlbnRMaXN0ZW5lcnMkJDEoKSB7XG4gICAgICByZXR1cm4gZW5hYmxlRXZlbnRMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdkaXNhYmxlRXZlbnRMaXN0ZW5lcnMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlRXZlbnRMaXN0ZW5lcnMkJDEoKSB7XG4gICAgICByZXR1cm4gZGlzYWJsZUV2ZW50TGlzdGVuZXJzLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2NoZWR1bGUgYW4gdXBkYXRlLCBpdCB3aWxsIHJ1biBvbiB0aGUgbmV4dCBVSSB1cGRhdGUgYXZhaWxhYmxlXG4gICAgICogQG1ldGhvZCBzY2hlZHVsZVVwZGF0ZVxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXJcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIENvbGxlY3Rpb24gb2YgdXRpbGl0aWVzIHVzZWZ1bCB3aGVuIHdyaXRpbmcgY3VzdG9tIG1vZGlmaWVycy5cbiAgICAgKiBTdGFydGluZyBmcm9tIHZlcnNpb24gMS43LCB0aGlzIG1ldGhvZCBpcyBhdmFpbGFibGUgb25seSBpZiB5b3VcbiAgICAgKiBpbmNsdWRlIGBwb3BwZXItdXRpbHMuanNgIGJlZm9yZSBgcG9wcGVyLmpzYC5cbiAgICAgKlxuICAgICAqICoqREVQUkVDQVRJT04qKjogVGhpcyB3YXkgdG8gYWNjZXNzIFBvcHBlclV0aWxzIGlzIGRlcHJlY2F0ZWRcbiAgICAgKiBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHYyISBVc2UgdGhlIFBvcHBlclV0aWxzIG1vZHVsZSBkaXJlY3RseSBpbnN0ZWFkLlxuICAgICAqIER1ZSB0byB0aGUgaGlnaCBpbnN0YWJpbGl0eSBvZiB0aGUgbWV0aG9kcyBjb250YWluZWQgaW4gVXRpbHMsIHdlIGNhbid0XG4gICAgICogZ3VhcmFudGVlIHRoZW0gdG8gZm9sbG93IHNlbXZlci4gVXNlIHRoZW0gYXQgeW91ciBvd24gcmlzayFcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMS44XG4gICAgICogQG1lbWJlciBVdGlsc1xuICAgICAqIEBtZW1iZXJvZiBQb3BwZXJcbiAgICAgKi9cblxuICB9XSk7XG4gIHJldHVybiBQb3BwZXI7XG59KCk7XG5cbi8qKlxuICogVGhlIGByZWZlcmVuY2VPYmplY3RgIGlzIGFuIG9iamVjdCB0aGF0IHByb3ZpZGVzIGFuIGludGVyZmFjZSBjb21wYXRpYmxlIHdpdGggUG9wcGVyLmpzXG4gKiBhbmQgbGV0cyB5b3UgdXNlIGl0IGFzIHJlcGxhY2VtZW50IG9mIGEgcmVhbCBET00gbm9kZS48YnIgLz5cbiAqIFlvdSBjYW4gdXNlIHRoaXMgbWV0aG9kIHRvIHBvc2l0aW9uIGEgcG9wcGVyIHJlbGF0aXZlbHkgdG8gYSBzZXQgb2YgY29vcmRpbmF0ZXNcbiAqIGluIGNhc2UgeW91IGRvbid0IGhhdmUgYSBET00gbm9kZSB0byB1c2UgYXMgcmVmZXJlbmNlLlxuICpcbiAqIGBgYFxuICogbmV3IFBvcHBlcihyZWZlcmVuY2VPYmplY3QsIHBvcHBlck5vZGUpO1xuICogYGBgXG4gKlxuICogTkI6IFRoaXMgZmVhdHVyZSBpc24ndCBzdXBwb3J0ZWQgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTBcbiAqIEBuYW1lIHJlZmVyZW5jZU9iamVjdFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZGF0YS5nZXRCb3VuZGluZ0NsaWVudFJlY3RcbiAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgc2V0IG9mIGNvb3JkaW5hdGVzIGNvbXBhdGlibGUgd2l0aCB0aGUgbmF0aXZlIGBnZXRCb3VuZGluZ0NsaWVudFJlY3RgIG1ldGhvZC5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkYXRhLmNsaWVudFdpZHRoXG4gKiBBbiBFUzYgZ2V0dGVyIHRoYXQgd2lsbCByZXR1cm4gdGhlIHdpZHRoIG9mIHRoZSB2aXJ0dWFsIHJlZmVyZW5jZSBlbGVtZW50LlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRhdGEuY2xpZW50SGVpZ2h0XG4gKiBBbiBFUzYgZ2V0dGVyIHRoYXQgd2lsbCByZXR1cm4gdGhlIGhlaWdodCBvZiB0aGUgdmlydHVhbCByZWZlcmVuY2UgZWxlbWVudC5cbiAqL1xuXG5Qb3BwZXIuVXRpbHMgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpLlBvcHBlclV0aWxzO1xuUG9wcGVyLnBsYWNlbWVudHMgPSBwbGFjZW1lbnRzO1xuUG9wcGVyLkRlZmF1bHRzID0gRGVmYXVsdHMkMTtcblxuLyoqXG4qIFJldHVybnMgdGhlIGRpc3RhbmNlIHRha2luZyBpbnRvIGFjY291bnQgdGhlIGRlZmF1bHQgZGlzdGFuY2UgZHVlIHRvXG4qIHRoZSB0cmFuc2Zvcm06IHRyYW5zbGF0ZSBzZXR0aW5nIGluIENTU1xuKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2VcbiogQHJldHVybiB7U3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGdldE9mZnNldERpc3RhbmNlSW5QeChkaXN0YW5jZSkge1xuICByZXR1cm4gLShkaXN0YW5jZSAtIERlZmF1bHRzLmRpc3RhbmNlKSArICdweCc7XG59XG5cbnZhciBjbGFzc0NhbGxDaGVjayQxID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbnZhciBjcmVhdGVDbGFzcyQxID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpO1xuXG5cblxuXG5cblxuXG52YXIgX2V4dGVuZHMkMSA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG4vKipcbiogQ3JlYXRlcyBhIG5ldyBwb3BwZXIgaW5zdGFuY2VcbiogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiogQHJldHVybiB7T2JqZWN0fSAtIHRoZSBwb3BwZXIgaW5zdGFuY2VcbiovXG5mdW5jdGlvbiBjcmVhdGVQb3BwZXJJbnN0YW5jZShkYXRhKSB7XG4gIHZhciBlbCA9IGRhdGEuZWwsXG4gICAgICBwb3BwZXIgPSBkYXRhLnBvcHBlcixcbiAgICAgIF9kYXRhJHNldHRpbmdzID0gZGF0YS5zZXR0aW5ncyxcbiAgICAgIHBvc2l0aW9uID0gX2RhdGEkc2V0dGluZ3MucG9zaXRpb24sXG4gICAgICBwb3BwZXJPcHRpb25zID0gX2RhdGEkc2V0dGluZ3MucG9wcGVyT3B0aW9ucyxcbiAgICAgIG9mZnNldCA9IF9kYXRhJHNldHRpbmdzLm9mZnNldCxcbiAgICAgIGRpc3RhbmNlID0gX2RhdGEkc2V0dGluZ3MuZGlzdGFuY2UsXG4gICAgICBmbGlwRHVyYXRpb24gPSBfZGF0YSRzZXR0aW5ncy5mbGlwRHVyYXRpb24sXG4gICAgICByZWZPYmplY3QgPSBkYXRhLnJlZk9iamVjdDtcblxuICB2YXIgX2dldElubmVyRWxlbWVudHMgPSBnZXRJbm5lckVsZW1lbnRzKHBvcHBlciksXG4gICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHMudG9vbHRpcDtcblxuICB2YXIgY29uZmlnID0gX2V4dGVuZHMkMSh7XG4gICAgcGxhY2VtZW50OiBwb3NpdGlvblxuICB9LCBwb3BwZXJPcHRpb25zIHx8IHt9LCB7XG4gICAgbW9kaWZpZXJzOiBfZXh0ZW5kcyQxKHt9LCBwb3BwZXJPcHRpb25zID8gcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgOiB7fSwge1xuICAgICAgZmxpcDogX2V4dGVuZHMkMSh7XG4gICAgICAgIHBhZGRpbmc6IGRpc3RhbmNlICsgNSAvKiA1cHggZnJvbSB2aWV3cG9ydCBib3VuZGFyeSAqL1xuICAgICAgfSwgcG9wcGVyT3B0aW9ucyAmJiBwb3BwZXJPcHRpb25zLm1vZGlmaWVycyA/IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzLmZsaXAgOiB7fSksXG4gICAgICBvZmZzZXQ6IF9leHRlbmRzJDEoe1xuICAgICAgICBvZmZzZXQ6IG9mZnNldFxuICAgICAgfSwgcG9wcGVyT3B0aW9ucyAmJiBwb3BwZXJPcHRpb25zLm1vZGlmaWVycyA/IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzLm9mZnNldCA6IHt9KVxuICAgIH0pLFxuICAgIG9uVXBkYXRlOiBmdW5jdGlvbiBvblVwZGF0ZSgpIHtcbiAgICAgIHZhciBzdHlsZXMgPSB0b29sdGlwLnN0eWxlO1xuICAgICAgc3R5bGVzLnRvcCA9ICcnO1xuICAgICAgc3R5bGVzLmJvdHRvbSA9ICcnO1xuICAgICAgc3R5bGVzLmxlZnQgPSAnJztcbiAgICAgIHN0eWxlcy5yaWdodCA9ICcnO1xuICAgICAgc3R5bGVzW2dldENvcmVQbGFjZW1lbnQocG9wcGVyLmdldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnKSldID0gZ2V0T2Zmc2V0RGlzdGFuY2VJblB4KGRpc3RhbmNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFVwZGF0ZSB0aGUgcG9wcGVyJ3MgcG9zaXRpb24gd2hlbmV2ZXIgaXRzIGNvbnRlbnQgY2hhbmdlc1xuICAvLyBOb3Qgc3VwcG9ydGVkIGluIElFMTAgdW5sZXNzIHBvbHlmaWxsZWRcbiAgaWYgKHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgdmFyIHN0eWxlcyA9IHBvcHBlci5zdHlsZTtcblxuICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgIHN0eWxlc1twcmVmaXgoJ3RyYW5zaXRpb25EdXJhdGlvbicpXSA9ICcwbXMnO1xuICAgICAgZGF0YS5wb3BwZXJJbnN0YW5jZS51cGRhdGUoKTtcbiAgICAgIGRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3R5bGVzW3ByZWZpeCgndHJhbnNpdGlvbkR1cmF0aW9uJyldID0gZmxpcER1cmF0aW9uICsgJ21zJztcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShwb3BwZXIsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG4gICAgfSk7XG5cbiAgICBkYXRhLl9tdXRhdGlvbk9ic2VydmVyID0gb2JzZXJ2ZXI7XG4gIH1cblxuICAvL1VwZGF0ZSBQb3BwZXIncyByZWZlcmVuY2Ugb2JqZWN0IGlmIG9uZSBpcyBwcm92aWRlZFxuICBpZiAocmVmT2JqZWN0ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBQb3BwZXIoZWwsIHBvcHBlciwgY29uZmlnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFBvcHBlcihyZWZPYmplY3QsIHBvcHBlciwgY29uZmlnKTtcbiAgfVxufVxuXG4vKipcbiogQXBwZW5kcyB0aGUgcG9wcGVyIGFuZCBjcmVhdGVzIGEgcG9wcGVyIGluc3RhbmNlIGlmIG9uZSBkb2VzIG5vdCBleGlzdFxuKiBBbHNvIHVwZGF0ZXMgaXRzIHBvc2l0aW9uIGlmIG5lZWQgYmUgYW5kIGVuYWJsZXMgZXZlbnQgbGlzdGVuZXJzXG4qIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gIHRoZSBlbGVtZW50L3BvcHBlciByZWZlcmVuY2UgZGF0YVxuKi9cbmZ1bmN0aW9uIG1vdW50UG9wcGVyKGRhdGEpIHtcbiAgdmFyIGVsID0gZGF0YS5lbCxcbiAgICAgIHBvcHBlciA9IGRhdGEucG9wcGVyLFxuICAgICAgX2RhdGEkc2V0dGluZ3MgPSBkYXRhLnNldHRpbmdzLFxuICAgICAgYXBwZW5kVG8gPSBfZGF0YSRzZXR0aW5ncy5hcHBlbmRUbyxcbiAgICAgIGZvbGxvd0N1cnNvciA9IF9kYXRhJHNldHRpbmdzLmZvbGxvd0N1cnNvcjtcblxuICAvLyBBbHJlYWR5IG9uIHRoZSBET01cblxuICBpZiAoYXBwZW5kVG8uY29udGFpbnMocG9wcGVyKSkgcmV0dXJuO1xuXG4gIGFwcGVuZFRvLmFwcGVuZENoaWxkKHBvcHBlcik7XG5cbiAgaWYgKCFkYXRhLnBvcHBlckluc3RhbmNlKSB7XG4gICAgZGF0YS5wb3BwZXJJbnN0YW5jZSA9IGNyZWF0ZVBvcHBlckluc3RhbmNlKGRhdGEpO1xuICB9IGVsc2Uge1xuICAgIGRhdGEucG9wcGVySW5zdGFuY2UudXBkYXRlKCk7XG4gICAgaWYgKCFmb2xsb3dDdXJzb3IgfHwgQnJvd3Nlci50b3VjaCkge1xuICAgICAgZGF0YS5wb3BwZXJJbnN0YW5jZS5lbmFibGVFdmVudExpc3RlbmVycygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFNpbmNlIHRvdWNoIGlzIGRldGVybWluZWQgZHluYW1pY2FsbHksIGZvbGxvd0N1cnNvciBpcyBzZXQgb24gbW91bnRcbiAgaWYgKGZvbGxvd0N1cnNvciAmJiAhQnJvd3Nlci50b3VjaCkge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZvbGxvd0N1cnNvckhhbmRsZXIpO1xuICAgIGRhdGEucG9wcGVySW5zdGFuY2UuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cbn1cblxuLyoqXG4qIFVwZGF0ZXMgYSBwb3BwZXIncyBwb3NpdGlvbiBvbiBlYWNoIGFuaW1hdGlvbiBmcmFtZSB0byBtYWtlIGl0IHN0aWNrIHRvIGEgbW92aW5nIGVsZW1lbnRcbiogQHBhcmFtIHtPYmplY3R9IHJlZkRhdGFcbiovXG5mdW5jdGlvbiBtYWtlU3RpY2t5KHJlZkRhdGEpIHtcbiAgdmFyIHBvcHBlciA9IHJlZkRhdGEucG9wcGVyLFxuICAgICAgcG9wcGVySW5zdGFuY2UgPSByZWZEYXRhLnBvcHBlckluc3RhbmNlLFxuICAgICAgc3RpY2t5RHVyYXRpb24gPSByZWZEYXRhLnNldHRpbmdzLnN0aWNreUR1cmF0aW9uO1xuXG5cbiAgdmFyIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uID0gZnVuY3Rpb24gYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHBvcHBlci5zdHlsZVtwcmVmaXgoJ3RyYW5zaXRpb25EdXJhdGlvbicpXSA9IHN0aWNreUR1cmF0aW9uICsgJ21zJztcbiAgfTtcblxuICB2YXIgcmVtb3ZlVHJhbnNpdGlvbkR1cmF0aW9uID0gZnVuY3Rpb24gcmVtb3ZlVHJhbnNpdGlvbkR1cmF0aW9uKCkge1xuICAgIHJldHVybiBwb3BwZXIuc3R5bGVbcHJlZml4KCd0cmFuc2l0aW9uRHVyYXRpb24nKV0gPSAnJztcbiAgfTtcblxuICB2YXIgdXBkYXRlUG9zaXRpb24gPSBmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbigpIHtcbiAgICBwb3BwZXJJbnN0YW5jZSAmJiBwb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xuXG4gICAgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oKTtcblxuICAgIGlzVmlzaWJsZShwb3BwZXIpID8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVQb3NpdGlvbikgOiByZW1vdmVUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgfTtcblxuICAvLyBXYWl0IHVudGlsIFBvcHBlcidzIHBvc2l0aW9uIGhhcyBiZWVuIHVwZGF0ZWQgaW5pdGlhbGx5XG4gIGRlZmVyKHVwZGF0ZVBvc2l0aW9uKTtcbn1cblxuLyoqXG4qIFJldHVybnMgYW4gb2JqZWN0IG9mIHNldHRpbmdzIHRvIG92ZXJyaWRlIGdsb2JhbCBzZXR0aW5nc1xuKiBAcGFyYW0ge0VsZW1lbnR9IGVsIC0gdGhlIHRvb2x0aXBwZWQgZWxlbWVudFxuKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VTZXR0aW5nc1xuKiBAcmV0dXJuIHtPYmplY3R9IC0gaW5kaXZpZHVhbCBzZXR0aW5nc1xuKi9cbmZ1bmN0aW9uIGdldEluZGl2aWR1YWxTZXR0aW5ncyhlbCwgaW5zdGFuY2VTZXR0aW5ncykge1xuICB2YXIgc2V0dGluZ3MgPSBEZWZhdWx0c0tleXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGtleSkge1xuICAgIHZhciB2YWwgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleS50b0xvd2VyQ2FzZSgpKSB8fCBpbnN0YW5jZVNldHRpbmdzW2tleV07XG5cbiAgICAvLyBDb252ZXJ0IHN0cmluZ3MgdG8gYm9vbGVhbnNcbiAgICBpZiAodmFsID09PSAnZmFsc2UnKSB2YWwgPSBmYWxzZTtcbiAgICBpZiAodmFsID09PSAndHJ1ZScpIHZhbCA9IHRydWU7XG5cbiAgICAvLyBDb252ZXJ0IG51bWJlciBzdHJpbmdzIHRvIHRydWUgbnVtYmVyc1xuICAgIGlmIChpc0Zpbml0ZSh2YWwpICYmICFpc05hTihwYXJzZUZsb2F0KHZhbCkpKSB7XG4gICAgICB2YWwgPSBwYXJzZUZsb2F0KHZhbCk7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBhcnJheSBzdHJpbmdzIHRvIGFjdHVhbCBhcnJheXNcbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLnRyaW0oKS5jaGFyQXQoMCkgPT09ICdbJykge1xuICAgICAgdmFsID0gSlNPTi5wYXJzZSh2YWwpO1xuICAgIH1cblxuICAgIGFjY1trZXldID0gdmFsO1xuXG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuXG4gIHJldHVybiBfZXh0ZW5kcyQxKHt9LCBpbnN0YW5jZVNldHRpbmdzLCBzZXR0aW5ncyk7XG59XG5cbi8qKlxuKiBDcmVhdGVzIGEgcG9wcGVyIGVsZW1lbnQgdGhlbiByZXR1cm5zIGl0XG4qIEBwYXJhbSB7TnVtYmVyfSBpZCAtIHRoZSBwb3BwZXIgaWRcbiogQHBhcmFtIHtTdHJpbmd9IHRpdGxlIC0gdGhlIHRvb2x0aXAncyBgdGl0bGVgIGF0dHJpYnV0ZVxuKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBpbmRpdmlkdWFsIHNldHRpbmdzXG4qIEByZXR1cm4ge0VsZW1lbnR9IC0gdGhlIHBvcHBlciBlbGVtZW50XG4qL1xuZnVuY3Rpb24gY3JlYXRlUG9wcGVyRWxlbWVudChpZCwgdGl0bGUsIHNldHRpbmdzKSB7XG4gIHZhciBwb3NpdGlvbiA9IHNldHRpbmdzLnBvc2l0aW9uLFxuICAgICAgZGlzdGFuY2UgPSBzZXR0aW5ncy5kaXN0YW5jZSxcbiAgICAgIGFycm93ID0gc2V0dGluZ3MuYXJyb3csXG4gICAgICBhbmltYXRlRmlsbCA9IHNldHRpbmdzLmFuaW1hdGVGaWxsLFxuICAgICAgaW5lcnRpYSA9IHNldHRpbmdzLmluZXJ0aWEsXG4gICAgICBhbmltYXRpb24gPSBzZXR0aW5ncy5hbmltYXRpb24sXG4gICAgICBhcnJvd1NpemUgPSBzZXR0aW5ncy5hcnJvd1NpemUsXG4gICAgICBzaXplID0gc2V0dGluZ3Muc2l6ZSxcbiAgICAgIHRoZW1lID0gc2V0dGluZ3MudGhlbWUsXG4gICAgICBodG1sID0gc2V0dGluZ3MuaHRtbCxcbiAgICAgIHpJbmRleCA9IHNldHRpbmdzLnpJbmRleCxcbiAgICAgIGludGVyYWN0aXZlID0gc2V0dGluZ3MuaW50ZXJhY3RpdmU7XG5cblxuICB2YXIgcG9wcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHBvcHBlci5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RpcHB5LXBvcHBlcicpO1xuICBwb3BwZXIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcbiAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICBwb3BwZXIuc2V0QXR0cmlidXRlKCdpZCcsICd0aXBweS10b29sdGlwLScgKyBpZCk7XG4gIHBvcHBlci5zdHlsZS56SW5kZXggPSB6SW5kZXg7XG5cbiAgdmFyIHRvb2x0aXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RpcHB5LXRvb2x0aXAgdGlwcHktdG9vbHRpcC0tJyArIHNpemUgKyAnIGxlYXZlJyk7XG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLWFuaW1hdGlvbicsIGFuaW1hdGlvbik7XG5cbiAgdGhlbWUuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKHQgKyAnLXRoZW1lJyk7XG4gIH0pO1xuXG4gIGlmIChhcnJvdykge1xuICAgIC8vIEFkZCBhbiBhcnJvd1xuICAgIHZhciBfYXJyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBfYXJyb3cuc2V0QXR0cmlidXRlKCdjbGFzcycsICdhcnJvdy0nICsgYXJyb3dTaXplKTtcbiAgICBfYXJyb3cuc2V0QXR0cmlidXRlKCd4LWFycm93JywgJycpO1xuICAgIHRvb2x0aXAuYXBwZW5kQ2hpbGQoX2Fycm93KTtcbiAgfVxuXG4gIGlmIChhbmltYXRlRmlsbCkge1xuICAgIC8vIENyZWF0ZSBhbmltYXRlRmlsbCBjaXJjbGUgZWxlbWVudCBmb3IgYW5pbWF0aW9uXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYW5pbWF0ZWZpbGwnLCAnJyk7XG4gICAgdmFyIGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2xlYXZlJyk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgneC1jaXJjbGUnLCAnJyk7XG4gICAgdG9vbHRpcC5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICB9XG5cbiAgaWYgKGluZXJ0aWEpIHtcbiAgICAvLyBDaGFuZ2UgdHJhbnNpdGlvbiB0aW1pbmcgZnVuY3Rpb24gY3ViaWMgYmV6aWVyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5lcnRpYScsICcnKTtcbiAgfVxuXG4gIGlmIChpbnRlcmFjdGl2ZSkge1xuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLWludGVyYWN0aXZlJywgJycpO1xuICB9XG5cbiAgLy8gVG9vbHRpcCBjb250ZW50ICh0ZXh0IG9yIEhUTUwpXG4gIHZhciBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRlbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0aXBweS10b29sdGlwLWNvbnRlbnQnKTtcblxuICBpZiAoaHRtbCkge1xuICAgIHZhciB0ZW1wbGF0ZUlkID0gdm9pZCAwO1xuXG4gICAgaWYgKGh0bWwgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICBjb250ZW50LmFwcGVuZENoaWxkKGh0bWwpO1xuICAgICAgdGVtcGxhdGVJZCA9ICcjJyArIGh0bWwuaWQgfHwgJ3RpcHB5LWh0bWwtdGVtcGxhdGUnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50LmlubmVySFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWwucmVwbGFjZSgnIycsICcnKSkuaW5uZXJIVE1MO1xuICAgICAgdGVtcGxhdGVJZCA9IGh0bWw7XG4gICAgfVxuXG4gICAgcG9wcGVyLmNsYXNzTGlzdC5hZGQoJ2h0bWwtdGVtcGxhdGUnKTtcbiAgICBpbnRlcmFjdGl2ZSAmJiBwb3BwZXIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlLWlkJywgdGVtcGxhdGVJZCk7XG4gIH0gZWxzZSB7XG4gICAgY29udGVudC5pbm5lckhUTUwgPSB0aXRsZTtcbiAgfVxuXG4gIC8vIEluaXQgZGlzdGFuY2UuIEZ1cnRoZXIgdXBkYXRlcyBhcmUgbWFkZSBpbiB0aGUgcG9wcGVyIGluc3RhbmNlJ3MgYG9uVXBkYXRlKClgIG1ldGhvZFxuICB0b29sdGlwLnN0eWxlW2dldENvcmVQbGFjZW1lbnQocG9zaXRpb24pXSA9IGdldE9mZnNldERpc3RhbmNlSW5QeChkaXN0YW5jZSk7XG5cbiAgdG9vbHRpcC5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgcG9wcGVyLmFwcGVuZENoaWxkKHRvb2x0aXApO1xuXG4gIHJldHVybiBwb3BwZXI7XG59XG5cbi8qKlxuKiBDcmVhdGVzIGEgdHJpZ2dlclxuKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgLSB0aGUgY3VzdG9tIGV2ZW50IHNwZWNpZmllZCBpbiB0aGUgYHRyaWdnZXJgIHNldHRpbmdcbiogQHBhcmFtIHtFbGVtZW50fSBlbCAtIHRvb2x0aXBwZWQgZWxlbWVudFxuKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlcnMgLSB0aGUgaGFuZGxlcnMgZm9yIGVhY2ggbGlzdGVuZXJcbiogQHBhcmFtIHtCb29sZWFufSB0b3VjaEhvbGRcbiogQHJldHVybiB7QXJyYXl9IC0gYXJyYXkgb2YgbGlzdGVuZXIgb2JqZWN0c1xuKi9cbmZ1bmN0aW9uIGNyZWF0ZVRyaWdnZXIoZXZlbnQsIGVsLCBoYW5kbGVycywgdG91Y2hIb2xkKSB7XG4gIHZhciBsaXN0ZW5lcnMgPSBbXTtcblxuICBpZiAoZXZlbnQgPT09ICdtYW51YWwnKSByZXR1cm4gbGlzdGVuZXJzO1xuXG4gIC8vIEVudGVyXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXJzLmhhbmRsZVRyaWdnZXIpO1xuICBsaXN0ZW5lcnMucHVzaCh7XG4gICAgZXZlbnQ6IGV2ZW50LFxuICAgIGhhbmRsZXI6IGhhbmRsZXJzLmhhbmRsZVRyaWdnZXJcbiAgfSk7XG5cbiAgLy8gTGVhdmVcbiAgaWYgKGV2ZW50ID09PSAnbW91c2VlbnRlcicpIHtcbiAgICBpZiAoQnJvd3Nlci5TVVBQT1JUU19UT1VDSCAmJiB0b3VjaEhvbGQpIHtcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBoYW5kbGVycy5oYW5kbGVUcmlnZ2VyKTtcbiAgICAgIGxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgZXZlbnQ6ICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgaGFuZGxlcjogaGFuZGxlcnMuaGFuZGxlVHJpZ2dlclxuICAgICAgfSk7XG4gICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGhhbmRsZXJzLmhhbmRsZU1vdXNlbGVhdmUpO1xuICAgICAgbGlzdGVuZXJzLnB1c2goe1xuICAgICAgICBldmVudDogJ3RvdWNoZW5kJyxcbiAgICAgICAgaGFuZGxlcjogaGFuZGxlcnMuaGFuZGxlTW91c2VsZWF2ZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGhhbmRsZXJzLmhhbmRsZU1vdXNlbGVhdmUpO1xuICAgIGxpc3RlbmVycy5wdXNoKHtcbiAgICAgIGV2ZW50OiAnbW91c2VsZWF2ZScsXG4gICAgICBoYW5kbGVyOiBoYW5kbGVycy5oYW5kbGVNb3VzZWxlYXZlXG4gICAgfSk7XG4gIH1cblxuICBpZiAoZXZlbnQgPT09ICdmb2N1cycpIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgaGFuZGxlcnMuaGFuZGxlQmx1cik7XG4gICAgbGlzdGVuZXJzLnB1c2goe1xuICAgICAgZXZlbnQ6ICdibHVyJyxcbiAgICAgIGhhbmRsZXI6IGhhbmRsZXJzLmhhbmRsZUJsdXJcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBsaXN0ZW5lcnM7XG59XG5cbi8qKlxuKiBEZXRlcm1pbmVzIGlmIHRoZSBtb3VzZSdzIGN1cnNvciBpcyBvdXRzaWRlIHRoZSBpbnRlcmFjdGl2ZSBib3JkZXJcbiogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudFxuKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxuKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiogQHJldHVybiB7Qm9vbGVhbn1cbiovXG5mdW5jdGlvbiBjdXJzb3JJc091dHNpZGVJbnRlcmFjdGl2ZUJvcmRlcihldmVudCwgcG9wcGVyLCBzZXR0aW5ncykge1xuICBpZiAoIXBvcHBlci5nZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JykpIHJldHVybiB0cnVlO1xuXG4gIHZhciB4ID0gZXZlbnQuY2xpZW50WCxcbiAgICAgIHkgPSBldmVudC5jbGllbnRZO1xuICB2YXIgaW50ZXJhY3RpdmVCb3JkZXIgPSBzZXR0aW5ncy5pbnRlcmFjdGl2ZUJvcmRlcixcbiAgICAgIGRpc3RhbmNlID0gc2V0dGluZ3MuZGlzdGFuY2U7XG5cblxuICB2YXIgcmVjdCA9IHBvcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIGNvcmVQb3NpdGlvbiA9IGdldENvcmVQbGFjZW1lbnQocG9wcGVyLmdldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnKSk7XG4gIHZhciBib3JkZXJXaXRoRGlzdGFuY2UgPSBpbnRlcmFjdGl2ZUJvcmRlciArIGRpc3RhbmNlO1xuXG4gIHZhciBleGNlZWRzID0ge1xuICAgIHRvcDogcmVjdC50b3AgLSB5ID4gaW50ZXJhY3RpdmVCb3JkZXIsXG4gICAgYm90dG9tOiB5IC0gcmVjdC5ib3R0b20gPiBpbnRlcmFjdGl2ZUJvcmRlcixcbiAgICBsZWZ0OiByZWN0LmxlZnQgLSB4ID4gaW50ZXJhY3RpdmVCb3JkZXIsXG4gICAgcmlnaHQ6IHggLSByZWN0LnJpZ2h0ID4gaW50ZXJhY3RpdmVCb3JkZXJcbiAgfTtcblxuICBzd2l0Y2ggKGNvcmVQb3NpdGlvbikge1xuICAgIGNhc2UgJ3RvcCc6XG4gICAgICBleGNlZWRzLnRvcCA9IHJlY3QudG9wIC0geSA+IGJvcmRlcldpdGhEaXN0YW5jZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICBleGNlZWRzLmJvdHRvbSA9IHkgLSByZWN0LmJvdHRvbSA+IGJvcmRlcldpdGhEaXN0YW5jZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgZXhjZWVkcy5sZWZ0ID0gcmVjdC5sZWZ0IC0geCA+IGJvcmRlcldpdGhEaXN0YW5jZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgIGV4Y2VlZHMucmlnaHQgPSB4IC0gcmVjdC5yaWdodCA+IGJvcmRlcldpdGhEaXN0YW5jZTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIGV4Y2VlZHMudG9wIHx8IGV4Y2VlZHMuYm90dG9tIHx8IGV4Y2VlZHMubGVmdCB8fCBleGNlZWRzLnJpZ2h0O1xufVxuXG4vKipcbiogUmV0dXJucyByZWxldmFudCBsaXN0ZW5lciBjYWxsYmFja3MgZm9yIGVhY2ggcmVmXG4qIEBwYXJhbSB7RWxlbWVudH0gZWxcbiogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcbiogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4qIEByZXR1cm4ge09iamVjdH0gLSByZWxldmFudCBsaXN0ZW5lciBoYW5kbGVyc1xuKi9cbmZ1bmN0aW9uIGdldEV2ZW50TGlzdGVuZXJIYW5kbGVycyhlbCwgcG9wcGVyLCBzZXR0aW5ncykge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIHZhciBwb3NpdGlvbiA9IHNldHRpbmdzLnBvc2l0aW9uLFxuICAgICAgZGVsYXkgPSBzZXR0aW5ncy5kZWxheSxcbiAgICAgIGR1cmF0aW9uID0gc2V0dGluZ3MuZHVyYXRpb24sXG4gICAgICBpbnRlcmFjdGl2ZSA9IHNldHRpbmdzLmludGVyYWN0aXZlLFxuICAgICAgaW50ZXJhY3RpdmVCb3JkZXIgPSBzZXR0aW5ncy5pbnRlcmFjdGl2ZUJvcmRlcixcbiAgICAgIGRpc3RhbmNlID0gc2V0dGluZ3MuZGlzdGFuY2UsXG4gICAgICBoaWRlT25DbGljayA9IHNldHRpbmdzLmhpZGVPbkNsaWNrLFxuICAgICAgdHJpZ2dlciA9IHNldHRpbmdzLnRyaWdnZXIsXG4gICAgICB0b3VjaEhvbGQgPSBzZXR0aW5ncy50b3VjaEhvbGQsXG4gICAgICB0b3VjaFdhaXQgPSBzZXR0aW5ncy50b3VjaFdhaXQ7XG5cblxuICB2YXIgc2hvd0RlbGF5ID0gdm9pZCAwLFxuICAgICAgaGlkZURlbGF5ID0gdm9pZCAwO1xuXG4gIHZhciBjbGVhclRpbWVvdXRzID0gZnVuY3Rpb24gY2xlYXJUaW1lb3V0cygpIHtcbiAgICBjbGVhclRpbWVvdXQoc2hvd0RlbGF5KTtcbiAgICBjbGVhclRpbWVvdXQoaGlkZURlbGF5KTtcbiAgfTtcblxuICB2YXIgX3Nob3cgPSBmdW5jdGlvbiBfc2hvdygpIHtcbiAgICBjbGVhclRpbWVvdXRzKCk7XG5cbiAgICAvLyBOb3QgaGlkZGVuLiBGb3IgY2xpY2tpbmcgd2hlbiBpdCBhbHNvIGhhcyBhIGBmb2N1c2AgZXZlbnQgbGlzdGVuZXJcbiAgICBpZiAoaXNWaXNpYmxlKHBvcHBlcikpIHJldHVybjtcblxuICAgIHZhciBfZGVsYXkgPSBBcnJheS5pc0FycmF5KGRlbGF5KSA/IGRlbGF5WzBdIDogZGVsYXk7XG5cbiAgICBpZiAoZGVsYXkpIHtcbiAgICAgIHNob3dEZWxheSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuc2hvdyhwb3BwZXIpO1xuICAgICAgfSwgX2RlbGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgX3RoaXMuc2hvdyhwb3BwZXIpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgc2hvdyA9IGZ1bmN0aW9uIHNob3coZXZlbnQpIHtcbiAgICByZXR1cm4gX3RoaXMuY2FsbGJhY2tzLndhaXQgPyBfdGhpcy5jYWxsYmFja3Mud2FpdC5jYWxsKHBvcHBlciwgX3Nob3csIGV2ZW50KSA6IF9zaG93KCk7XG4gIH07XG5cbiAgdmFyIGhpZGUgPSBmdW5jdGlvbiBoaWRlKCkge1xuICAgIGNsZWFyVGltZW91dHMoKTtcblxuICAgIHZhciBfZGVsYXkgPSBBcnJheS5pc0FycmF5KGRlbGF5KSA/IGRlbGF5WzFdIDogZGVsYXk7XG5cbiAgICBpZiAoZGVsYXkpIHtcbiAgICAgIGhpZGVEZWxheSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuaGlkZShwb3BwZXIpO1xuICAgICAgfSwgX2RlbGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgX3RoaXMuaGlkZShwb3BwZXIpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgaGFuZGxlVHJpZ2dlciA9IGZ1bmN0aW9uIGhhbmRsZVRyaWdnZXIoZXZlbnQpIHtcbiAgICB2YXIgbW91c2VlbnRlclRvdWNoID0gZXZlbnQudHlwZSA9PT0gJ21vdXNlZW50ZXInICYmIEJyb3dzZXIuU1VQUE9SVFNfVE9VQ0ggJiYgQnJvd3Nlci50b3VjaDtcblxuICAgIGlmIChtb3VzZWVudGVyVG91Y2ggJiYgdG91Y2hIb2xkKSByZXR1cm47XG5cbiAgICAvLyBUb2dnbGUgc2hvdy9oaWRlIHdoZW4gY2xpY2tpbmcgY2xpY2stdHJpZ2dlcmVkIHRvb2x0aXBzXG4gICAgdmFyIGlzQ2xpY2sgPSBldmVudC50eXBlID09PSAnY2xpY2snO1xuICAgIHZhciBpc05vdFBlcnNpc3RlbnQgPSBoaWRlT25DbGljayAhPT0gJ3BlcnNpc3RlbnQnO1xuXG4gICAgaXNDbGljayAmJiBpc1Zpc2libGUocG9wcGVyKSAmJiBpc05vdFBlcnNpc3RlbnQgPyBoaWRlKCkgOiBzaG93KGV2ZW50KTtcblxuICAgIGlmIChtb3VzZWVudGVyVG91Y2ggJiYgQnJvd3Nlci5pT1MoKSAmJiBlbC5jbGljaykge1xuICAgICAgZWwuY2xpY2soKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGhhbmRsZU1vdXNlbGVhdmUgPSBmdW5jdGlvbiBoYW5kbGVNb3VzZWxlYXZlKGV2ZW50KSB7XG5cbiAgICAvLyBEb24ndCBmaXJlICdtb3VzZWxlYXZlJywgdXNlIHRoZSAndG91Y2hlbmQnXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWxlYXZlJyAmJiBCcm93c2VyLlNVUFBPUlRTX1RPVUNIICYmIEJyb3dzZXIudG91Y2ggJiYgdG91Y2hIb2xkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGludGVyYWN0aXZlKSB7XG4gICAgICAvLyBUZW1wb3JhcmlseSBoYW5kbGUgbW91c2Vtb3ZlIHRvIGNoZWNrIGlmIHRoZSBtb3VzZSBsZWZ0IHNvbWV3aGVyZVxuICAgICAgLy8gb3RoZXIgdGhhbiBpdHMgcG9wcGVyXG4gICAgICB2YXIgaGFuZGxlTW91c2Vtb3ZlID0gZnVuY3Rpb24gaGFuZGxlTW91c2Vtb3ZlKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIHRyaWdnZXJIaWRlID0gZnVuY3Rpb24gdHJpZ2dlckhpZGUoKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGlkZSk7XG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlTW91c2Vtb3ZlKTtcbiAgICAgICAgICBoaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNsb3Nlc3RUb29sdGlwcGVkRWwgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgU2VsZWN0b3JzLlRPT0xUSVBQRURfRUwpO1xuXG4gICAgICAgIHZhciBpc092ZXJQb3BwZXIgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgU2VsZWN0b3JzLlBPUFBFUikgPT09IHBvcHBlcjtcbiAgICAgICAgdmFyIGlzT3ZlckVsID0gY2xvc2VzdFRvb2x0aXBwZWRFbCA9PT0gZWw7XG4gICAgICAgIHZhciBpc0NsaWNrVHJpZ2dlcmVkID0gdHJpZ2dlci5pbmRleE9mKCdjbGljaycpICE9PSAtMTtcbiAgICAgICAgdmFyIGlzT3Zlck90aGVyVG9vbHRpcHBlZEVsID0gY2xvc2VzdFRvb2x0aXBwZWRFbCAmJiBjbG9zZXN0VG9vbHRpcHBlZEVsICE9PSBlbDtcblxuICAgICAgICBpZiAoaXNPdmVyT3RoZXJUb29sdGlwcGVkRWwpIHtcbiAgICAgICAgICByZXR1cm4gdHJpZ2dlckhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc092ZXJQb3BwZXIgfHwgaXNPdmVyRWwgfHwgaXNDbGlja1RyaWdnZXJlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChjdXJzb3JJc091dHNpZGVJbnRlcmFjdGl2ZUJvcmRlcihldmVudCwgcG9wcGVyLCBzZXR0aW5ncykpIHtcbiAgICAgICAgICB0cmlnZ2VySGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGhhbmRsZU1vdXNlbW92ZSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBpdCdzIG5vdCBpbnRlcmFjdGl2ZSwganVzdCBoaWRlIGl0XG4gICAgaGlkZSgpO1xuICB9O1xuXG4gIHZhciBoYW5kbGVCbHVyID0gZnVuY3Rpb24gaGFuZGxlQmx1cihldmVudCkge1xuICAgIC8vIElnbm9yZSBibHVyIG9uIHRvdWNoIGRldmljZXMsIGlmIHRoZXJlIGlzIG5vIGByZWxhdGVkVGFyZ2V0YCwgaGlkZVxuICAgIC8vIElmIHRoZSByZWxhdGVkIHRhcmdldCBpcyBhIHBvcHBlciwgaWdub3JlXG4gICAgaWYgKCFldmVudC5yZWxhdGVkVGFyZ2V0IHx8IEJyb3dzZXIudG91Y2gpIHJldHVybjtcbiAgICBpZiAoY2xvc2VzdChldmVudC5yZWxhdGVkVGFyZ2V0LCBTZWxlY3RvcnMuUE9QUEVSKSkgcmV0dXJuO1xuXG4gICAgaGlkZSgpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlVHJpZ2dlcjogaGFuZGxlVHJpZ2dlcixcbiAgICBoYW5kbGVNb3VzZWxlYXZlOiBoYW5kbGVNb3VzZWxlYXZlLFxuICAgIGhhbmRsZUJsdXI6IGhhbmRsZUJsdXJcbiAgfTtcbn1cblxuLyoqXG4qIEV2YWx1YXRlcy9tb2RpZmllcyB0aGUgc2V0dGluZ3Mgb2JqZWN0IGZvciBhcHByb3ByaWF0ZSBiZWhhdmlvclxuKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiogQHJldHVybiB7T2JqZWN0fSBtb2RpZmllZC9ldmFsdWF0ZWQgc2V0dGluZ3NcbiovXG5mdW5jdGlvbiBldmFsdWF0ZVNldHRpbmdzKHNldHRpbmdzKSB7XG4gIC8vIGFuaW1hdGVGaWxsIGlzIGRpc2FibGVkIGlmIGFuIGFycm93IGlzIHRydWVcbiAgaWYgKHNldHRpbmdzLmFycm93KSB7XG4gICAgc2V0dGluZ3MuYW5pbWF0ZUZpbGwgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIHJlYXNzaWduIGFwcGVuZFRvIGludG8gdGhlIHJlc3VsdCBvZiBldmFsdWF0aW5nIGFwcGVuZFRvXG4gIC8vIGlmIGl0J3Mgc2V0IGFzIGEgZnVuY3Rpb24gaW5zdGVhZCBvZiBFbGVtZW50XG4gIGlmIChzZXR0aW5ncy5hcHBlbmRUbyAmJiB0eXBlb2Ygc2V0dGluZ3MuYXBwZW5kVG8gPT09ICdmdW5jdGlvbicpIHtcbiAgICBzZXR0aW5ncy5hcHBlbmRUbyA9IHNldHRpbmdzLmFwcGVuZFRvKCk7XG4gIH1cblxuICByZXR1cm4gc2V0dGluZ3M7XG59XG5cbnZhciBpZENvdW50ZXIgPSAxO1xuXG4vKipcbiogQ3JlYXRlcyB0b29sdGlwcyBmb3IgYWxsIGVsIGVsZW1lbnRzIHRoYXQgbWF0Y2ggdGhlIGluc3RhbmNlJ3Mgc2VsZWN0b3JcbiogQHBhcmFtIHtFbGVtZW50W119IGVsc1xuKiBAcmV0dXJuIHtPYmplY3RbXX0gQXJyYXkgb2YgcmVmIGRhdGEgb2JqZWN0c1xuKi9cbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXBzKGVscykge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIHJldHVybiBlbHMucmVkdWNlKGZ1bmN0aW9uIChhLCBlbCkge1xuICAgIHZhciBpZCA9IGlkQ291bnRlcjtcblxuICAgIHZhciBzZXR0aW5ncyA9IGV2YWx1YXRlU2V0dGluZ3MoX3RoaXMuc2V0dGluZ3MucGVyZm9ybWFuY2UgPyBfdGhpcy5zZXR0aW5ncyA6IGdldEluZGl2aWR1YWxTZXR0aW5ncyhlbCwgX3RoaXMuc2V0dGluZ3MpKTtcblxuICAgIHZhciByZWZPYmplY3QgPSBfdGhpcy5yZWZPYmplY3Q7XG5cbiAgICB2YXIgaHRtbCA9IHNldHRpbmdzLmh0bWwsXG4gICAgICAgIHRyaWdnZXIgPSBzZXR0aW5ncy50cmlnZ2VyLFxuICAgICAgICB0b3VjaEhvbGQgPSBzZXR0aW5ncy50b3VjaEhvbGQ7XG5cblxuICAgIHZhciB0aXRsZSA9IGVsLmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcbiAgICBpZiAoIXRpdGxlICYmICFodG1sKSByZXR1cm4gYTtcblxuICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwcGVkJywgJycpO1xuICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsICd0aXBweS10b29sdGlwLScgKyBpZCk7XG4gICAgcmVtb3ZlVGl0bGUoZWwpO1xuXG4gICAgdmFyIHBvcHBlciA9IGNyZWF0ZVBvcHBlckVsZW1lbnQoaWQsIHRpdGxlLCBzZXR0aW5ncyk7XG4gICAgdmFyIGhhbmRsZXJzID0gZ2V0RXZlbnRMaXN0ZW5lckhhbmRsZXJzLmNhbGwoX3RoaXMsIGVsLCBwb3BwZXIsIHNldHRpbmdzKTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBbXTtcblxuICAgIHRyaWdnZXIudHJpbSgpLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHJldHVybiBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuY29uY2F0KGNyZWF0ZVRyaWdnZXIoZXZlbnQsIGVsLCBoYW5kbGVycywgdG91Y2hIb2xkKSk7XG4gICAgfSk7XG5cbiAgICBhLnB1c2goe1xuICAgICAgaWQ6IGlkLFxuICAgICAgZWw6IGVsLFxuICAgICAgcG9wcGVyOiBwb3BwZXIsXG4gICAgICBzZXR0aW5nczogc2V0dGluZ3MsXG4gICAgICBsaXN0ZW5lcnM6IGxpc3RlbmVycyxcbiAgICAgIHRpcHB5SW5zdGFuY2U6IF90aGlzLFxuICAgICAgcmVmT2JqZWN0OiByZWZPYmplY3RcbiAgICB9KTtcblxuICAgIGlkQ291bnRlcisrO1xuXG4gICAgcmV0dXJuIGE7XG4gIH0sIFtdKTtcbn1cblxuLyogVXRpbGl0eSBmdW5jdGlvbnMgKi9cbi8qIENvcmUgbGlicmFyeSBmdW5jdGlvbnMgKi9cbi8qKlxuKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fEVsZW1lbnRbXX0gc2VsZWN0b3JcbiogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIChvcHRpb25hbCkgLSB0aGUgb2JqZWN0IG9mIHNldHRpbmdzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGluc3RhbmNlXG4qIEBwYXJhbSB7T2JqZWN0fSByZWZPYmplY3QgKG9wdGlvbmFsKSAtIG92ZXJyaWRlIGZvciBwb3BwZXIgcmVmZXJlbmNlIG9iamVjdFxuKi9cblxudmFyIFRpcHB5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBUaXBweShzZWxlY3Rvcikge1xuICAgIHZhciBzZXR0aW5ncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgdmFyIHJlZk9iamVjdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogbnVsbDtcbiAgICBjbGFzc0NhbGxDaGVjayQxKHRoaXMsIFRpcHB5KTtcblxuICAgIC8vIFVzZSBkZWZhdWx0IGJyb3dzZXIgdG9vbHRpcCBvbiB1bnN1cHBvcnRlZCBicm93c2Vyc1xuICAgIGlmICghQnJvd3Nlci5TVVBQT1JURUQpIHJldHVybjtcblxuICAgIGluaXQoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkZXN0cm95ZWQ6IGZhbHNlXG4gICAgfTtcblxuICAgIHRoaXMuc2VsZWN0b3IgPSBzZWxlY3RvcjtcblxuICAgIHRoaXMucmVmT2JqZWN0ID0gcmVmT2JqZWN0O1xuXG4gICAgdGhpcy5zZXR0aW5ncyA9IF9leHRlbmRzJDEoe30sIERlZmF1bHRzLCBzZXR0aW5ncyk7XG5cbiAgICBpZiAoc2V0dGluZ3Muc2hvdyB8fCBzZXR0aW5ncy5zaG93biB8fCBzZXR0aW5ncy5oaWRlIHx8IHNldHRpbmdzLmhpZGRlbikge1xuICAgICAgY29uc29sZS53YXJuKCdDYWxsYmFja3Mgd2l0aG91dCB0aGUgYG9uYCBwcmVmaXggYXJlIGRlcHJlY2F0ZWQgKHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBgd2FpdGApLicgKyAnIFVzZSBvblNob3csIG9uU2hvd24sIG9uSGlkZSwgYW5kIG9uSGlkZGVuIGluc3RlYWQuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5jYWxsYmFja3MgPSB7XG4gICAgICB3YWl0OiBzZXR0aW5ncy53YWl0LFxuICAgICAgc2hvdzogc2V0dGluZ3Mub25TaG93IHx8IHNldHRpbmdzLnNob3cgfHwgbm9vcCxcbiAgICAgIHNob3duOiBzZXR0aW5ncy5vblNob3duIHx8IHNldHRpbmdzLnNob3duIHx8IG5vb3AsXG4gICAgICBoaWRlOiBzZXR0aW5ncy5vbkhpZGUgfHwgc2V0dGluZ3MuaGlkZSB8fCBub29wLFxuICAgICAgaGlkZGVuOiBzZXR0aW5ncy5vbkhpZGRlbiB8fCBzZXR0aW5ncy5oaWRkZW4gfHwgbm9vcFxuICAgIH07XG5cbiAgICB0aGlzLnN0b3JlID0gY3JlYXRlVG9vbHRpcHMuY2FsbCh0aGlzLCBnZXRBcnJheU9mRWxlbWVudHMoc2VsZWN0b3IpKTtcbiAgICBTdG9yZS5wdXNoLmFwcGx5KFN0b3JlLCB0aGlzLnN0b3JlKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHJlZmVyZW5jZSBlbGVtZW50J3MgcG9wcGVyIGVsZW1lbnRcbiAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICogQHJldHVybiB7RWxlbWVudH1cbiAgKi9cblxuXG4gIGNyZWF0ZUNsYXNzJDEoVGlwcHksIFt7XG4gICAga2V5OiAnZ2V0UG9wcGVyRWxlbWVudCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBvcHBlckVsZW1lbnQoZWwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBmaW5kKHRoaXMuc3RvcmUsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEuZWwgPT09IGVsO1xuICAgICAgICB9KS5wb3BwZXI7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tnZXRQb3BwZXJFbGVtZW50XTogRWxlbWVudCBwYXNzZWQgYXMgdGhlIGFyZ3VtZW50IGRvZXMgbm90IGV4aXN0IGluIHRoZSBpbnN0YW5jZScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICogUmV0dXJucyBhIHBvcHBlcidzIHJlZmVyZW5jZSBlbGVtZW50XG4gICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxuICAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdnZXRSZWZlcmVuY2VFbGVtZW50JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UmVmZXJlbmNlRWxlbWVudChwb3BwZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBmaW5kKHRoaXMuc3RvcmUsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEucG9wcGVyID09PSBwb3BwZXI7XG4gICAgICAgIH0pLmVsO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdbZ2V0UmVmZXJlbmNlRWxlbWVudF06IFBvcHBlciBwYXNzZWQgYXMgdGhlIGFyZ3VtZW50IGRvZXMgbm90IGV4aXN0IGluIHRoZSBpbnN0YW5jZScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgcmVmZXJlbmNlIGRhdGEgb2JqZWN0IGZyb20gZWl0aGVyIHRoZSByZWZlcmVuY2UgZWxlbWVudCBvciBwb3BwZXIgZWxlbWVudFxuICAgICogQHBhcmFtIHtFbGVtZW50fSB4IChyZWZlcmVuY2UgZWxlbWVudCBvciBwb3BwZXIpXG4gICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZ2V0UmVmZXJlbmNlRGF0YScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFJlZmVyZW5jZURhdGEoeCkge1xuICAgICAgcmV0dXJuIGZpbmQodGhpcy5zdG9yZSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuZWwgPT09IHggfHwgZGF0YS5wb3BwZXIgPT09IHg7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFNob3dzIGEgcG9wcGVyXG4gICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxuICAgICogQHBhcmFtIHtOdW1iZXJ9IGN1c3RvbUR1cmF0aW9uIChvcHRpb25hbClcbiAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdzaG93JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2hvdyhwb3BwZXIsIGN1c3RvbUR1cmF0aW9uKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBpZiAodGhpcy5zdGF0ZS5kZXN0cm95ZWQpIHJldHVybjtcblxuICAgICAgdmFyIGRhdGEgPSBmaW5kKHRoaXMuc3RvcmUsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnBvcHBlciA9PT0gcG9wcGVyO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50cyA9IGdldElubmVyRWxlbWVudHMocG9wcGVyKSxcbiAgICAgICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHMudG9vbHRpcCxcbiAgICAgICAgICBjaXJjbGUgPSBfZ2V0SW5uZXJFbGVtZW50cy5jaXJjbGUsXG4gICAgICAgICAgY29udGVudCA9IF9nZXRJbm5lckVsZW1lbnRzLmNvbnRlbnQ7XG5cbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jb250YWlucyhkYXRhLmVsKSkge1xuICAgICAgICB0aGlzLmRlc3Ryb3kocG9wcGVyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhbGxiYWNrcy5zaG93LmNhbGwocG9wcGVyKTtcblxuICAgICAgdmFyIGVsID0gZGF0YS5lbCxcbiAgICAgICAgICBfZGF0YSRzZXR0aW5ncyA9IGRhdGEuc2V0dGluZ3MsXG4gICAgICAgICAgYXBwZW5kVG8gPSBfZGF0YSRzZXR0aW5ncy5hcHBlbmRUbyxcbiAgICAgICAgICBzdGlja3kgPSBfZGF0YSRzZXR0aW5ncy5zdGlja3ksXG4gICAgICAgICAgaW50ZXJhY3RpdmUgPSBfZGF0YSRzZXR0aW5ncy5pbnRlcmFjdGl2ZSxcbiAgICAgICAgICBmb2xsb3dDdXJzb3IgPSBfZGF0YSRzZXR0aW5ncy5mb2xsb3dDdXJzb3IsXG4gICAgICAgICAgZmxpcER1cmF0aW9uID0gX2RhdGEkc2V0dGluZ3MuZmxpcER1cmF0aW9uLFxuICAgICAgICAgIGR1cmF0aW9uID0gX2RhdGEkc2V0dGluZ3MuZHVyYXRpb24sXG4gICAgICAgICAgZHluYW1pY1RpdGxlID0gX2RhdGEkc2V0dGluZ3MuZHluYW1pY1RpdGxlLFxuICAgICAgICAgIHJlZk9iamVjdCA9IGRhdGEucmVmT2JqZWN0O1xuXG5cbiAgICAgIGlmIChkeW5hbWljVGl0bGUpIHtcbiAgICAgICAgdmFyIHRpdGxlID0gZWwuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xuICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICBjb250ZW50LmlubmVySFRNTCA9IHRpdGxlO1xuICAgICAgICAgIHJlbW92ZVRpdGxlKGVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgX2R1cmF0aW9uID0gY3VzdG9tRHVyYXRpb24gIT09IHVuZGVmaW5lZCA/IGN1c3RvbUR1cmF0aW9uIDogQXJyYXkuaXNBcnJheShkdXJhdGlvbikgPyBkdXJhdGlvblswXSA6IGR1cmF0aW9uO1xuXG4gICAgICAvLyBQcmV2ZW50IGEgdHJhbnNpdGlvbiB3aGVuIHBvcHBlciBjaGFuZ2VzIHBvc2l0aW9uXG4gICAgICBhcHBseVRyYW5zaXRpb25EdXJhdGlvbihbcG9wcGVyLCB0b29sdGlwLCBjaXJjbGVdLCAwKTtcblxuICAgICAgbW91bnRQb3BwZXIoZGF0YSk7XG5cbiAgICAgIHBvcHBlci5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgLy8gV2FpdCBmb3IgcG9wcGVyJ3MgcG9zaXRpb24gdG8gdXBkYXRlXG4gICAgICBkZWZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFNvbWV0aW1lcyB0aGUgYXJyb3cgd2lsbCBub3QgYmUgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24sIGZvcmNlIGFub3RoZXIgdXBkYXRlXG4gICAgICAgIGlmICghZm9sbG93Q3Vyc29yIHx8IEJyb3dzZXIudG91Y2gpIHtcbiAgICAgICAgICBkYXRhLnBvcHBlckluc3RhbmNlLnVwZGF0ZSgpO1xuICAgICAgICAgIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uKFtwb3BwZXJdLCBmbGlwRHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmUtYXBwbHkgdHJhbnNpdGlvbiBkdXJhdGlvbnNcbiAgICAgICAgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oW3Rvb2x0aXAsIGNpcmNsZV0sIF9kdXJhdGlvbik7XG5cbiAgICAgICAgLy8gTWFrZSBjb250ZW50IGZhZGUgb3V0IGEgYml0IGZhc3RlciB0aGFuIHRoZSB0b29sdGlwIGlmIGBhbmltYXRlRmlsbGBcbiAgICAgICAgaWYgKGNpcmNsZSkgY29udGVudC5zdHlsZS5vcGFjaXR5ID0gMTtcblxuICAgICAgICAvLyBJbnRlcmFjdGl2ZSB0b29sdGlwcyByZWNlaXZlIGEgY2xhc3Mgb2YgJ2FjdGl2ZSdcbiAgICAgICAgaW50ZXJhY3RpdmUgJiYgZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHBvcHBlcidzIHBvc2l0aW9uIG9uIGV2ZXJ5IGFuaW1hdGlvbiBmcmFtZVxuICAgICAgICBzdGlja3kgJiYgbWFrZVN0aWNreShkYXRhKTtcblxuICAgICAgICAvLyBSZXBhaW50L3JlZmxvdyBpcyByZXF1aXJlZCBmb3IgQ1NTIHRyYW5zaXRpb24gd2hlbiBhcHBlbmRpbmdcbiAgICAgICAgdHJpZ2dlclJlZmxvdyh0b29sdGlwLCBjaXJjbGUpO1xuXG4gICAgICAgIG1vZGlmeUNsYXNzTGlzdChbdG9vbHRpcCwgY2lyY2xlXSwgZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgICAgICBsaXN0LmNvbnRhaW5zKCd0aXBweS1ub3RyYW5zaXRpb24nKSAmJiBsaXN0LnJlbW92ZSgndGlwcHktbm90cmFuc2l0aW9uJyk7XG4gICAgICAgICAgbGlzdC5yZW1vdmUoJ2xlYXZlJyk7XG4gICAgICAgICAgbGlzdC5hZGQoJ2VudGVyJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdhaXQgZm9yIHRyYW5zaXRpb25zIHRvIGNvbXBsZXRlXG4gICAgICAgIG9uVHJhbnNpdGlvbkVuZChkYXRhLCBfZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWlzVmlzaWJsZShwb3BwZXIpIHx8IGRhdGEuX29uU2hvd25GaXJlZCkgcmV0dXJuO1xuXG4gICAgICAgICAgLy8gRm9jdXMgaW50ZXJhY3RpdmUgdG9vbHRpcHMgb25seVxuICAgICAgICAgIGludGVyYWN0aXZlICYmIHBvcHBlci5mb2N1cygpO1xuICAgICAgICAgIC8vIFJlbW92ZSB0cmFuc2l0aW9ucyBmcm9tIHRvb2x0aXBcbiAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ3RpcHB5LW5vdHJhbnNpdGlvbicpO1xuICAgICAgICAgIC8vIFByZXZlbnRzIHNob3duKCkgZnJvbSBmaXJpbmcgbW9yZSB0aGFuIG9uY2UgZnJvbSBlYXJseSB0cmFuc2l0aW9uIGNhbmNlbGxhdGlvbnNcbiAgICAgICAgICBkYXRhLl9vblNob3duRmlyZWQgPSB0cnVlO1xuXG4gICAgICAgICAgX3RoaXMuY2FsbGJhY2tzLnNob3duLmNhbGwocG9wcGVyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIEhpZGVzIGEgcG9wcGVyXG4gICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxuICAgICogQHBhcmFtIHtOdW1iZXJ9IGN1c3RvbUR1cmF0aW9uIChvcHRpb25hbClcbiAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdoaWRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGlkZShwb3BwZXIsIGN1c3RvbUR1cmF0aW9uKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgaWYgKHRoaXMuc3RhdGUuZGVzdHJveWVkKSByZXR1cm47XG5cbiAgICAgIHRoaXMuY2FsbGJhY2tzLmhpZGUuY2FsbChwb3BwZXIpO1xuXG4gICAgICB2YXIgZGF0YSA9IGZpbmQodGhpcy5zdG9yZSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEucG9wcGVyID09PSBwb3BwZXI7XG4gICAgICB9KTtcblxuICAgICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzMiA9IGdldElubmVyRWxlbWVudHMocG9wcGVyKSxcbiAgICAgICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHMyLnRvb2x0aXAsXG4gICAgICAgICAgY2lyY2xlID0gX2dldElubmVyRWxlbWVudHMyLmNpcmNsZSxcbiAgICAgICAgICBjb250ZW50ID0gX2dldElubmVyRWxlbWVudHMyLmNvbnRlbnQ7XG5cbiAgICAgIHZhciBlbCA9IGRhdGEuZWwsXG4gICAgICAgICAgX2RhdGEkc2V0dGluZ3MyID0gZGF0YS5zZXR0aW5ncyxcbiAgICAgICAgICBhcHBlbmRUbyA9IF9kYXRhJHNldHRpbmdzMi5hcHBlbmRUbyxcbiAgICAgICAgICBzdGlja3kgPSBfZGF0YSRzZXR0aW5nczIuc3RpY2t5LFxuICAgICAgICAgIGludGVyYWN0aXZlID0gX2RhdGEkc2V0dGluZ3MyLmludGVyYWN0aXZlLFxuICAgICAgICAgIGZvbGxvd0N1cnNvciA9IF9kYXRhJHNldHRpbmdzMi5mb2xsb3dDdXJzb3IsXG4gICAgICAgICAgaHRtbCA9IF9kYXRhJHNldHRpbmdzMi5odG1sLFxuICAgICAgICAgIHRyaWdnZXIgPSBfZGF0YSRzZXR0aW5nczIudHJpZ2dlcixcbiAgICAgICAgICBkdXJhdGlvbiA9IF9kYXRhJHNldHRpbmdzMi5kdXJhdGlvbjtcblxuXG4gICAgICB2YXIgX2R1cmF0aW9uID0gY3VzdG9tRHVyYXRpb24gIT09IHVuZGVmaW5lZCA/IGN1c3RvbUR1cmF0aW9uIDogQXJyYXkuaXNBcnJheShkdXJhdGlvbikgPyBkdXJhdGlvblsxXSA6IGR1cmF0aW9uO1xuXG4gICAgICBkYXRhLl9vblNob3duRmlyZWQgPSBmYWxzZTtcbiAgICAgIGludGVyYWN0aXZlICYmIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXG4gICAgICBwb3BwZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgICBhcHBseVRyYW5zaXRpb25EdXJhdGlvbihbdG9vbHRpcCwgY2lyY2xlLCBjaXJjbGUgPyBjb250ZW50IDogbnVsbF0sIF9kdXJhdGlvbik7XG5cbiAgICAgIGlmIChjaXJjbGUpIGNvbnRlbnQuc3R5bGUub3BhY2l0eSA9IDA7XG5cbiAgICAgIG1vZGlmeUNsYXNzTGlzdChbdG9vbHRpcCwgY2lyY2xlXSwgZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgICAgbGlzdC5jb250YWlucygndGlwcHktdG9vbHRpcCcpICYmIGxpc3QucmVtb3ZlKCd0aXBweS1ub3RyYW5zaXRpb24nKTtcbiAgICAgICAgbGlzdC5yZW1vdmUoJ2VudGVyJyk7XG4gICAgICAgIGxpc3QuYWRkKCdsZWF2ZScpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlLWZvY3VzIGNsaWNrLXRyaWdnZXJlZCBodG1sIGVsZW1lbnRzXG4gICAgICAvLyBhbmQgdGhlIHRvb2x0aXBwZWQgZWxlbWVudCBJUyBpbiB0aGUgdmlld3BvcnQgKG90aGVyd2lzZSBpdCBjYXVzZXMgdW5zaWdodGx5IHNjcm9sbGluZ1xuICAgICAgLy8gaWYgdGhlIHRvb2x0aXAgaXMgY2xvc2VkIGFuZCB0aGUgZWxlbWVudCBpc24ndCBpbiB0aGUgdmlld3BvcnQgYW55bW9yZSlcbiAgICAgIGlmIChodG1sICYmIHRyaWdnZXIuaW5kZXhPZignY2xpY2snKSAhPT0gLTEgJiYgZWxlbWVudElzSW5WaWV3cG9ydChlbCkpIHtcbiAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gV2FpdCBmb3IgdHJhbnNpdGlvbnMgdG8gY29tcGxldGVcbiAgICAgIG9uVHJhbnNpdGlvbkVuZChkYXRhLCBfZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gYGlzVmlzaWJsZWAgaXMgbm90IGNvbXBsZXRlbHkgcmVsaWFibGUgdG8gZGV0ZXJtaW5lIGlmIHdlIHNob3VsZG4ndFxuICAgICAgICAvLyBydW4gdGhlIGhpZGRlbiBjYWxsYmFjaywgd2UgbmVlZCB0byBjaGVjayB0aGUgY29tcHV0ZWQgb3BhY2l0eSBzdHlsZS5cbiAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyBnbGl0Y2h5IGJlaGF2aW9yIG9mIHRoZSB0cmFuc2l0aW9uIHdoZW4gcXVpY2tseSBzaG93aW5nXG4gICAgICAgIC8vIGFuZCBoaWRpbmcgYSB0b29sdGlwLlxuICAgICAgICBpZiAoaXNWaXNpYmxlKHBvcHBlcikgfHwgIWFwcGVuZFRvLmNvbnRhaW5zKHBvcHBlcikgfHwgZ2V0Q29tcHV0ZWRTdHlsZSh0b29sdGlwKS5vcGFjaXR5ID09PSAnMScpIHJldHVybjtcblxuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmb2xsb3dDdXJzb3JIYW5kbGVyKTtcbiAgICAgICAgZGF0YS5wb3BwZXJJbnN0YW5jZS5kaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgYXBwZW5kVG8ucmVtb3ZlQ2hpbGQocG9wcGVyKTtcblxuICAgICAgICBfdGhpczIuY2FsbGJhY2tzLmhpZGRlbi5jYWxsKHBvcHBlcik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFVwZGF0ZXMgYSBwb3BwZXIgd2l0aCBuZXcgY29udGVudFxuICAgICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcbiAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd1cGRhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUocG9wcGVyKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5kZXN0cm95ZWQpIHJldHVybjtcblxuICAgICAgdmFyIGRhdGEgPSBmaW5kKHRoaXMuc3RvcmUsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnBvcHBlciA9PT0gcG9wcGVyO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50czMgPSBnZXRJbm5lckVsZW1lbnRzKHBvcHBlciksXG4gICAgICAgICAgY29udGVudCA9IF9nZXRJbm5lckVsZW1lbnRzMy5jb250ZW50O1xuXG4gICAgICB2YXIgZWwgPSBkYXRhLmVsLFxuICAgICAgICAgIGh0bWwgPSBkYXRhLnNldHRpbmdzLmh0bWw7XG5cblxuICAgICAgaWYgKGh0bWwgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQWJvcnRlZDogdXBkYXRlKCkgc2hvdWxkIG5vdCBiZSB1c2VkIGlmIGBodG1sYCBpcyBhIERPTSBlbGVtZW50Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29udGVudC5pbm5lckhUTUwgPSBodG1sID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbC5yZXBsYWNlKCcjJywgJycpKS5pbm5lckhUTUwgOiBlbC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJykgfHwgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLXRpdGxlJyk7XG5cbiAgICAgIGlmICghaHRtbCkgcmVtb3ZlVGl0bGUoZWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogRGVzdHJveXMgYSBwb3BwZXJcbiAgICAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyXG4gICAgKiBAcGFyYW0ge0Jvb2xlYW59IF9pc0xhc3QgLSBwcml2YXRlIHBhcmFtIHVzZWQgYnkgZGVzdHJveUFsbCB0byBvcHRpbWl6ZVxuICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2Rlc3Ryb3knLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KHBvcHBlciwgX2lzTGFzdCkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLnN0YXRlLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICB2YXIgZGF0YSA9IGZpbmQodGhpcy5zdG9yZSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEucG9wcGVyID09PSBwb3BwZXI7XG4gICAgICB9KTtcblxuICAgICAgdmFyIGVsID0gZGF0YS5lbCxcbiAgICAgICAgICBwb3BwZXJJbnN0YW5jZSA9IGRhdGEucG9wcGVySW5zdGFuY2UsXG4gICAgICAgICAgbGlzdGVuZXJzID0gZGF0YS5saXN0ZW5lcnMsXG4gICAgICAgICAgX211dGF0aW9uT2JzZXJ2ZXIgPSBkYXRhLl9tdXRhdGlvbk9ic2VydmVyO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIHBvcHBlciBpcyBoaWRkZW5cblxuICAgICAgaWYgKGlzVmlzaWJsZShwb3BwZXIpKSB7XG4gICAgICAgIHRoaXMuaGlkZShwb3BwZXIsIDApO1xuICAgICAgfVxuXG4gICAgICAvLyBSZW1vdmUgVGlwcHktb25seSBldmVudCBsaXN0ZW5lcnMgZnJvbSB0b29sdGlwcGVkIGVsZW1lbnRcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lci5ldmVudCwgbGlzdGVuZXIuaGFuZGxlcik7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVzdG9yZSBvcmlnaW5hbCB0aXRsZVxuICAgICAgZWwuc2V0QXR0cmlidXRlKCd0aXRsZScsIGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1vcmlnaW5hbC10aXRsZScpKTtcblxuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLXRpdGxlJyk7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcHBlZCcpO1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG5cbiAgICAgIHBvcHBlckluc3RhbmNlICYmIHBvcHBlckluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgIF9tdXRhdGlvbk9ic2VydmVyICYmIF9tdXRhdGlvbk9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcblxuICAgICAgLy8gUmVtb3ZlIGZyb20gc3RvcmVcbiAgICAgIFN0b3JlLnNwbGljZShmaW5kSW5kZXgoU3RvcmUsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnBvcHBlciA9PT0gcG9wcGVyO1xuICAgICAgfSksIDEpO1xuXG4gICAgICAvLyBFbnN1cmUgZmlsdGVyIGlzIGNhbGxlZCBvbmx5IG9uY2VcbiAgICAgIGlmIChfaXNMYXN0ID09PSB1bmRlZmluZWQgfHwgX2lzTGFzdCkge1xuICAgICAgICB0aGlzLnN0b3JlID0gU3RvcmUuZmlsdGVyKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGEudGlwcHlJbnN0YW5jZSA9PT0gX3RoaXMzO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIERlc3Ryb3lzIGFsbCB0b29sdGlwcyBjcmVhdGVkIGJ5IHRoZSBpbnN0YW5jZVxuICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2Rlc3Ryb3lBbGwnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95QWxsKCkge1xuICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLnN0YXRlLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICB2YXIgc3RvcmVMZW5ndGggPSB0aGlzLnN0b3JlLmxlbmd0aDtcblxuICAgICAgdGhpcy5zdG9yZS5mb3JFYWNoKGZ1bmN0aW9uIChfcmVmLCBpbmRleCkge1xuICAgICAgICB2YXIgcG9wcGVyID0gX3JlZi5wb3BwZXI7XG5cbiAgICAgICAgX3RoaXM0LmRlc3Ryb3kocG9wcGVyLCBpbmRleCA9PT0gc3RvcmVMZW5ndGggLSAxKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnN0b3JlID0gbnVsbDtcbiAgICAgIHRoaXMuc3RhdGUuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFRpcHB5O1xufSgpO1xuXG5mdW5jdGlvbiB0aXBweSQyKHNlbGVjdG9yLCBzZXR0aW5ncywgcmVmT2JqZWN0KSB7XG4gIHJldHVybiBuZXcgVGlwcHkoc2VsZWN0b3IsIHNldHRpbmdzLCByZWZPYmplY3QpO1xufVxuXG50aXBweSQyLkJyb3dzZXIgPSBCcm93c2VyO1xudGlwcHkkMi5EZWZhdWx0cyA9IERlZmF1bHRzO1xudGlwcHkkMi5kaXNhYmxlRHluYW1pY0lucHV0RGV0ZWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gQnJvd3Nlci5keW5hbWljSW5wdXREZXRlY3Rpb24gPSBmYWxzZTtcbn07XG50aXBweSQyLmVuYWJsZUR5bmFtaWNJbnB1dERldGVjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIEJyb3dzZXIuZHluYW1pY0lucHV0RGV0ZWN0aW9uID0gdHJ1ZTtcbn07XG5cbnJldHVybiB0aXBweSQyO1xuXG59KSkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvcmUvdGlwcHkuanMiLCJjb25zdCBpbXBsID0gcmVxdWlyZSgnLi9jb3JlJyk7XG5cbi8vIHJlZ2lzdGVycyB0aGUgZXh0ZW5zaW9uIG9uIGEgY3l0b3NjYXBlIGxpYiByZWZcbmxldCByZWdpc3RlciA9IGZ1bmN0aW9uKCBjeXRvc2NhcGUgKXtcbiAgaWYoICFjeXRvc2NhcGUgKXsgcmV0dXJuOyB9IC8vIGNhbid0IHJlZ2lzdGVyIGlmIGN5dG9zY2FwZSB1bnNwZWNpZmllZFxuXG4gIGN5dG9zY2FwZSggJ2NvcmUnLCAndGlwcHknLCBpbXBsLmNvcmUgKTsgLy8gcmVnaXN0ZXIgd2l0aCBjeXRvc2NhcGUuanNcbiAgY3l0b3NjYXBlKCAnY29sbGVjdGlvbicsICd0aXBweScsIGltcGwuY29sbGVjdGlvbik7IC8vQ3l0b3NjYXBlIENvbGxlY3Rpb25zXG5cbn07XG5cbmlmKCB0eXBlb2YgY3l0b3NjYXBlICE9PSAndW5kZWZpbmVkJyApeyAvLyBleHBvc2UgdG8gZ2xvYmFsIGN5dG9zY2FwZSAoaS5lLiB3aW5kb3cuY3l0b3NjYXBlKVxuICByZWdpc3RlciggY3l0b3NjYXBlICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
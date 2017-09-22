import Tippy from './tippy.js';

//Include helper functions and Tippy
const helper = require('./helper.js');

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

        //Get Dimensions 
        var dim = helper.getTippyObjectDimensions(cyElement, isNode);

        //Define popper refernce object
        var refObject = {
            getBoundingClientRect: function () {
                return helper.getPopperBoundingBox(cyElement, cy, isNode, dim);
            },
            get clientWidth() {
                return dim.w;
            },
            get clientHeight() {
                return dim.h;
            },
        };

        //Create an actual tippy object and override the reference object.
        var tippy = Tippy(selector, userOptions , refObject);

        //Get the actual html tippy element
        var tippyElement = document.querySelector(selector);

        //Get popper
        var popper = tippy.getPopperElement(tippyElement)

        //Store popper object in a scratch pad
        cyElement.scratch('tippy-popper', popper);
        
        return tippy;
    }

};
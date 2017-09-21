//Include helper functions and Tippy
const helper = require('./helper.js');
import Tippy from './tippy.js';
                       
//Generate a options object to wrap the given user options
module.exports.createTippyOptionsObject = function (userOptions) {
    var options = Object.assign({}, userOptions);

    //If id is undefined, created a unique id based on time
    //if (!(userOptions.id)) {
       // options.id = 'cy-tippy-target-' + (Date.now() + Math.round(Math.random() + 10000));
   // }

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

        //Create an actual tippy object
        var tippy = Tippy(selector, {
            position: 'right',
            popperOptions: {
                el  : ""
            }
        });
        var tippyElement = document.querySelector(selector);

        //Get popper
        var popper = tippy.getPopperElement(tippyElement)

        //Store popper object in a scratch pad
        cyElement.scratch('tippy-popper', popper);
        console.log(popper);
        return tippy;
    }

};
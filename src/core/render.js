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
        var target = null;

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

        //Get target to bind popper to
        try {
            target = helper.getPopperObjectTarget(cyElement, selector);
        }
        catch (e) {
            //Error
            //Stop creating a popper for tippy
            return;;
        }

        //Create an actual tippy object and override the reference object.
        var tippy = Tippy(target, userOptions, refObject);

        //Get the actual html tippy element
        var tippyElement = document.querySelector(target);

        //Get popper
        var popper = tippy.getPopperElement(tippyElement)


        //Store popper object in a scratch pad
        cyElement.scratch('tippy-popper', popper);

        //Bind tap event to tippy.show();
        /*
        cyElement.on('tap', function (evt) {
            var popperElement = evt.target.scratch('tippy-popper')
            evt.target.scratch('tippy').show(popperElement);
        }); */

        //Bind mouse over event to tippy.show()
        cyElement.on('mouseover', function (evt) {
            var popperElement = evt.target.scratch('tippy-popper')
            evt.target.scratch('tippy').show(popperElement);
        });

        //Bind mouse out  event to tippy.hide()
        cyElement.on('mouseout', function (evt) {
            var popperElement = evt.target.scratch('tippy-popper')
            evt.target.scratch('tippy').hide(popperElement);
        });

        //Bind drag event to popper update
        cyElement.on('drag', function (evt) {
            //Get Popper Element and html status
            var popperElement = evt.target.scratch('tippy-popper');
            var html = evt.target.scratch('tippy').settings.html;

            //Only update content is not a html tooltip
            if (!(html)) evt.target.scratch('tippy').update(popperElement);
        });


        return tippy;
    }

};
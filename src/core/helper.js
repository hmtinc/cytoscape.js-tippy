//Update tippy object
module.exports.updateTippyObjectPosition = function(cyElement){
    var tippy = cyElement.scratch('tippy');
    tippy.update();
    return tippy;
};

//Return the bounding rectangle for the given element
module.exports.getPopperBoundingBox = function (cyElement, cy, isNode, dim) {
    var position;

    if (isNode) {
        position = cyElement.renderedPosition();
    }
    else {
        position = undefined;
    }

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
        height: dim.h,
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
    if (!(targetOpt)) {
        throw "Error : NULL Target";
    }
    //Execute function if user opted for a dyanamic target
    else if (typeof targetOpt === 'function') {
        target = targetOpt(cyElement);
    }
    //Treat target option as an ID if  user opted for a static target
    else if (typeof targetOpt === 'string') {
        target = targetOpt;
    }
    else {
        throw "Error : No Target";
    }

    //Check validity of parsed target
    if (target === null) {
        throw "Error : No Target";
    } else {
        return target;
    }

};


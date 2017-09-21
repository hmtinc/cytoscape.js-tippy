//Update tippy object
module.exports.updateTippyObjectPosition = function(cyElement){
    var tippy = cyElement.scratch('tippy');
    tippy.update();
    return tippy;
};
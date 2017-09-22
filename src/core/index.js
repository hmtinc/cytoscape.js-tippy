const tippyRenderer = require('./render.js');

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

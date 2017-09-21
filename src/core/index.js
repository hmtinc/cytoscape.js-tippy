const tippyRenderer = require('./render.js');

module.exports.core = function(selector, userOptions){
  let cy = this;

  // your extension impl...

  return this; // chainability
};


//Create a tippy object for all elements in a collection
module.exports.collection = function(selector, userOptions){
  var elements = this;
  var cy = this.cy();
  var container = cy.container();

  //Loop over each element in the current collection.
  elements.each(function(element, i){
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

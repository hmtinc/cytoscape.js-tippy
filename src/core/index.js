const popperRenderer = require('./render.js');

module.exports.core = function(){
  let cy = this;

  // your extension impl...

  return this; // chainability
};


//Create a tippy object for all elements in a collection
module.exports.collection = function(){
  var elements = this;
  var cy = this.cy();
  var container = cy.container();

  //Loop over each element in the current collection.
  elements.each(function(element, i){
      //Create options object for current element
  });


  return this; // chainability
};

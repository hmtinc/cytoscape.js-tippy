const impl = require('./core');

// registers the extension on a cytoscape lib ref
let register = function( cytoscape ){
  if( !cytoscape ){ return; } // can't register if cytoscape unspecified

  cytoscape( 'core', 'tippy', impl.core ); // register with cytoscape.js
  cytoscape( 'collection', 'tippy', impl.collection); //Cytoscape Collections

};

if( typeof cytoscape !== 'undefined' ){ // expose to global cytoscape (i.e. window.cytoscape)
  register( cytoscape );
}

module.exports = register;

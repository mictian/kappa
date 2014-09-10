/** Package wrapper and layout.
*/
"use strict";
(function (global, init) { // Universal Module Definition.
	if (typeof define === 'function' && define.amd) {
		define([/* Put dependencies here. */], init); // AMD module.
	} else if (typeof module === 'object' && module.exports) {
		module.exports = init(/* require("dep'), ... */ ); // CommonJS module.
	} else { // Browser or web worker (probably).
		global.kappa = init(/* global.dep, ... */); // Assumes base is loaded.
	}
})(this, function __init__() {

	var k = { // Library layout. ///////////////////////////////////////////////
		__name__: 'kappa',
		__init__: __init__,
		__dependencies__: { /* 'dep': dep, ... */ },
		__version__: '0.0.1',
	// Namespaces.
		utils: {}, 
		data: {}, 
		lexer: {}, 
		parser: {},
	};

// Continued by all sources concatenated and __epilogue__.js at the end.
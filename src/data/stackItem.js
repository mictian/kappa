define(['../utils/obj'],  function(k)
{
	'use strict';
	
	/* StackItem
    * @class
    * @classdesc Each instance of this class will be used by the parse to represent a state into the stack */
	var StackItem = (function() {
	    
	    /*
        * Creates an instance of a Parser 
        *
        * @constructor
        * @param {Object} options.state The current state
        * @param {Object} options.currentValue The result of getting this stack Item
        * @param {Symbol} options.symbol The Current Symbol of the stack item
        * @param {Automata} options.AST The underprocessing AST. The Sub-tree AST for the current node
        */
	    var stackItem = function(options) {
	    	this.options = options;

            k.utils.obj.defineProperty(this, 'state');
            k.utils.obj.defineProperty(this, 'currentValue');
            k.utils.obj.defineProperty(this, 'symbol');
            k.utils.obj.defineProperty(this, 'AST');
            
            if (!this.state) {
                throw new Error('Invalid initialization values for a Parser, please provide a GOTO Table');
            }
	    };
	    
	    return stackItem;
	})();
	
	k.data = k.utils.obj.extend(k.data || {}, {
        StackItem: StackItem
	});
	
	return k;
});
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
        * @param {Object} options.state (Require) The current state
        * @param {Object} options.currentValue The Optional result of getting this stack Item. This property is used by the grammar creator to make on-going processing of the being build AST.
        * @param {Symbol} options.stringValue In case that this stack item is created by a TERMINAL reduction or shift, the associated string that generate the stack item creation is attached.
        * @param {Symbol} options.symbol The Optional Current Symbol of the stack item
        * @param {Automata} options.AST Optional underprocessing AST. The Sub-tree AST for the current node
        */
	    var stackItem = function(options) {
	    	this.options = options;

            k.utils.obj.defineProperty(this, 'state');
            k.utils.obj.defineProperty(this, 'currentValue');
            k.utils.obj.defineProperty(this, 'stringValue');
            k.utils.obj.defineProperty(this, 'symbol');
            k.utils.obj.defineProperty(this, 'AST');
            
            if (!this.state) {
                throw new Error('Invalid initialization values for a Stack Item, please provide a valid state');
            }
	    };
	    
	    return stackItem;
	})();
	
	k.data = k.utils.obj.extend(k.data || {}, {
        StackItem: StackItem
	});
	
	return k;
});
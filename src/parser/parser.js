define(['../utils/obj', '../data/stackItem'],  function(k)
{
	'use strict';
	
	/** Parser
	* @class
	* @classdesc Parser engine reponsible for parse an entire string */
	var Parser = (function() {
		
		/*
		* Creates an instance of a Parser 
		*
		* @constructor
		* @param {Object} options.gotoTable The GOTO Table of the current grammar
		* @param {Grammar} options.grammar The grammar used to generate all the parser
		* @param {Function} options.actionTable Action table used to control the parsing process
		*/
		var parser = function(options){

			k.utils.obj.defineProperty(this, 'gotoTable');
			k.utils.obj.defineProperty(this, 'grammar');
			k.utils.obj.defineProperty(this, 'actionTable');
			k.utils.obj.defineProperty(this, 'stack');
			k.utils.obj.defineProperty(this, 'currentInput');
			k.utils.obj.defineProperty(this, 'automata');
			k.utils.obj.defineProperty(this, 'initialState');
			
			if (!this.gotoTable) {
				throw new Error('Invalid initialization values for a Parser, please provide a GOTO Table');
			}
			
			if (!this.actionTable) {
				throw new Error('Invalid initialization values for a Parser, please provide a Action Table');
			}
			
			if (!this.grammar) {
				throw new Error('Invalid initialization values for a Parser, please provide a Grammar');
			}
			
			if (!this.initialState) {
				throw new Error('Invalid initialization values for a Parser, please provide a Initial State');
			}
			
			this.stack = !this.stack ? [] : this.stack;
		};
		
		/* @function Parse an input
		* @param {Lexer} lexer The lexer which will lexically analize the input
		* @returns NOSE!!! */
		parser.prototype.parse = function(lexer) {
			//TODO DO THIS!!!
			var initialStackItem = new k.data.stackItem({
					state: this.initialState
				});
			this.currentInput = lexer.getNext();
			
			this.stack.push(initialStackItem);
			
			return this._parse(lexer);
		};
		
		/* @function Internal Parse an input. This method will loop through input analizyng the Goto and Action tables
		* @param {Lexer} lexer The lexer which will lexically analize the input
		* @returns NOSE!!! */
		parser.prototype._parse = function(lexer) {
			var stateToGo,
				actionToDo,
				reduceFunctionParameters = {},
				lastItem = this.stack[this.stack.length-1];
			
			do {
				//Action
				actionToDo = this.actionTable(lastItem.state, this.currentInput);
				if (actionToDo.action === k.parser.actionTable.SHIFT)
				{
					lastItem.symbol = this.currentInput.terminal;
					this.currentInput = lexer.getNext();
				}
				else if (actionToDo.action === k.parser.actionTable.REDUCE)
				{
					if (actionToDo.rule.tail.length === 1 && actionToDo.rule.tail[0].name === k.data.specialSymbol.EMPTY) {
						//TODO DO THIS
						//Think what to do with empty rules reduction!!!
					} else {
						//TODO Think: It is possible to have rule that have EPSILON/EMPTY in the middle??!
						
						reduceFunctionParameters.values = k.utils.obj(this.stack.slice(-1 * actionToDo.rule.tail.length), function (stackItem) 
						{
							return stackItem.currentValue;	
						});
						reduceFunctionParameters.rule = actionToDo.rule;
						
						//Shrink stack
						this.stack = this.stack.slice(0, -1 * actionToDo.rule.tail.length);
						//Update las stack item
						lastItem = this.stack[this.stack.length-1];
						lastItem.symbol = actionToDo.rule.head;
						lastItem.currentValue = k.utils.obj.isFunction(actionToDo.rule.reduceFunc) ? actionToDo.rule.reduceFunc.call(this, reduceFunctionParameters) : lastItem.symbol;
					}
					//TODO DO
					//Generate AST!
				}
				
				//Goto
				stateToGo = this.gotoTable[lastItem.state][this.lastItem.symbol];
				
				//if (stateToGo !== accept) then return!!!
				//TODO Think: to accept a string, I have to expand the grammar with S' or just in the goto table adding shift the Start symbol => accetp is enough ????
				this.stack.push(new k.data.stackItem({
					state: stateToGo
				}));	
				
				lastItem = this.stack[this.stack.length-1];
				
			} while(true);
		};
		
		return parser;
	})();
	
	k.parser = k.utils.obj.extend(k.parser || {}, {
		Parser: Parser
	});
});
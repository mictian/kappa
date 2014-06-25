define(['../utils/obj', '../data/stackItem', '../lexer/lexer', './automataLR0Generator'],  function (k)
{
	'use strict';
	
	/* Parser
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
		var parser = function(options) {
			this.options = options;

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
			//TODO TEST THIS!!!
			
			var initialStackItem = new k.data.StackItem({
					state: this.initialState
				});
			this.currentInput = lexer.getNext();
			
			this.stack.push(initialStackItem);
			
			return this._parse(lexer);
		};
		
		//TODO SPEcify what this return
		/* @function Internal method to Parse an input. This method will loop through input analizyng the Goto and Action tables
		* @param {Lexer} lexer The lexer which will lexically analize the input
		* @returns NOSE!!! */
		parser.prototype._parse = function(lexer) {
			//TODO TEST THIS
			var stateToGo,
				actionToDo,
				lastItem = this.stack[this.stack.length-1];
			
			do {
				//Action
				actionToDo = this.actionTable(lastItem.state.getIdentity(), this.currentInput.terminal);
				if (actionToDo.action === k.parser.tableAction.SHIFT)
				{
					lastItem.symbol = this.currentInput.terminal;
					lastItem.currentValue = this.currentInput.string;
					this.currentInput = lexer.getNext();
				}
				else if (actionToDo.action === k.parser.tableAction.REDUCE)
				{
					lastItem = this._reduce(actionToDo);
				}
				else if (actionToDo.action === k.parser.tableAction.ACCEPT)
				{
					lastItem = this._reduce(actionToDo);
					return 'VALUE ACEPTED!!!!!';
				}
				
				
				//Goto
				stateToGo = this.gotoTable[lastItem.state.getIdentity()][lastItem.symbol];
				if (!stateToGo)
				{
					return false; //The input string is not valid!
				}
				
				this.stack.push(new k.data.StackItem({
					state: stateToGo
				}));	
				
				lastItem = this.stack[this.stack.length-1];
				
			} while(true);
		};
		
		/* @function Internal method to apply a reduce action.
		* @param {Rule} actionToDo.rule The by which the reduce aciton will take place
		* @returns {Object} The last item in the stack already updated */
		parser.prototype._reduce = function (actionToDo)
		{
			//TODO DO
			//Generate AST!
					
			var reduceFunctionParameters = {},
				lastItem = this.stack[this.stack.length - 1];
				
			if (actionToDo.rule.tail.length === 1 && actionToDo.rule.tail[0].name === k.data.specialSymbol.EMPTY) {
				//TODO DO THIS
				//Think what to do with empty rules reduction!!!
			}
			else
			{
				// Get the last n (rule length) elements of the stack ignoring the last one, which is just there for the previous GoTo Action.
				reduceFunctionParameters.values = k.utils.obj.map(this.stack.slice(-1 * (actionToDo.rule.tail.length + 1), this.stack.length - 1), function (stackItem) 
				{
					return stackItem.currentValue || stackItem.symbol;
				});
				reduceFunctionParameters.rule = actionToDo.rule;
				
				//Shrink stack based on the reduce rule
				this.stack = this.stack.slice(0, -1 * actionToDo.rule.tail.length);
				//Update las stack item
				lastItem = this.stack[this.stack.length - 1];
				lastItem.symbol = actionToDo.rule.head;
				lastItem.currentValue = k.utils.obj.isFunction(actionToDo.rule.reduceFunc) ? actionToDo.rule.reduceFunc.call(this, reduceFunctionParameters) : lastItem.symbol;
			}
			
			return lastItem;
		};
		
		return parser;
	})();
	
	/* Parser Creator
	* @class
	* @classdesc Util class to simplify the process of creating a parser */
	var parserCreator = (function ()
	{
		/*
		* Creates an instance of a Parser  Creator. Generally this is not necessary, owing to this class has all its method statics
		*
		* @constructor
		*/
		var creator =  function()
		{
		};
		
		/* @function Helper method to instanciate a new parser and a lexer
		* @param {Grammar} options.grammar The grammar used to generate the parser
		* @param {String} options.strInput String to be processed
		* @returns {Object} An object with two properties, parser and lexer */
		creator.create = function (options)
		{
			//TODO TEST THIS
			var	automataGenerator = new k.parser.AutomataLR0Generator({
					grammar: options.grammar
				}),
				automata = automataGenerator.generateAutomata(),
				gotoTable = automataGenerator.generateGOTOTable(automata),
				actionTable = automataGenerator.generateACTIONTable(automata),
				lexer = new k.lexer.Lexer({
					grammar: options.grammar,
					stream: options.strInput
				}),
				parser = new k.parser.Parser({
					gotoTable: gotoTable,
					grammar: options.grammar,
					actionTable: actionTable,
					initialState: automata.initialStateAccessor()
				});
				
			return  {
				parser: parser,
				lexer: lexer
			};
		};
		
		return creator;
	})();
	
	k.parser = k.utils.obj.extend(k.parser || {}, {
		Parser: Parser,
		parserCreator: parserCreator
	});
	
	return k;
});
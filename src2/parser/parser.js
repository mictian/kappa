/* Parser
* @class
* @classdesc Parser engine reponsible for parse an entire string */
var Parser = k.parser.Parser = (function() {

	/*
	* Creates an instance of a Parser
	*
	* @constructor
	* @param {Object} options.gotoTable The GOTO Table of the current grammar
	* @param {Grammar} options.grammar The grammar used to generate all the parser
	* @param {Function} options.actionTable Action table used to control the parsing process
	* @param {State} options.initialState Initial state of the automata the describe the current grammar
	*/
	var parser = function (options) {
		this.options = options;

		k.utils.obj.defineProperty(this, 'gotoTable');
		k.utils.obj.defineProperty(this, 'grammar');
		k.utils.obj.defineProperty(this, 'actionTable');
		k.utils.obj.defineProperty(this, 'initialState');

		k.utils.obj.defineProperty(this, 'stack');
		k.utils.obj.defineProperty(this, 'currentInput');

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

		this.stack = this.stack || [];
	};

	/* @function Parse an input
	* @param {Lexer} lexer The lexer which will lexically analize the input
	* @returns {ASTNode|false} The generated AST in case of sucess or false otherwise */
	parser.prototype.parse = function(lexer) {
		//TODO TEST THIS!!!

		var initialStackItem = new k.data.StackItem({
				state: this.initialState
			});
		this.currentInput = lexer.getNext();
		
		if (this.currentInput.ERROR)
		{
			return false;
		}
		this.stack.push(initialStackItem);

		return this._parse(lexer);
	};

	/* @function Internal method to Parse an input. This method will loop through input analizyng the Goto and Action tables
	* @param {Lexer} lexer The lexer which will lexically analize the input
	* @returns {ASTNode|false} The generated AST in case of success or false otherwise */
	parser.prototype._parse = function(lexer) {
		var stateToGo,
			actionToDo,
			lastItem = this.stack[this.stack.length-1];
			
		/*
		Basic Functionality: 
		Create an state, ask for an action todo based on the symbol lookAhead an the current state
			if SHIFT, as we have already created the state we just update our current state
			if ERROR, finish execution
			if REDUCE shrink the stack, apply reduce function and update the stack based on the reduce rule
		When the current state is updated ask for goto action and create the new stack item based on this answer.
		*/

		do {
			//Action
			actionToDo = this.actionTable(lastItem.state.getIdentity(), this.currentInput.terminal);
			
			if (actionToDo.action === k.parser.tableAction.ERROR)
			{
				//TODO Think how to express an error o description or give some details about what happend
				return false;
			} 
			else if (actionToDo.action === k.parser.tableAction.SHIFT)
			{
				lastItem.symbol = this.currentInput.terminal;
				lastItem.currentValue = this.currentInput.string;
				lastItem.stringValue = this.currentInput.string;
				this.currentInput = lexer.getNext();
			}
			else if (actionToDo.action === k.parser.tableAction.REDUCE)
			{
				lastItem = this._reduce(actionToDo);
			}
			else if (actionToDo.action === k.parser.tableAction.ACCEPT)
			{
				lastItem = this._reduce(actionToDo);
				//As we extend the grammar adding a extra rule S' => S #, the last stack item has two children and the first one is the expeted result
				return lastItem.AST.nodes[0];
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
		var reduceFunctionParameters = {},
			newASTNode,
			subASTNodes,
			stackRange,
			rule = actionToDo.rule,
			isEMPTYRule = rule.tail.length === 1 && rule.tail[0].name === k.data.specialSymbol.EMPTY,
			lastItem = this.stack[this.stack.length - 1];
			
		stackRange = isEMPTYRule ? 
						//If the reduce rule is the empty one, there is no values to collect
						[] : 
						// Get the last n (rule length) elements of the stack ignoring the last one, which is just there for the previous GoTo Action.
						this.stack.slice(-1 * (rule.tail.length + 1), this.stack.length - 1);
		reduceFunctionParameters.values = k.utils.obj.map(stackRange, function (stackItem)
		{
			return stackItem.currentValue || stackItem.symbol;
		});
		reduceFunctionParameters.rule = rule;

		//Shrink stack based on the reduce rule
		this.stack = isEMPTYRule ? 
						//Based on the Basic Functionality the last stack item used by the empty rule is already there and no item is require to be removed 
						this.stack :
						this.stack.slice(0, -1 * rule.tail.length);
		//Update last stack item
		lastItem = this.stack[this.stack.length - 1];
		lastItem.symbol = rule.head;
		lastItem.currentValue = k.utils.obj.isFunction(rule.reduceFunc) ? rule.reduceFunc.call(this, reduceFunctionParameters) : lastItem.symbol;
		
		
		// Update/Generate AST
		subASTNodes = k.utils.obj.map(stackRange, function (stackItem)
		{
			return stackItem.AST || stackItem.stringValue;
		});
		
		newASTNode = new k.data.ASTNode({
			nodes: subASTNodes,
			rule: rule,
			symbol: rule.head,
			stringValue: lastItem.stringValue,
			currentValue: lastItem.currentValue
		});
		lastItem.AST = newASTNode;

		return lastItem;
	};

	return parser;
})();


/* Parser Creator
* @class
* @classdesc Util class to simplify the process of creating a parser */
var parserCreator = k.parser.parserCreator = (function () {
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
	* @param {AutomataLRGeneratorBase} options.automataGenerator Optional class used to generate the automata. If not specified LR0 will be used
	* @param {String} options.strInput Optional String to be processed
	* @returns {Object} An object with two properties, parser and lexer */
	creator.create = function (options)
	{
		options = k.utils.obj.extend({}, {
			automataGenerator: k.parser.AutomataLALR1Generator
		}, options || {});
		
		var	grammar = options.grammar,
			automataGenerator = new options.automataGenerator({
				grammar: grammar
			}),
			automata = automataGenerator.generateAutomata({conflictResolvers: k.parser.ConflictResolver.getDefaultResolvers()}),
			gotoTable = automataGenerator.generateGOTOTable(automata),
			actionTable = automataGenerator.generateACTIONTable(automata, {
				conflictResolvers: k.parser.ConflictResolver.getDefaultResolvers(),
				ignoreErrors: false
			}),
			lexer = new k.lexer.Lexer({
				grammar: grammar,
				stream: options.strInput
			}),
			parser = new k.parser.Parser({
				gotoTable: gotoTable,
				grammar: grammar,
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

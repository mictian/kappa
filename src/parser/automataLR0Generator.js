/* Automata Generator
* @class
* @classdesc This class is reponsible for given a grammar create a new LR(0) automata */
k.parser.AutomataLR0Generator = (function(_super) {
	/* jshint latedef:false */
	k.utils.obj.inherit(automataLR0Generator, _super);
	
	/*
	* Initialize a new Automaton Generator
	*
	* @constructor
	* @param {Grammar} options.grammar Grammar used to generate the automata
	*/
	function automataLR0Generator (options)
	{
		_super.apply(this, arguments);
	}
	
	/* @function Override super method to return the list of item rules that has as its head the current symbol, without taking into account the lookAhead
	* @param {ItemRule} currentItem The current item rule from which the new item rule are being generated.
	* @param {Symbol} currentSymbol Is the symbol used to find new item rules.
	* @returns {[ItemRule]} Array of item rule ready to be part of the current processing state */
	automataLR0Generator.prototype._newItemRulesForStateExpansion = function (currentItem, currentSymbol)
	{
		return k.data.ItemRule.newFromRules(this.grammar.getRulesFromNonTerminal(currentSymbol));
	};
	
	/* @function Generate the construction object used to initialize the new automata. Override the super method to indicate that te automata should NOT use lookahead
	* @param {State} initialState State that only contains the items rules from the start symbol of the grammar. This is the initial state before being expanded.
	* @returns {Object} Object containing all the options used to create the new automata */
	automataLR0Generator.prototype._getNewAutomataOptions = function ()
	{
		var result = _super.prototype._getNewAutomataOptions.apply(this, arguments);
		result.hasLookAhead = false;
		
		return result;
	};
	
	/* @function Override super method to return the list of item rules that has as its head the start symbol of the grammar
	* @returns {[ItemRule]} The initial list of item rule. */
	automataLR0Generator.prototype._getInitialStateItemRules = function ()
	{
		return 	[new k.data.ItemRule({
					rule: this.grammar.getRulesFromNonTerminal(this.grammar.startSymbol)[0],
					lookAhead: []
				})];
	};
	
	/* @function Given an automata returnes its ACTION Table. 
	* @param {Automata} automata Automatma used as a base of the calculation
	* @returns {Function} Function that given the a state id and a lookAhead returns the action to take */
	automataLR0Generator.prototype.generateACTIONTable = function (automata)
	{
		var table = {};
		
		k.utils.obj.each(automata.states, function(state)
		{
			var stateItems = state.getItems();
			
			// If it is a REDUCE state
			if (stateItems.length === 1 && stateItems[0].dotLocation === (stateItems[0].rule.tail.length))
			{
				// S'--> S#*
				if (state.isAcceptanceState) {
					 table[state.getIdentity()] = {
						action: k.parser.tableAction.ACCEPT,
						rule: stateItems[0].rule
					};
				}
				else 
				{
					table[state.getIdentity()] = {
						action: k.parser.tableAction.REDUCE,
						rule: stateItems[0].rule
					};
				}
			// SHIFT state
			} else {
				table[state.getIdentity()] = {
					action: k.parser.tableAction.SHIFT
				};
			}
		});
		
		
		return (function (hasLookAhead, actionTable) {
			return function (currentStateId, look_ahead)
			{
				return actionTable[currentStateId] || {
					action: k.parser.tableAction.ERROR
				};
			};
		})(automata.hasLookAhead, table);
	};

	return automataLR0Generator;
})(k.parser.AutomataLRGeneratorBase);

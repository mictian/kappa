/* Automata Generator
* @class
* @classdesc This class is reponsible for given a grammar create a new LR(0) automata */
k.parser.AutomataLALR1Generator = (function(_super)
{
	/* jshint latedef:false */
	k.utils.obj.inherit(automataLALR1Generator, _super);
	
	/*
	* Initialize a new Automaton Generator
	*
	* @constructor
	* @param {Grammar} options.grammar Grammar used to generate the automata
	*/
	function automataLALR1Generator (options)
	{
		_super.apply(this, arguments);
	}
	
	/* @function Override super method to return the list of item rules that has as its head the current symbol, TAKING into account the lookAhead
	* @param {ItemRule} currentItem The current item rule from which the new item rule are being generated.
	* @param {Symbol} currentSymbol Is the symbol used to find new item rules.
	* @returns {[ItemRule]} Array of item rule ready to be part of the current processing state */
	automataLALR1Generator.prototype._newItemRulesForStateExpansion = function (currentItem, currentSymbol)
	{
		var lookAhead = this._getFirstSet(currentItem);
		return k.data.ItemRule.newFromRules(this.grammar.getRulesFromNonTerminal(currentSymbol), lookAhead);
	};
	
	/* @function Override super method to return the object require to indicate that new item rules added into a state should take into account the lookAhead
	* @returns {Object} Object used by State.addItemRules indicating to DO use lookAhead to merge new items */
	automataLALR1Generator.prototype._getExpansionItemNewItemsOptions = function ()
	{
		return {
			hasLookAhead: true
		};
	};
	
	/* @function Gets the array of look-ahead for the particular item rule taking into account the dot location fo the specified item rule.
	* @param {ItemRule} itemRule Item rule to find FIRST Set
	* @returns {[Terminals]} First set for specified look ahead */
	automataLALR1Generator.prototype._getFirstSet = function (itemRule)
	{
		var symbolsToTraverse = itemRule.rule.tail.slice(itemRule.dotLocation + 1),
			requestedFirstSet = [];
			
		symbolsToTraverse = symbolsToTraverse.concat(itemRule.lookAhead);
		
		k.utils.obj.find(symbolsToTraverse, function (symbolTraversed)
		{
			if (symbolTraversed instanceof k.data.NonTerminal)
			{
				requestedFirstSet = requestedFirstSet.concat(this.grammar.firstSetsByHeader[symbolTraversed.name]);
				requestedFirstSet = k.utils.obj.uniq(requestedFirstSet, false, function (item) {return item.name;});
				return !symbolTraversed.isNullable;
			}
			else if (symbolTraversed instanceof k.data.Terminal)
			{
				requestedFirstSet.push(symbolTraversed);
				return true;
			}
			else if (symbolTraversed.isSpecial && symbolTraversed.name === k.data.specialSymbol.EOF)
			{
				requestedFirstSet.push(symbolTraversed);
				return true;
			}
			else 
			{
				throw new Error('Invalid Item Rule. Impossible calculate first set. Item Rule: ' + itemRule.toString());
			}
			
		}, this);
		
		return requestedFirstSet;
	};
	
	/* @function Generate the construction object used to initialize the new automata. Override the super method to indicate that te automata should DO use lookahead
	* @param {State} initialState State that only contains the items rules from the start symbol of the grammar. This is the initial state before being expanded.
	* @returns {Object} Object containing all the options used to create the new automata */
	automataLALR1Generator.prototype._getNewAutomataOptions = function ()
	{
		var result = _super.prototype._getNewAutomataOptions.apply(this, arguments);
		result.hasLookAhead = true;
		
		return result;
	};
	
	/* @function Override super method to return the list of item rules that has as its head the start symbol of the grammar, TAKING into account the lookAhead
	* @returns {[ItemRule]} The initial list of item rule. */
	automataLALR1Generator.prototype._getInitialStateItemRules = function ()
	{
		return [new k.data.ItemRule({
					rule: this.grammar.getRulesFromNonTerminal(this.grammar.startSymbol)[0],
					lookAhead: [new k.data.Symbol({name: k.data.specialSymbol.EOF, isSpecial: true})]
				})];
	};
	
	/* @function Given an automata returnes its ACTION Table. 
	* @param {Automata} automata Automatma used as a base of the calculation
	* @returns {Function} Function that given the a state id and a lookAhead returns the action to take */
	automataLALR1Generator.prototype.generateACTIONTable = function (automata, options)
	{
		var table = {};
		
		k.utils.obj.each(automata.states, function (state)
		{
			table[state.getIdentity()] = {};
			
			if (state.isAcceptanceState)
			{
				table[state.getIdentity()][k.data.specialSymbol.EOF] = {
					action: k.parser.tableAction.ACCEPT,
					rule: state.getOriginalItems()[0].rule //As we augment the grammar in the acceptance state is should be only one rule, the augmented rule, for that reason is the 0
				};
			} 
			else
			{
				var defaultActionTableStateOptions = {
					ignoreErrors: false,
					considerLookAhead: true
				};
				options = k.utils.obj.extendInNew(defaultActionTableStateOptions, options || {});
				
				var stateItems = state.getShiftReduceItemRule(options);
				
				if (!stateItems)
				{
					throw new Error('Impossible to generate Action Table. The following state is invalid. State: ' + state.getIdentity());	
				}
				
				
				//Shift Items
				k.utils.obj.each(stateItems.shiftItems, function (shiftItem)
				{
					table[state.getIdentity()][shiftItem.getCurrentSymbol().name] = {
						action: k.parser.tableAction.SHIFT
					};
				});
				
				//Reduce Items
				//IMPORTANT: At this point the automata MUST be already validated, ensuring us that the lookAhead sets ARE DISJOINT
				k.utils.obj.each(stateItems.reduceItems, function (reduceItemRule)
				{
					k.utils.obj.each(reduceItemRule.lookAhead, function (reduceSymbol)
					{
						table[state.getIdentity()][reduceSymbol.name] = {
							action: k.parser.tableAction.REDUCE,
							rule: reduceItemRule.rule
						};
					});	
				});
			}
		});
		
		
		return (function (hasLookAhead, actionTable) {
			return function (currentStateId, look_ahead)
			{
				return (actionTable[currentStateId] && look_ahead && look_ahead.name && actionTable[currentStateId][look_ahead.name] ) || 
					{
						action: k.parser.tableAction.ERROR
					};
				
			};
		})(automata.hasLookAhead, table);
	};

	return automataLALR1Generator;
})(k.parser.AutomataLRGeneratorBase);

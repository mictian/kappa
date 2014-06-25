define(['../utils/obj', '../data/grammar', '../data/itemRule', '../data/automata'], function(k)
{
	'use strict';
	
	/*Enum for valid action in an action table
	* @readonly
	* @enum {String}
	*/
	var tableAction = {
		SHIFT: 'SHIFT',
		REDUCE: 'REDUCE',
		ERROR: 'ERROR',
		ACCEPT: 'ACCEPT'
	};

	/* Automata Generator
	* @class
	* @classdesc This class is reponsible for given a grammar create a new LR(0) automata */
	var AutomataLR0Generator = (function()
	{
		/*
		* Initialize a new Automaton Generator
		*
		* @constructor
		* @param {Grammar} options.grammar Grammar used to generate the automata
		*/
		var automataGenerator = function (options) {
			this.options = options;
			
			k.utils.obj.defineProperty(this, 'grammar');

			if (!(this.grammar instanceof k.data.Grammar))
			{
				throw new Error('In order to create a new Automata LR(0) Generator please provide a grammar!');
			}
		};

		/* @function Expands a state adding in it the full list of require items (item rules)
		* @param {State} currentState State that will be expanded
		* @returns The full state with all its require items */
		automataGenerator.prototype.expandItem = function (currentState)
		{
			// The inital rule is first added and then this method is called
			var currentSymbol,
				currentItem = currentState.getNextItem();

			while (currentItem) {
				currentSymbol = currentItem.getCurrentSymbol();

				if (currentSymbol instanceof k.data.NonTerminal) {
					currentState.addItems(k.data.ItemRule.newFromRules(this.grammar.getRulesFromNonTerminal(currentSymbol)));
				}

				currentItem = currentState.getNextItem();
			}

			return currentState;
		};

		/* @function Generate the LALR(1) automata
		* @returns {Automata} The corresponding automata for the specified grammar */
		automataGenerator.prototype.generateAutomata = function()
		{
			//TODO TEST THIS
			var automata = this._generateAutomata();
			
			if (automata.isValid())
			{
				return automata;
			}
			
			automata.hasLookAhead = true;
			//WTF :S Think here :P
			
			return automata;
		};
		
		/* @function Generate the LR(0) automata
		* @returns {Automata} The corresponding automata for the specified grammar */
		automataGenerator.prototype._generateAutomata = function()
		{
			var initialState = new k.data.State({
					items: k.data.ItemRule.newFromRules(this.grammar.getRulesFromNonTerminal(this.grammar.startSymbol))
				}),
				automata = new k.data.Automata({
				  states: [this.expandItem(initialState)]
				});

			automata.initialStateAccessor(initialState);
			this._expandAutomata(automata);
			return automata;
		};

		/** @function Internal method which resive an inital automata with only it inital state and generate a full automata
		* @param {Automata} automata Automatma to be expanded
		* @returns {Automata} A full automata */
		automataGenerator.prototype._expandAutomata = function(automata) {
			var currentState = automata.getNextState();
			
			while (currentState) {

				//Get all valid symbol from which the current state can have transitions
				var supportedTransitions = currentState.getSupportedTransitionSymbols(),
					addedState, //To control duplicated states
					newItemRules = [];

				// For each supported transicion from the current state, explore neighbours states 
				//Warning remove to create function inside this loop
				/*jshint -W083 */
				k.utils.obj.each(supportedTransitions, function (supportedTransition)
				{
					// for the current new neighbour of the current state, generate the basic state with the known items
					k.utils.obj.each(supportedTransition.items, function (supportedItem)
					{
						// Because each item in the supported transition does NOT move the dot location when retrieved from the state, we MUST do that here
						newItemRules.push(supportedItem.clone({
							dotLocationIncrement: 1,
							dontCloneRule: true
						}));
					});

					var newState = new k.data.State({
						items: newItemRules
					});

					this.expandItem(newState);
					// Add state controlling duplicated ones
					addedState = automata.addState(newState);

					// We determien if the new state is an acceptance state, if it has only the augmented rule in reduce state.    
					addedState.isAcceptanceState = !!(addedState.getItems().length === 1 && addedState.getItems()[0].rule.name === k.data.Grammar.constants.AugmentedRuleName && addedState.getItems()[0].dotLocation === 2);
					currentState.addTransition(supportedTransition.symbol, addedState);

					newItemRules = [];
				}, this);

				currentState = automata.getNextState();
			}
		};
		
		/* @function Given an automata returnes its GOTO Table. The table is represented by an object where each state is a property (row) and each possible symbol is a property of the previous object (column)
		* Sample: table[<state>][<symbol>] = [undefined = error|<state id - string>]
		* @param {Automata} automata Automatma used as a base of the calculation
		* @returns {Object} A GOTO Table */
		automataGenerator.prototype.generateGOTOTable = function(automata) {
			//TODO TEST THIS
			//TODO Think how to represent the acceptance state!!
			var table = {
					toString: function ()
					{
						var str = '',
							self = this,
							that;
							
						k.utils.obj.each(k.utils.obj.keys(this), function (stateId)
						{
							if (k.utils.obj.isObject(self[stateId]))
							{
								that = self[stateId];
								str += '\n' + stateId;
								k.utils.obj.each(k.utils.obj.keys(self[stateId]), function (symbol)
								{
									str += '\n      --> (' + symbol + ') = ' + that[symbol]; 
								});
							}
						});
						return str;
					}
				};
			
			k.utils.obj.each(automata.states, function (state) {
				table[state.getIdentity()] = {};
				
				k.utils.obj.each(state.transitions, function (transition) {
					table[state.getIdentity()][transition.symbol.toString()] = transition.state;
				});
			});
			
			return table;
		};
		
		/* @function Given an automata returnes its ACTION Table. 
		* @param {Automata} automata Automatma used as a base of the calculation
		* @returns {Function} Function that given the a state id and a lookAhead returns the action to take */
		automataGenerator.prototype.generateACTIONTable = function (automata) {
			//TODO TEST THIS
			var table = {};
			
			if (!automata.hasLookAhead)
			{
				k.utils.obj.each(automata.states, function(state){
					var stateItems = state.getItems();
					
					// If it is a reduce state
					if (stateItems.length === 1 && stateItems[0].dotLocation === (stateItems[0].rule.tail.length))
					{
						// S'--> S#*
						if (state.isAcceptanceState) {
							 table[state.getIdentity()] = {
								action: tableAction.ACCEPT,
								rule: stateItems[0].rule
							};
						}
						else 
						{
							table[state.getIdentity()] = {
								action: tableAction.REDUCE,
								rule: stateItems[0].rule
							};
						}
					} else {
						table[state.getIdentity()] = {
							action: tableAction.SHIFT
						};
					}
				});
			}
			else
			{
				//TODO DO THIS
			}
			
			return (function (hasLookAhead, actionTable) {
				return function (currentStateId, look_ahead)
				{
					if (!hasLookAhead)
					{
						return actionTable[currentStateId];
					}
					
					//TODO DO THIS
					
				};
			})(automata.hasLookAhead, table);
		};

		return automataGenerator;
	})();

	k.parser = k.utils.obj.extend(k.parser || {}, {
		AutomataLR0Generator: AutomataLR0Generator,
		tableAction: tableAction
	});

	return k;
});
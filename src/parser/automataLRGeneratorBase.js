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

	/* Abstract Base Automata Generator
	* @class
	* @classdesc This is the base class for all LR automatas generator. The idea is simplify the autamata creation process */
	var AutomataLRGeneratorBase = (function()
	{
		/*
		* Initialize a new Automaton Generator
		*
		* @constructor
		* @param {Grammar} options.grammar Grammar used to generate the automata
		*/
		var automataLRGeneratorBase = function (options)
		{
			this.options = options;
			
			k.utils.obj.defineProperty(this, 'grammar');

			if (!(this.grammar instanceof k.data.Grammar))
			{
				throw new Error('In order to create a new Automata Generator please provide a grammar!');
			}
		};

		/* @function Expands a state adding in it the full list of require items (item rules)
		* @param {State} currentState State that will be expanded
		* @returns {State} The full state with all its require items */
		automataLRGeneratorBase.prototype.expandItem = function (currentState)
		{
			// The inital rule is first added and then this method is called
			var currentSymbol,
				currentItem = currentState.getNextItem();

			while (currentItem) {
				currentSymbol = currentItem.getCurrentSymbol();

				if (currentSymbol instanceof k.data.NonTerminal)
				{
					currentState.addItems(this._newItemRulesForStateExpansion(currentItem, currentSymbol));
				}

				currentItem = currentState.getNextItem();
			}

			return currentState;
		};
		
		/* @function When expanding an state, depending on the kind of automata that is being created (LR1/LALR1/LR0/etc), the way that is genrerated the list
		* of new item rule to add to the current being processed state.
		* This method is intended to be overwritten!.
		* @param {ItemRule} currentItem The current item rule from which the new item rule are being generated.
		* @param {Symbol} currentSymbol Is the symbol used to find new item rules.
		* @returns {[ItemRule]} Array of item rule ready to be part of the current processing state */
		automataLRGeneratorBase.prototype._newItemRulesForStateExpansion = function (currentItem, currentSymbol)
		{};

		/* @function Generate the requested automata
		* This method allows that son clases override it and have already almost all the implementation done in the method _generateAutomata()
		* @param {Boolean} options.notValidate Indicate if the resulting automata should be validated for the current lookAhead or not. False by default (DO validate the automata).
		* @returns {Automata} The corresponding automata for the specified grammar */
		automataLRGeneratorBase.prototype.generateAutomata = function(options)
		{
			var defaultAutomataCreationOptions = {
					notValidate: false
				};
			options = k.utils.obj.extendInNew(defaultAutomataCreationOptions, options || {});
			
			var automata = this._generateAutomata();
			
			if (!options.notValidate && !automata.isValid())
			{
				return false;
			}
			
			return automata;
		};
		
		/* @function Actually Generate an automata
		* @returns {Automata} The corresponding automata for the specified grammar */
		automataLRGeneratorBase.prototype._generateAutomata = function()
		{
			var initialState = new k.data.State({
					items: this._getInitialStateItemRules()
				}),
				automata = new k.data.Automata(this._getNewAutomataOptions(initialState));

			automata.initialStateAccessor(initialState);
			this._expandAutomata(automata);
			return automata;
		};
		
		/* @function Generate the construction object used to initialize the new automata
		* @param {State} initialState State that only contains the items rules from the start symbol of the grammar. This is the initial state before being expanded.
		* @returns {Object} Object containing all the options used to create the new automata */
		automataLRGeneratorBase.prototype._getNewAutomataOptions = function (initialState)
		{
			return {
					states: [this.expandItem(initialState)]
				};
		};
		
		/* @function Returns the initial list of item rules that will take part in the initial state of the automata. This can differ if the automata has or not lookahead
		* @returns {[ItemRule]} The initial list of item rule. */
		automataLRGeneratorBase.prototype._getInitialStateItemRules = function ()
		{};

		/* @function Internal method which resive an inital automata with only it inital state and generate a full automata
		* @param {Automata} automata Automatma to be expanded
		* @returns {Automata} A full automata */
		automataLRGeneratorBase.prototype._expandAutomata = function(automata)
		{
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
							dotLocationIncrement: 1
						}));
					});

					var newState = new k.data.State({
						items: newItemRules
					});

					this.expandItem(newState);
					
					// We determien if the new state is an acceptance state, if it has only the augmented rule in reduce state.    
					newState.isAcceptanceState = !!(newState.getOriginalItems().length === 1 && newState.getOriginalItems()[0].rule.name === k.data.Grammar.constants.AugmentedRuleName && newState.getOriginalItems()[0].dotLocation === 2);

					// Add state controlling duplicated ones
					addedState = automata.addState(newState);
					
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
		automataLRGeneratorBase.prototype.generateGOTOTable = function(automata)
		{
			var table = {};
			
			k.utils.obj.each(automata.states, function (state)
			{
				table[state.getIdentity()] = {};
				
				k.utils.obj.each(state.transitions, function (transition) {
					table[state.getIdentity()][transition.symbol.toString()] = transition.state;
				});
			});
			
			return table;
		};
		
		/* @function Given an automata returnes its ACTION Table. 
		* The intend of this method is to be overwriten by each son class
		* @param {Automata} automata Automatma used as a base of the calculation
		* @returns {Function} Function that given the a state id and a lookAhead returns the action to take */
		automataLRGeneratorBase.prototype.generateACTIONTable = function (automata)
		{};

		return automataLRGeneratorBase;
	})();

	k.parser = k.utils.obj.extend(k.parser || {}, {
		AutomataLRGeneratorBase: AutomataLRGeneratorBase,
		tableAction: tableAction
	});

	return k;
});
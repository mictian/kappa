define(['../utils/obj', '../data/grammar', '../data/itemRule', '../data/automata'], function(k)
{
	'use strict';

    /* Automata Generator
    * @class
    * @classdesc This class is reponsible for given a grammar create a new LR(0) automata */
	var AutomataLR0Generator = (function()
	{
        /*
        * Initialize a new Automaton Generator
        *
        * @constructor
        * @param {nonTerminal} options.grammar Grammar used to generate the automata
        */
        var automataGenerator = function (options) {
            this.options = options;
            this.grammar = options.grammar;
        };

        /** @function Expands a state adding in it the full list of require items (item rules)
        * @param {State} currentState State that will be expanded
        * @returns The full state with all its require items */
        automataGenerator.prototype.expandItem = function(currentState)
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

        /** @function Generate the LR(0) automata
        * @returns The corresponding automata for the specified grammar */
        automataGenerator.prototype.generateAutomata = function()
        {
            var initialState = new k.data.State({
                    items: k.data.ItemRule.newFromRules(this.grammar.getRulesFromNonTerminal(this.grammar.startSymbol))
                }),
                automata = new k.data.Automata({
                  states: [this.expandItem(initialState)]
                });

            this._expandAutomata(automata);
            return automata;
        };

        /** @function Internal method which resive an inital automata with only it inital state and generate a full automata
        * @returns A full automata */
        automataGenerator.prototype._expandAutomata = function(automata) {
            var currentState = automata.getNextState();

            while (currentState) {

                //Get all valid symbol from which the state can have transitions
                var supportedTransitions = currentState.getSupportedTransitionSymbols(),
                    currentItemRules,
                    addedState, //To control duplicated states
                    newItemRules = [];

                for (var t = 0; t < supportedTransitions.length; t++) {
                    currentItemRules = supportedTransitions[t].items;
                    for (var i = 0; i < currentItemRules.length; i++)
                    {
                        newItemRules.push(currentItemRules[i].clone({
                            dotLocationIncrement: 1
                        }));
                    }
                    var newState = new k.data.State({
                        items: newItemRules
                    });

                    this.expandItem(newState);
                    addedState = automata.addState(newState);
                    currentState.addTransition(supportedTransitions[t].symbol, addedState);

                    newItemRules = [];
                }

                currentState = automata.getNextState();
            }
        };

        return automataGenerator;
	})();

	k.parser = k.utils.obj.extend(k.parser || {}, {
        AutomataLR0Generator: AutomataLR0Generator
	});

	return k;
});
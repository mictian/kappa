define(['../data/grammar', '../data/itemRule'], function(k)
{
	'use strict';

	function expandItem(grammar, currentState)
	{
        // Se agrega la relga inicial y luego se llama a este method!
        var currentSymbol,
            currentItem = currentState.getNextItem();

        while (currentItem) {
            currentSymbol = currentItem.getCurrentSymbol();

            if (currentSymbol instanceof k.data.NonTerminal)
                currentState.addItems(k.data.ItemRule.newFromRules(grammar.getRulesFromNonTerminal(currentSymbol)));

            currentItem = currentState.getNextItem();
        }

        return currentState;
	}

    k.expandItem = expandItem;

	return k;
});
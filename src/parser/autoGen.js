define(['../data/grammar', '../data/itemRule'], function(k)
{
	'use strict';

	function expandItem(grammar, currentState)
	{
        // Se agrega la relga inicial y luego se llama a este method!
        var currrentSymbol,
            currentItem = currentState.getNextItem();

        while (currentItem) {
            currrentSymbol = currentItem.getCurrentSymbol();

            if (currrentSymbol instanceof k.data.NonTerminal)
                currentState.addItems(k.data.ItemRule.newFromRules(grammar.getRulesFromNonTerminal(currrentSymbol)));

            currentItem = currentState.getNextItem();
        }

        return currentState;
	}

    k.expandItem = expandItem;

	return k;
});
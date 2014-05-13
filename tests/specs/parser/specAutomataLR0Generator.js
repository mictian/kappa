/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/parser/automataLR0Generator', '../aux/sampleGrammars'], function(k, sampleGrammars)
{
	'use strict';

	describe('Automata LR(0) Generator', function ()
	{
		describe('constructor', function()
		{
			it('requires an options parameter', function()
			{
				expect(function() { return new k.parser.AutomataLR0Generator(); }).toThrow();
			});

			it('requires an options parameter with a grammar in it', function()
			{
				expect(function() { return new k.parser.AutomataLR0Generator({}); }).toThrow();
			});

			it('should save the passed in options', function()
			{
				var options = {
						grammar: sampleGrammars.idsList.g
					},
					ag = new k.parser.AutomataLR0Generator(options);

				expect(ag.options).toBe(options);
			});
		});

		describe('expandItem', function()
		{
			function getItemByRuleName(items, ruleName)
			{
				for (var i = 0; i < items.length; i++)
				{
					if (items[i].rule.options.name === ruleName)
					{
						return items[i];
					}
				}
			}

			it('shoud return the full state for the grammar id list rule S', function()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.idsList.g
					}),
					initialState = new k.data.State({
						items: k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.startSymbol))
					});

				var state = ag.expandItem(initialState),
					itemsState = state.getItems();

				expect(itemsState.length).toBe(2);

debugger;
				var ruleS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
				expect(ruleS).toBeDefined();

				// var ruleS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule inside the sampleGrammar file
				// expect(ruleS).toBeDefined();

			});
		});

		xdescribe('generateAutomata', function()
		{

		});
	});
});
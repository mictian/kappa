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

				var itemS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
				expect(itemS).toBeDefined();
				expect(itemS.rule).toEqual(sampleGrammars.idsList.S.clone());

				var itemOparen = getItemByRuleName(itemsState, 'OPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemOparen).toBeDefined();
				expect(itemOparen.rule).toEqual(sampleGrammars.idsList.OPAREN.clone());
			});

			it('shoud return the full state for the grammar id list rule S with dot Location equal 1', function()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.idsList.g
					}),
					items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.startSymbol));

				items[0].dotLocation++;
				var initialState = new k.data.State({
						items: items
					});

				var state = ag.expandItem(initialState),
					itemsState = state.getItems();

				expect(itemsState.length).toBe(3);


				var itemS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
				expect(itemS).toBeDefined();
				expect(itemS.dotLocation).toBe(1);
				expect(itemS.rule).toEqual(sampleGrammars.idsList.S.clone());

				var itemExps1 = getItemByRuleName(itemsState, 'EXPS1RULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemExps1).toBeDefined();
				expect(itemExps1.dotLocation).toBe(0);
				expect(itemExps1.rule).toEqual(sampleGrammars.idsList.EXPS1.clone());

				var itemExps2 = getItemByRuleName(itemsState, 'EXPS2RULE');
				expect(itemExps2).toBeDefined();
				expect(itemExps2.dotLocation).toBe(0);
				expect(itemExps2.rule).toEqual(sampleGrammars.idsList.EXPS2.clone());
			});
		});

		// xdescribe('generateAutomata', function()
		// {

		// });
	});
});
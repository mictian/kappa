/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/parser/automataLR0Generator', '../../../src/data/sampleGrammars'], function(k, sampleGrammars)
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

			it('shoud return the full state for the grammar id list rule S with dot Location equal 2', function()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.idsList.g
					}),
					items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.startSymbol));

				items[0].dotLocation++;
				items[0].dotLocation++;
				var initialState = new k.data.State({
						items: items
					});

				var state = ag.expandItem(initialState),
					itemsState = state.getItems();

				expect(itemsState.length).toBe(2);


				var itemS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
				expect(itemS).toBeDefined();
				expect(itemS.dotLocation).toBe(2);
				expect(itemS.rule).toEqual(sampleGrammars.idsList.S.clone());

				var itemCparent = getItemByRuleName(itemsState, 'CPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemCparent).toBeDefined();
				expect(itemCparent.dotLocation).toBe(0);
				expect(itemCparent.rule).toEqual(sampleGrammars.idsList.CPAREN.clone());
			});

			it('shoud return the full state for the grammar id list rule S with dot Location equal 2', function()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.idsList.g
					}),
					items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(sampleGrammars.idsList.EXPS1.head));

				var initialState = new k.data.State({
						items: items
					});

				var state = ag.expandItem(initialState),
					itemsState = state.getItems();

				expect(itemsState.length).toBe(2);


				var itemExp1 = getItemByRuleName(itemsState, 'EXPS1RULE'); //This name is defined in the rule definition inside the sampleGrammar file
				expect(itemExp1).toBeDefined();
				expect(itemExp1.dotLocation).toBe(0);
				expect(itemExp1.rule).toEqual(sampleGrammars.idsList.EXPS1.clone());

				var itemExp2 = getItemByRuleName(itemsState, 'EXPS2RULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemExp2).toBeDefined();
				expect(itemExp2.dotLocation).toBe(0);
				expect(itemExp2.rule).toEqual(sampleGrammars.idsList.EXPS2.clone());
			});
		});

		describe('generateAutomata', function()
		{
			function findStateById(states, id) {
				var result = null;
				k.utils.obj.each(states, function(state) {
					if (state.getIdentity() === id)
					{
						result = state;
					}
				});
				return result;
			}

			it('should return the correct automata form the simple grammar num divs', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.numDivs.g
					}),
					result = ag.generateAutomata(),
					states = result.states;

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(7);

				var state = findStateById(states, '0-1-2-4');
				expect(state).toBeDefined();
				expect(state.getItems().length).toBe(4);

				state = findStateById(states, '0-1-3');
				expect(state).toBeDefined();
				expect(state.getItems().length).toBe(3);

				state = findStateById(states, '1-4');
				expect(state).toBeDefined();
				expect(state.getItems().length).toBe(2);

				state = findStateById(states, '1');
				expect(state).toBeDefined();
				expect(state.getItems().length).toBe(1);

				state = findStateById(states, '2');
				expect(state).toBeDefined();
				expect(state.getItems().length).toBe(1);

				state = findStateById(states, '4');
				expect(state).toBeDefined();
				expect(state.getItems().length).toBe(1);

				state = findStateById(states, '3');
				expect(state).toBeDefined();
				expect(state.getItems().length).toBe(1);
			});
			
			function validatestate(states, stateId, expectedItemsLength)
			{
				var state = findStateById(states, stateId);
				expect(state).toBeDefined();
				expect(state.getItems().length).toBe(expectedItemsLength);
			}

			it('should return the correct automata form the simple grammar NUM DIFF', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.numDiff.g
					}),
					result = ag.generateAutomata(),
					states = result.states;

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(10);
				
				debugger;
				
				// validatestate(states, '', 4);

				// var state = findStateById(states, '0-1-2-4');
				// expect(state).toBeDefined();
				// expect(state.getItems().length).toBe(4);

				// state = findStateById(states, '0-1-3');
				// expect(state).toBeDefined();
				// expect(state.getItems().length).toBe(3);

				// state = findStateById(states, '1-4');
				// expect(state).toBeDefined();
				// expect(state.getItems().length).toBe(2);

				// state = findStateById(states, '1');
				// expect(state).toBeDefined();
				// expect(state.getItems().length).toBe(1);

				// state = findStateById(states, '2');
				// expect(state).toBeDefined();
				// expect(state.getItems().length).toBe(1);

				// state = findStateById(states, '4');
				// expect(state).toBeDefined();
				// expect(state.getItems().length).toBe(1);

				// state = findStateById(states, '3');
				// expect(state).toBeDefined();
				// expect(state.getItems().length).toBe(1);
			});
		});
	});
});
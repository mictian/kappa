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
				return k.utils.obj.find(items, function(item) {
				    return (item.rule.name === ruleName);
				});
			}
			
			it('should duplicate a rule if the dot location differs', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.aPlusb.g
					}),
					initialState,
					items = k.data.ItemRule.newFromRules([sampleGrammars.aPlusb.A1]),
					state,
					itemsState;
					
				// Convert A --> *'a'A into A --> 'a'*A
				items[0].dotLocation++;
				
				initialState = new k.data.State({
					items: items
				});
					
				state = ag.expandItem(initialState);
				itemsState = state.getItems();
					
				expect(itemsState.length).toBe(3);
				
				var groupedItems = k.utils.obj.groupBy(itemsState, function (itemRule)
				{
					return itemRule.rule.name;
				});
				expect(groupedItems.A1RULE.length).toBe(2);
				expect(groupedItems.A2RULE.length).toBe(1);
			});

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

				expect(itemsState.length).toBe(3);

				var itemS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
				expect(itemS).toBeDefined();
				expect(itemS.rule).toEqual(sampleGrammars.idsList.S.clone());

				var itemOparen = getItemByRuleName(itemsState, 'OPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemOparen).toBeDefined();
				expect(itemOparen.rule).toEqual(sampleGrammars.idsList.OPAREN.clone());
				
				var itemAugment = getItemByRuleName(itemsState, 'AUGMENTRULE'); //This name is defined in all the grammars
				expect(itemAugment).toBeDefined();
			});

			it('shoud return the full state for the grammar id list rule S with dot Location equal 1', function()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.idsList.g
					}),
					items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.specifiedStartSymbol));

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
					items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.specifiedStartSymbol));

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
			function findStateById(states, id)
			{
				return k.utils.obj.find(states, function(state) {
					return state.getIdentity() === id;
				});
			}
			
			function validateState(states, stateId, expectedItemsLength)
			{
				var state = findStateById(states, stateId);
				expect(state).toBeDefined();
				expect(state).not.toBe(null);
				expect(state.getItems().length).toBe(expectedItemsLength);
			}

			it('should return the correct automata form the simple grammar num divs', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.numDivs.g
					}),
					result = ag.generateAutomata(),
					states = result.states;

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(9);
				
				validateState(states, '0(0)1(0)2(0)3(0)5(0)', 5);
				validateState(states, '1(1)2(1)4(0)', 3);
				validateState(states, '2(2)5(0)', 2);
				validateState(states, '2(3)', 1);
				validateState(states, '3(1)', 1);
				validateState(states, '4(1)', 1);
				validateState(states, '5(1)', 1);
				validateState(states, '0(1)', 1);
				validateState(states, 'AcceptanceState', 1);
			});
			
			it('should return the correct automata form the simple grammar NUM DIFF', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.numDiff.g
					}),
					result = ag.generateAutomata(),
					states = result.states;

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(12);
				
				validateState(states, '0(0)1(0)2(0)3(0)4(0)5(0)7(0)', 7);
				validateState(states, '2(0)3(0)4(0)5(1)5(0)7(1)7(0)', 7);
				validateState(states, '2(2)4(0)5(0)7(0)', 4);
				validateState(states, '2(1)5(2)6(0)8(0)', 4);
				validateState(states, '1(1)2(1)6(0)', 3);
				validateState(states, '5(3)8(1)', 2);
				validateState(states, '2(3)', 1);
				validateState(states, '3(1)', 1);
				validateState(states, '4(1)', 1);
				validateState(states, '6(1)', 1);
				validateState(states, '0(1)', 1);
				validateState(states, 'AcceptanceState', 1);
			});
		});
	});
});
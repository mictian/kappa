

/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/parser/automataLR0Generator', '../../../src/data/sampleGrammars'], function(k, sampleGrammars)
{
	'use strict';

	describe('Automata LR(0) Generator', function ()
	{
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

			it('should return the full state for the grammar id list rule S', function()
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
				expect(itemS.rule).toBe(sampleGrammars.idsList.S);

				var itemOparen = getItemByRuleName(itemsState, 'OPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemOparen).toBeDefined();
				expect(itemOparen.rule).toBe(sampleGrammars.idsList.OPAREN);
				
				var itemAugment = getItemByRuleName(itemsState, 'AUGMENTRULE'); //This name is defined in all the grammars
				expect(itemAugment).toBeDefined();
			});

			it('should return the full state for the grammar id list rule S with dot Location equal 1', function()
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
				expect(itemS.rule).toBe(sampleGrammars.idsList.S);

				var itemExps1 = getItemByRuleName(itemsState, 'EXPS1RULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemExps1).toBeDefined();
				expect(itemExps1.dotLocation).toBe(0);
				expect(itemExps1.rule).toBe(sampleGrammars.idsList.EXPS1);

				var itemExps2 = getItemByRuleName(itemsState, 'EXPS2RULE');
				expect(itemExps2).toBeDefined();
				expect(itemExps2.dotLocation).toBe(1);
				expect(itemExps2.rule).toBe(sampleGrammars.idsList.EXPS2);
			});

			it('should return the full state for the grammar id list rule S with dot Location equal 2', function()
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
				expect(itemS.rule).toBe(sampleGrammars.idsList.S);

				var itemCparent = getItemByRuleName(itemsState, 'CPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemCparent).toBeDefined();
				expect(itemCparent.dotLocation).toBe(0);
				expect(itemCparent.rule).toBe(sampleGrammars.idsList.CPAREN);
			});

			it('should return the full state for the grammar id list rule S with dot Location equal 2', function()
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
				expect(itemExp1.rule).toBe(sampleGrammars.idsList.EXPS1);

				var itemExp2 = getItemByRuleName(itemsState, 'EXPS2RULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemExp2).toBeDefined();
				expect(itemExp2.dotLocation).toBe(1);
				expect(itemExp2.rule).toBe(sampleGrammars.idsList.EXPS2);
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
			
			function validateState(states, stateId, expectedItemsLength, lookAhead)
			{
				var state = findStateById(states, stateId);
				expect(state).toBeDefined();
				expect(state).not.toBe(null);
				expect(state.getItems().length).toBe(expectedItemsLength);
				k.utils.obj.each(k.utils.obj.keys(lookAhead), function (itemRuleId)
				{
					 var itemRule = state.getOriginalItemById(itemRuleId);
					 expect(lookAhead[itemRuleId].length).toBe(itemRule.lookAhead.length);
					 
					k.utils.obj.each(lookAhead[itemRuleId], function (expectedLookAhead)
					{
					 	var lookAheadFound = !!k.utils.obj.find(itemRule.lookAhead, function (symbol)
						{
							return symbol.name === expectedLookAhead;
						});
						
						expect(lookAheadFound).toBe(true);
					});
				});
			}

			it('should return the correct automata for the simple grammar num divs', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.numDivs.g
					}),
					result = ag.generateAutomata({notValidate:true}),
					states = result.states;
					
				expect(result.hasLookAhead).toBe(false);

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
			
			it('should return the correct automata for the simple grammar NUM DIFF', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.numDiff.g
					}),
					result = ag.generateAutomata({notValidate:true}),
					states = result.states;
					
				expect(result.hasLookAhead).toBe(false);

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(12);
				
				validateState(states, '0(0)1(0)2(0)3(0)4(0)5(0)6(0)', 7);
				validateState(states, '2(0)3(0)4(0)5(1)5(0)6(1)6(0)', 7);
				validateState(states, '2(2)4(0)5(0)6(0)', 4);
				validateState(states, '2(1)5(2)7(0)8(0)', 4);
				validateState(states, '1(1)2(1)8(0)', 3);
				validateState(states, '5(3)7(1)', 2);
				validateState(states, '2(3)', 1);
				validateState(states, '3(1)', 1);
				validateState(states, '4(1)', 1);
				validateState(states, '8(1)', 1);
				validateState(states, '0(1)', 1);
				validateState(states, 'AcceptanceState', 1);
			});
			
			it('should return the correct automata for the simple grammar A+B', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.aPlusb.g
					}),
					result = ag.generateAutomata({notValidate:true}),
					states = result.states;
					
				expect(result.hasLookAhead).toBe(false);

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(6);
				
				validateState(states, '0(0)1(0)2(0)', 3);
				validateState(states, '1(1)1(0)2(0)', 3);
				validateState(states, '2(1)', 1);
				validateState(states, '0(1)', 1);
				validateState(states, '1(2)', 1);
				validateState(states, 'AcceptanceState',1);
			});
			
			it('should return the correct automata for the simple grammar a^(n+1)b^(n)', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.aPowN1b.g
					}),
					result = ag.generateAutomata({notValidate:true}),
					states = result.states;
					
				expect(result.hasLookAhead).toBe(false);

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(9);
				
				validateState(states, '0(0)1(0)2(0)3(0)', 4);
				validateState(states, '2(1)2(0)3(1)3(0)', 4);
				validateState(states, '2(2)', 1);
				validateState(states, '2(3)', 1);
				validateState(states, '0(1)', 1);
				validateState(states, '4(1)', 1);
				validateState(states, '1(2)', 1);
				validateState(states, '1(1)4(0)', 2);
				
				validateState(states, 'AcceptanceState', 1);
			});
			
			it('should return the correct automata for the simple grammar Condenced num Diff', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.numDiffCondenced.g
					}),
					result = ag.generateAutomata({notValidate:true}),
					states = result.states;
				
				expect(result.hasLookAhead).toBe(false);

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(11);
				
				validateState(states, '0(0)1(0)2(0)3(0)4(0)5(0)', 6);
				validateState(states, '0(1)', 1);
				validateState(states, '1(1)2(1)', 2);
				validateState(states, '3(1)', 1);
				validateState(states, '4(1)', 1);
				validateState(states, '2(0)3(0)4(0)5(1)5(0)', 5);
				validateState(states, '2(2)4(0)5(0)', 3);
				validateState(states, '2(1)5(2)', 2);
				validateState(states, '2(3)', 1);
				validateState(states, '5(3)', 1);
				validateState(states, 'AcceptanceState', 1);
			});
		});
		
		describe('generateACTIONTable', function ()
		{
			it('should return the expected action function for the simple LR0 grammar a+b', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.aPlusb.g
					}),
					automata = ag.generateAutomata({notValidate:true}),
					actionTable = ag.generateACTIONTable(automata);
				
				expect(actionTable).toEqual(jasmine.any(Function));
				
				expect(actionTable('0(1)').action).toEqual(k.parser.tableAction.SHIFT);
				
				expect(actionTable('1(1)1(0)2(0)').action).toEqual(k.parser.tableAction.SHIFT);
				
				expect(actionTable('0(0)1(0)2(0)').action).toEqual(k.parser.tableAction.SHIFT);
				
				expect(actionTable('2(1)').action).toEqual(k.parser.tableAction.REDUCE);
				expect(actionTable('2(1)').rule.name).toEqual(sampleGrammars.aPlusb.A2.name);
				
				expect(actionTable('1(2)').action).toEqual(k.parser.tableAction.REDUCE);
				expect(actionTable('1(2)').rule.name).toEqual(sampleGrammars.aPlusb.A1.name);
				
				expect(actionTable('AcceptanceState').action).toEqual(k.parser.tableAction.ACCEPT);
			});
			
			it('should return the expected action function for the simple LR0 grammar selectedBs', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.selectedBs.g
					}),
					automata = ag.generateAutomata(),
					actionTable = ag.generateACTIONTable(automata);
				
				expect(actionTable).toEqual(jasmine.any(Function));
				
				expect(actionTable('0(0)1(0)2(0)').action).toEqual(k.parser.tableAction.SHIFT);
				
				expect(actionTable('0(1)').action).toEqual(k.parser.tableAction.SHIFT);
				
				expect(actionTable('1(0)2(0)4(2)').action).toEqual(k.parser.tableAction.SHIFT);
				
				expect(actionTable('1(0)2(1)2(0)3(0)4(0)').action).toEqual(k.parser.tableAction.SHIFT);
				
				expect(actionTable('1(1)').action).toEqual(k.parser.tableAction.REDUCE);
				expect(actionTable('1(1)').rule.name).toEqual(sampleGrammars.selectedBs.S1.name);
				
				expect(actionTable('2(2)4(1)').action).toEqual(k.parser.tableAction.SHIFT);
				
				expect(actionTable('2(3)').action).toEqual(k.parser.tableAction.REDUCE);
				expect(actionTable('2(3)').rule.name).toEqual(sampleGrammars.selectedBs.S2.name);
				
				expect(actionTable('3(1)').action).toEqual(k.parser.tableAction.REDUCE);
				expect(actionTable('3(1)').rule.name).toEqual(sampleGrammars.selectedBs.L1.name);
				
				expect(actionTable('4(3)').action).toEqual(k.parser.tableAction.REDUCE);
				expect(actionTable('4(3)').rule.name).toEqual(sampleGrammars.selectedBs.L2.name);
				
				expect(actionTable('AcceptanceState').action).toEqual(k.parser.tableAction.ACCEPT);
				
				expect(actionTable('0(1)1(0)2(0)').action).toEqual(k.parser.tableAction.ERROR);
				expect(actionTable('0(4)').action).toEqual(k.parser.tableAction.ERROR);
				expect(actionTable('1(2)2(0)').action).toEqual(k.parser.tableAction.ERROR);
				expect(actionTable('5(0)').action).toEqual(k.parser.tableAction.ERROR);
				expect(actionTable('2(0)4(4)').action).toEqual(k.parser.tableAction.ERROR);
			});
			
		});
	});
});
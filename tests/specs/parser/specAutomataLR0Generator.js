/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/parser/automataLR0Generator', '../../../src/data/sampleGrammars'], function(k, sampleGrammars)
{
	'use strict';

	describe('Automata LALR(1) Generator', function ()
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
				expect(itemS.rule).toBe(sampleGrammars.idsList.S);

				var itemOparen = getItemByRuleName(itemsState, 'OPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemOparen).toBeDefined();
				expect(itemOparen.rule).toBe(sampleGrammars.idsList.OPAREN);
				
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
				expect(itemS.rule).toBe(sampleGrammars.idsList.S);

				var itemCparent = getItemByRuleName(itemsState, 'CPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
				expect(itemCparent).toBeDefined();
				expect(itemCparent.dotLocation).toBe(0);
				expect(itemCparent.rule).toBe(sampleGrammars.idsList.CPAREN);
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
					result = ag.generateAutomata(),
					states = result.states;
					
				expect(result.hasLookAhead).toBe(true);

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(9);
				
				validateState(states, '0(0)1(0)2(0)3(0)5(0)', 5,
				{
					'0(0)':['EOF'],
					'1(0)':['EOF'],
					'2(0)':['EOF','DIV'],
					'3(0)':['EOF','DIV'],
					'5(0)':['EOF']
				});
				validateState(states, '1(1)2(1)4(0)', 3,
				{
					'1(1)':['EOF'],
					'2(1)':['EOF', 'DIV'],
					'4(0)':['NUMBER']
				});
				validateState(states, '2(2)5(0)', 2,
				{
					'2(2)':['EOF', 'DIV'],
					'5(0)':['EOF']
				});
				validateState(states, '2(3)', 1,
				{
					'2(3)':['EOF', 'DIV']
				});
				validateState(states, '3(1)', 1,
				{
					'3(1)':['EOF','DIV']
				});
				validateState(states, '4(1)', 1,
				{
					'4(1)':['NUMBER']
				});
				validateState(states, '5(1)', 1,
				{
					'5(1)':['EOF']
				});
				validateState(states, '0(1)', 1,
				{
					'0(1)':['EOF']
				});
				validateState(states, 'AcceptanceState', 1,
				{
					'0(2)':['EOF']
				});
			});
			
			it('should return the correct automata for the simple grammar NUM DIFF', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.numDiff.g
					}),
					result = ag.generateAutomata(),
					states = result.states;
					
				expect(result.hasLookAhead).toBe(true);

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(12);
				
				validateState(states, '0(0)1(0)2(0)3(0)4(0)5(0)7(0)', 7,
				{
					'0(0)':['EOF'],
					'1(0)':['EOF'],
					'2(0)':['EOF','DIFF'],
					'3(0)':['EOF','DIFF'],
					'4(0)':['EOF'],
					'5(0)':['EOF'],
					'7(0)':['NUMBER','OPAREN'],
				});
				validateState(states, '2(0)3(0)4(0)5(1)5(0)7(1)7(0)', 7,
				{
					'2(0)':['CPAREN', 'DIFF'],
					'3(0)':['CPAREN', 'DIFF'],
					'4(0)':['CPAREN'],
					'5(0)':['CPAREN'],
					'5(1)':['CPAREN', 'EOF'],
					'7(1)':['NUMBER', 'OPAREN'],
					'7(0)':['NUMBER', 'OPAREN']
				});
				validateState(states, '2(2)4(0)5(0)7(0)', 4,
				{
					'2(2)':['EOF','DIFF','CPAREN'],
					'4(0)':['EOF','CPAREN'],
					'5(0)':['EOF','CPAREN'],
					'7(0)':['NUMBER','OPAREN']
				});
				validateState(states, '2(1)5(2)6(0)8(0)', 4,
				{
					'2(1)':['CPAREN','DIFF'],
					'5(2)':['EOF'],
					'6(0)':['NUMBER', 'OPAREN'],
					'8(0)':['EOF']
				});
				validateState(states, '1(1)2(1)6(0)', 3,
				{
					'1(1)':['EOF'],
					'2(1)':['EOF', 'DIFF'],
					'6(0)':['NUMBER', 'OPAREN']
				});
				validateState(states, '5(3)8(1)', 2,
				{
					'5(3)':['EOF'],
					'8(1)':['EOF']
				});
				validateState(states, '2(3)', 1,
				{
					'2(3)': ['EOF', 'DIFF']
				});
				validateState(states, '3(1)', 1,
				{
					'3(1)':['EOF', 'DIFF', 'CPAREN']
				});
				validateState(states, '4(1)', 1,
				{
					'4(1)':['EOF','CPAREN']
				});
				validateState(states, '6(1)', 1,
				{
					'6(1)':['NUMBER', 'OPAREN']
				});
				validateState(states, '0(1)', 1,
				{
					'0(1)':['EOF']
				});
				validateState(states, 'AcceptanceState', 1,
				{
					'0(2)':['EOF']
				});
			});
			
			it('should return the correct automata for the simple grammar A+B', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.aPlusb.g
					}),
					result = ag.generateAutomata(),
					states = result.states;

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(6);
				
				validateState(states, '0(0)1(0)2(0)', 3,
				{
					'0(0)':['EOF'],
					'1(0)':['EOF'],
					'2(0)':['EOF']
				});
				validateState(states, '1(1)1(0)2(0)', 3,
				{
					'1(1)':['EOF'],
					'1(0)':['EOF'],
					'2(0)':['EOF']
				});
				validateState(states, '2(1)', 1,
				{
					'2(1)':['EOF']
				});
				validateState(states, '0(1)', 1,
				{
					'0(1)':['EOF']
				});
				validateState(states, '1(2)', 1,
				{
					'1(2)':['EOF']
				});
				validateState(states, 'AcceptanceState', 1,
				{
					'0(2)':['EOF']
				});
			});
			
			it('should return the correct automata for the simple grammar a^(n+1)b^(n)', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.aPowN1b.g
					}),
					result = ag.generateAutomata(),
					states = result.states;

				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(9);
				
				validateState(states, '0(0)1(0)2(0)3(0)', 4,
					{
						'0(0)': ['EOF'],
						'1(0)': ['EOF'],
						'2(0)': ['d_terminal'],
						'3(0)': ['d_terminal']
					});
				validateState(states, '2(1)2(0)3(1)3(0)', 4,
					{
						'2(1)':['d_terminal', 'b_terminal'],
						'3(1)':['d_terminal', 'b_terminal'],
						'2(0)':['b_terminal'],
						'3(0)':['b_terminal'],
					});
				validateState(states, '2(2)', 1,
				{
					'2(2)': ['d_terminal']
				});
				validateState(states, '2(3)', 1,
				{
					'2(3)':['d_terminal']
				});
				validateState(states, '0(1)', 1,
				{
					'0(1)': ['EOF']
				});
				validateState(states, '4(1)', 1,
				{
					'4(1)':['EOF']
				});
				validateState(states, '1(2)', 1,
				{
					'1(2)':['EOF']
				});
				validateState(states, '1(1)4(0)', 2,
				{
					'1(1)':['EOF'],
					'4(0)':['EOF']
				});
				
				validateState(states, 'AcceptanceState', 1,
				{
					'0(2)':['EOF']
				});
			});
			
			it('should return the correct automata for the simple grammar Condenced num Diff', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.numDiffCondenced.g
					}),
					result = ag.generateAutomata(),
					states = result.states;


				expect(result).toBeInstanceOf(k.data.Automata);
				expect(states.length).toBe(11);
				
				validateState(states, '0(0)1(0)2(0)3(0)4(0)5(0)', 6,
				{
					'0(0)':['EOF'],
					'1(0)':['EOF'],
					'2(0)':['EOF', 'DIFF'],
					'3(0)':['EOF', 'DIFF'],
					'4(0)':['EOF'],
					'5(0)':['EOF']
				});
				validateState(states, '0(1)', 1,
				{
					'0(1)': ['EOF']
				});
				validateState(states, '1(1)2(1)', 2,
				{
					'1(1)':['EOF'],
					'2(1)': ['EOF', 'DIFF']
				});
				validateState(states, '3(1)', 1,
				{
					'3(1)': ['EOF', 'DIFF', 'CPAREN']
				});
				validateState(states, '4(1)', 1,
				{
					'4(1)': ['EOF', 'CPAREN']
				});
				validateState(states, '2(0)3(0)4(0)5(1)5(0)', 5,
				{
					'5(1)': ['EOF', 'CPAREN'],
					'2(0)': ['CPAREN', 'DIFF'],
					'3(0)': ['CPAREN', 'DIFF'],
					'4(0)': ['CPAREN'],
					'5(0)': ['CPAREN']
				});
				validateState(states, '2(2)4(0)5(0)', 3,
				{
					'2(2)': ['EOF', 'CPAREN', 'DIFF'],
					'4(0)': ['EOF', 'CPAREN'],
					'5(0)': ['EOF', 'CPAREN']
				});
				validateState(states, '2(1)5(2)', 2,
				{
					'2(1)': ['CPAREN', 'DIFF'],
					'5(2)': ['EOF']
				});
				validateState(states, '2(3)', 1,
				{
					'2(3)': ['EOF', 'DIFF']
				});
				validateState(states, '5(3)', 1,
				{
					'5(3)': ['EOF']
				});
				validateState(states, 'AcceptanceState', 1,
				{
					'0(2)':['EOF']
				});
			});
		});
		
		describe('generateGOTOTable', function ()
		{
			it('should return the expected table for the simple LR0 grammar a+b', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.aPlusb.g
					}),
					automata = ag.generateAutomata(),
					gotoTable = ag.generateGOTOTable(automata);
				
				expect(gotoTable).toEqual(jasmine.any(Object));
				expect(gotoTable['0(1)']).toEqual(jasmine.any(Object));
				
				var keys = k.utils.obj.keys(gotoTable);
				
				expect(keys.length).toBe(7); //6 states plus toString function
				expect(k.utils.obj.indexOf(keys, '0(0)1(0)2(0)') >= 0).toBe(true);
				expect(k.utils.obj.indexOf(keys, '2(1)') >= 0).toBe(true);
				expect(k.utils.obj.indexOf(keys, '1(1)1(0)2(0)') >= 0).toBe(true);
				expect(k.utils.obj.indexOf(keys, '1(2)') >= 0).toBe(true);
				expect(k.utils.obj.indexOf(keys, '0(1)') >= 0).toBe(true);
				expect(k.utils.obj.indexOf(keys, 'AcceptanceState') >= 0).toBe(true);
			});
			
			//TODO ADD AT LEAST 2 MORE LR(0) GRAMMARS!
		});
		
		describe('generateACTIONTable', function ()
		{
			it('should return the expected action function for the simple LR0 grammar a+b', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.aPlusb.g
					}),
					automata = ag.generateAutomata(),
					actionTable = ag.generateACTIONTable(automata);
				
				expect(actionTable).toEqual(jasmine.any(Function));
			
				expect(actionTable('0(0)1(0)2(0)', {name:'A_LET'})).toEqual({action: k.parser.tableAction.SHIFT});
				
				expect(actionTable('0(0)1(0)2(0)', {name:''})).toEqual({action: k.parser.tableAction.ERROR});
				expect(actionTable('0(0)1(0)2(0)', {name:'fake_value'})).toEqual({action: k.parser.tableAction.ERROR});
				expect(actionTable('0(0)1(0)2(0)', {name:'_A_LET'})).toEqual({action: k.parser.tableAction.ERROR});
				
				expect(actionTable('1(1)1(0)2(0)', {name:'A_LET'})).toEqual({action: k.parser.tableAction.SHIFT});
				expect(actionTable('1(1)1(0)2(0)', {name:'A_LET'})).toEqual({action: k.parser.tableAction.SHIFT});
				
				expect(actionTable('0(1)', {name:'EOF'})).toEqual({action: k.parser.tableAction.SHIFT});
				
				expect(actionTable('2(1)', {name:'EOF'}).action).toEqual(k.parser.tableAction.REDUCE);
				expect(actionTable('2(1)', {name:'EOF'}).rule.name).toEqual(sampleGrammars.aPlusb.A2.name);
				
				expect(actionTable('2(1)', {name:'A_LET'}).action).toEqual(k.parser.tableAction.ERROR);
				
				expect(actionTable('1(2)', {name:'EOF'}).action).toEqual(k.parser.tableAction.REDUCE);
				expect(actionTable('1(2)', {name:'EOF'}).rule.name).toEqual(sampleGrammars.aPlusb.A1.name);
				
				expect(actionTable('AcceptanceState', {name:'EOF'}).action).toEqual('ACCEPT');
			});
			
			//This should be valid for a LR0 automata 
			xit('should return the expected action function for the simple LR0 grammar a+b', function ()
			{
				var ag = new k.parser.AutomataLR0Generator({
						grammar: sampleGrammars.aPlusb.g
					}),
					automata = ag.generateAutomata(),
					actionTable = ag.generateACTIONTable(automata);
				
				expect(actionTable).toEqual(jasmine.any(Function));
				
				expect(actionTable('0(1)')).toEqual({action: k.parser.tableAction.SHIFT});
				
				expect(actionTable('1(1)1(0)2(0)')).toEqual({action: k.parser.tableAction.SHIFT});
				
				expect(actionTable('0(0)1(0)2(0)')).toEqual({action: k.parser.tableAction.SHIFT});
				
				expect(actionTable('2(1)').action).toEqual(k.parser.tableAction.REDUCE);
				expect(actionTable('2(1)').rule.name).toEqual(sampleGrammars.aPlusb.A2.name);
				
				expect(actionTable('1(2)').action).toEqual(k.parser.tableAction.REDUCE);
				expect(actionTable('1(2)').rule.name).toEqual(sampleGrammars.aPlusb.A1.name);
				
				expect(actionTable('AcceptanceState').action).toEqual('ACCEPT');
			});
			
			//TODO ADD AT LEAST 2 MORE LR(0) GRAMMARS SAMPLES!
		});
	});
});
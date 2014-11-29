/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true, k:true, sampleGrammars: ture */
'use strict';

describe('Automata LALR(1) Generator', function ()
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
			var ag = new k.parser.AutomataLALR1Generator({
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
			var ag = new k.parser.AutomataLALR1Generator({
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
			var ag = new k.parser.AutomataLALR1Generator({
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
			var ag = new k.parser.AutomataLALR1Generator({
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
			var ag = new k.parser.AutomataLALR1Generator({
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

		it('should propagate all lookAhead when the rule that generate the lookAhead come last', function ()
		{
			var sourceElements_NT = new k.data.NonTerminal({name: 'sourceElements'}),
				sourceElement_NT = new k.data.NonTerminal({name: 'sourceElement'}),
				statement_NT = new k.data.NonTerminal({name: 'statement'}),
				block_NT = new k.data.NonTerminal({name: 'block'}),

				LBRACE = new k.data.Terminal({name:'lbrace_terminal', body: '{'}),
				RBRACE = new k.data.Terminal({name:'rbrace_terminal', body: '}'});

			var program = new k.data.Rule({
					head: 'program',
					tail: [sourceElements_NT],
					name: 'program-sourceElements'
				}),
				/*sourceElements : sourceElement
							| sourceElements sourceElement  */
				sourceElements_sourceElement = new k.data.Rule({
					head: sourceElements_NT.name,
					tail: [sourceElement_NT],
					name: 'sourceElements-sourceElement'
				}),

				sourceElements_sourceElements_sourceElement = new k.data.Rule({
					head: sourceElements_NT.name,
					tail: [sourceElements_NT, sourceElement_NT],
					name: 'sourceElements-sourceElements-sourceElement'
				}),
				/*sourceElement: statement */
				sourceElement_statement = new k.data.Rule({
					head: sourceElement_NT.name,
					tail: [statement_NT],
					name: 'sourceElement-statement'
				}),
				statement_block = new k.data.Rule({
					head: statement_NT.name,
					tail: [block_NT],
					name: 'statement-block'
				}),
				block_empty = new k.data.Rule({
					head: block_NT.name,
					tail: [LBRACE, RBRACE],
					name: 'block-empty'
				}),

				rules = [
					program,
					sourceElements_sourceElement,
					sourceElements_sourceElements_sourceElement,
					sourceElement_statement,
					statement_block,
					block_empty
				],

				grammar = new k.data.Grammar({
					startSymbol: program.head,
					rules: rules,
					name:'js'
				});

			var ag = new k.parser.AutomataLALR1Generator({
					grammar: grammar
				}),
				items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(program.head));

			var initialState = new k.data.State({
					items: items
				});

			var state = ag.expandItem(initialState),
				itemsState = state.getItems();

			expect(itemsState.length).toBe(6);


			var itemProgram = getItemByRuleName(itemsState, 'program-sourceElements');
			expect(itemProgram).toBeDefined();
			expect(itemProgram.dotLocation).toBe(0);
			expect(itemProgram.rule).toBe(program);
			expect(itemProgram.lookAhead.length).toBe(0);

			var itemSES_SE = getItemByRuleName(itemsState, 'sourceElements-sourceElement');
			expect(itemSES_SE).toBeDefined();
			expect(itemSES_SE.dotLocation).toBe(0);
			expect(itemSES_SE.rule).toBe(sourceElements_sourceElement);
			expect(itemSES_SE.lookAhead.length).toBe(1);
			expect(itemSES_SE.lookAhead[0]).toBe(LBRACE);


			var itemSES_SES_SE = getItemByRuleName(itemsState, 'sourceElements-sourceElements-sourceElement');
			expect(itemSES_SES_SE).toBeDefined();
			expect(itemSES_SES_SE.dotLocation).toBe(0);
			expect(itemSES_SES_SE.rule).toBe(sourceElements_sourceElements_sourceElement);
			expect(itemSES_SES_SE.lookAhead.length).toBe(1);
			expect(itemSES_SES_SE.lookAhead[0]).toBe(LBRACE);

			var itemSE_ST = getItemByRuleName(itemsState, 'sourceElement-statement');
			expect(itemSE_ST).toBeDefined();
			expect(itemSE_ST.dotLocation).toBe(0);
			expect(itemSE_ST.rule).toBe(sourceElement_statement);
			expect(itemSE_ST.lookAhead.length).toBe(1);
			expect(itemSE_ST.lookAhead[0]).toBe(LBRACE);

			var itemST_BL = getItemByRuleName(itemsState, 'statement-block');
			expect(itemST_BL).toBeDefined();
			expect(itemST_BL.dotLocation).toBe(0);
			expect(itemST_BL.rule).toBe(statement_block);
			expect(itemST_BL.lookAhead.length).toBe(1);
			expect(itemST_BL.lookAhead[0]).toBe(LBRACE);

			var itemBL = getItemByRuleName(itemsState, 'block-empty');
			expect(itemBL).toBeDefined();
			expect(itemBL.dotLocation).toBe(0);
			expect(itemBL.rule).toBe(block_empty);
			expect(itemBL.lookAhead.length).toBe(1);
			expect(itemBL.lookAhead[0]).toBe(LBRACE);
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
			var ag = new k.parser.AutomataLALR1Generator({
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
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.numDiff.g
				}),
				result = ag.generateAutomata({notValidate:true}),
				states = result.states;

			expect(result.hasLookAhead).toBe(true);

			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(12);

			validateState(states, '0(0)1(0)2(0)3(0)4(0)5(0)6(0)', 7,
			{
				'0(0)':['EOF'],
				'1(0)':['EOF'],
				'2(0)':['EOF','DIFF'],
				'3(0)':['EOF','DIFF'],
				'4(0)':['EOF'],
				'5(0)':['EOF'],
				'6(0)':['NUMBER','OPAREN'],
			});
			validateState(states, '2(0)3(0)4(0)5(1)5(0)6(1)6(0)', 7,
			{
				'2(0)':['CPAREN', 'DIFF'],
				'3(0)':['CPAREN', 'DIFF'],
				'4(0)':['CPAREN'],
				'5(0)':['CPAREN'],
				'5(1)':['CPAREN', 'EOF'],
				'6(1)':['NUMBER', 'OPAREN'],
				'6(0)':['NUMBER', 'OPAREN']
			});
			validateState(states, '2(2)4(0)5(0)6(0)', 4,
			{
				'2(2)':['EOF','DIFF','CPAREN'],
				'4(0)':['EOF','CPAREN'],
				'5(0)':['EOF','CPAREN'],
				'6(0)':['NUMBER','OPAREN']
			});

			validateState(states, '2(1)5(2)7(0)8(0)', 4,
			{
				'2(1)':['CPAREN','DIFF'],
				'5(2)':['EOF', 'CPAREN'],
				'8(0)':['NUMBER', 'OPAREN'],
				'7(0)':['EOF']
			});
			validateState(states, '1(1)2(1)8(0)', 3,
			{
				'1(1)':['EOF'],
				'2(1)':['EOF', 'DIFF'],
				'8(0)':['NUMBER', 'OPAREN']
			});
			validateState(states, '5(3)7(1)', 2,
			{
				'5(3)':['EOF', 'CPAREN'],
				'7(1)':['EOF']
			});
			validateState(states, '2(3)', 1,
			{
				'2(3)': ['EOF', 'DIFF', 'CPAREN']
			});
			validateState(states, '3(1)', 1,
			{
				'3(1)':['EOF', 'DIFF', 'CPAREN']
			});
			validateState(states, '4(1)', 1,
			{
				'4(1)':['EOF','CPAREN']
			});
			validateState(states, '8(1)', 1,
			{
				'8(1)':['NUMBER', 'OPAREN']
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
			var ag = new k.parser.AutomataLALR1Generator({
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
			var ag = new k.parser.AutomataLALR1Generator({
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
				'2(2)': ['d_terminal', 'b_terminal']
			});
			validateState(states, '2(3)', 1,
			{
				'2(3)':['d_terminal', 'b_terminal']
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
			var ag = new k.parser.AutomataLALR1Generator({
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
				'5(2)': ['EOF', 'CPAREN']
			});
			validateState(states, '2(3)', 1,
			{
				'2(3)': ['EOF', 'DIFF', 'CPAREN']
			});
			validateState(states, '5(3)', 1,
			{
				'5(3)': ['EOF', 'CPAREN']
			});
			validateState(states, 'AcceptanceState', 1,
			{
				'0(2)':['EOF']
			});
		});
	});

	describe('generateACTIONTable', function ()
	{
		it('should return the expected action function for the simple LR0 grammar a+b', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
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

		it('should return the expected action function (table) for the simple LR1 grammar num Diff Condenced', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.numDiffCondenced.g
				}),
				automata = ag.generateAutomata(),
				actionTable = ag.generateACTIONTable(automata);

			expect(actionTable).toEqual(jasmine.any(Function));

			expect(actionTable('0(0)1(0)2(0)3(0)4(0)5(0)', {name:'NUMBER'}).action).toEqual(k.parser.tableAction.SHIFT);
			expect(actionTable('0(0)1(0)2(0)3(0)4(0)5(0)', {name:'OPAREN'}).action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('0(0)1(0)2(0)3(0)4(0)5(0)', {name:'CPAREN'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('0(0)1(0)2(0)3(0)4(0)5(0)', {name:'EOF'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('0(0)1(0)2(0)3(0)4(0)5(0)', {name:'DIFF'}).action).toEqual(k.parser.tableAction.ERROR);


			expect(actionTable('0(1)', {name:'EOF'}).action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('0(1)', {name:'CPAREN'}).action).toEqual( k.parser.tableAction.ERROR);
			expect(actionTable('0(1)', {name:'OPAREN'}).action).toEqual( k.parser.tableAction.ERROR);
			expect(actionTable('0(1)', {name:'DIFF'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('0(1)', {name:'NUMBER'}).action).toEqual(k.parser.tableAction.ERROR);


			expect(actionTable('1(1)2(1)', {name:'DIFF'}).action).toEqual(k.parser.tableAction.SHIFT);
			expect(actionTable('1(1)2(1)', {name:'EOF'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('1(1)2(1)', {name:'EOF'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.S.name);

			expect(actionTable('1(1)2(1)', {name:'OPAREN'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('1(1)2(1)', {name:'CPAREN'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('1(1)2(1)', {name:'NUMBER'}).action).toEqual(k.parser.tableAction.ERROR);


			expect(actionTable('2(0)3(0)4(0)5(1)5(0)', {name:'NUMBER'}).action).toEqual(k.parser.tableAction.SHIFT);
			expect(actionTable('2(0)3(0)4(0)5(1)5(0)', {name:'OPAREN'}).action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('2(0)3(0)4(0)5(1)5(0)', {name:'EOF'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('2(0)3(0)4(0)5(1)5(0)', {name:'DIFF'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('2(0)3(0)4(0)5(1)5(0)', {name:'CPAREN'}).action).toEqual(k.parser.tableAction.ERROR);


			expect(actionTable('2(1)5(2)', {name:'CPAREN'}).action).toEqual(k.parser.tableAction.SHIFT);
			expect(actionTable('2(1)5(2)', {name:'DIFF'}).action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('2(1)5(2)', {name:'EOF'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('2(1)5(2)', {name:'OPAREN'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('2(1)5(2)', {name:'NUMBER'}).action).toEqual(k.parser.tableAction.ERROR);


			expect(actionTable('2(2)4(0)5(0)', {name:'NUMBER'}).action).toEqual(k.parser.tableAction.SHIFT);
			expect(actionTable('2(2)4(0)5(0)', {name:'OPAREN'}).action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('2(2)4(0)5(0)', {name:'CPAREN'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('2(2)4(0)5(0)', {name:'EOF'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('2(2)4(0)5(0)', {name:'DIFF'}).action).toEqual(k.parser.tableAction.ERROR);


			expect(actionTable('2(3)', {name:'DIFF'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('2(3)', {name:'DIFF'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.E1.name);
			expect(actionTable('2(3)', {name:'EOF'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('2(3)', {name:'EOF'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.E1.name);
			expect(actionTable('2(3)', {name:'CPAREN'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('2(3)', {name:'CPAREN'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.E1.name);

			expect(actionTable('2(3)', {name:'OPAREN'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('2(3)', {name:'NUMBER'}).action).toEqual(k.parser.tableAction.ERROR);


			expect(actionTable('3(1)', {name:'CPAREN'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('3(1)', {name:'CPAREN'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.E2.name);
			expect(actionTable('3(1)', {name:'DIFF'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('3(1)', {name:'DIFF'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.E2.name);
			expect(actionTable('3(1)', {name:'EOF'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('3(1)', {name:'EOF'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.E2.name);

			expect(actionTable('3(1)', {name:'NUMBER'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('3(1)', {name:'OPAREN'}).action).toEqual(k.parser.tableAction.ERROR);


			expect(actionTable('4(1)', {name:'CPAREN'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('4(1)', {name:'CPAREN'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.T1.name);
			expect(actionTable('4(1)', {name:'EOF'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('4(1)', {name:'EOF'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.T1.name);

			expect(actionTable('4(1)', {name:'OPAREN'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('4(1)', {name:'DIFF'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('4(1)', {name:'NUM'}).action).toEqual(k.parser.tableAction.ERROR);


			expect(actionTable('5(3)', {name:'EOF'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('5(3)', {name:'EOF'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.T2.name);
			expect(actionTable('5(3)', {name:'CPAREN'}).action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('5(3)', {name:'CPAREN'}).rule.name).toEqual(sampleGrammars.numDiffCondenced.T2.name);

			expect(actionTable('5(3)', {name:'NUM'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('5(3)', {name:'OPAREN'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('5(3)', {name:'DIFF'}).action).toEqual(k.parser.tableAction.ERROR);


			expect(actionTable(k.data.State.constants.AcceptanceStateName, {name:'EOF'}).action).toEqual(k.parser.tableAction.ACCEPT);
			expect(actionTable(k.data.State.constants.AcceptanceStateName, {name:'EOF'}).rule.name).toEqual(k.data.Grammar.constants.AugmentedRuleName);

			expect(actionTable(k.data.State.constants.AcceptanceStateName, {name:'OPAREN'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable(k.data.State.constants.AcceptanceStateName, {name:'CPAREN'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable(k.data.State.constants.AcceptanceStateName, {name:'NUMBER'}).action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable(k.data.State.constants.AcceptanceStateName, {name:'DIFF'}).action).toEqual(k.parser.tableAction.ERROR);
		});

	});

	describe('getShiftReduceItemRuleFromState', function ()
	{
		// //WITH look Ahead and without resolvers
		it('should return false if there are two reduce items with the same lookAhead (without resolvers and NOT ignore errors)', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result).toBe(false);
		});

		it('should return false if there is a shift item in conflict with a reduce items (without resolvers and NOT ignore errors)', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result).toBe(false);
		});

		it('should return an object with two reduce items if there are two reduce items with the same lookAhead (without resolvers and DO USING ignore errors)', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			var result = ag.getShiftReduceItemRuleFromState(state,{considerLookAhead:true});

			expect(result.shiftItems.length).toBe(0);
			expect(result.reduceItems.length).toBe(2);
		});

		it('should return an object with one shift item and one reduce items that are in conflict with using ignore errors (without resolvers)', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: [],
				ignoreErrors: true
			});

			expect(result.shiftItems.length).toBe(1);
			expect(result.reduceItems.length).toBe(1);
		});

		it('should return an object with two reduce items if the state has two reduce items without conflict', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[0]);

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result.shiftItems.length).toBe(0);
			expect(result.reduceItems.length).toBe(2);
			expect(result.reduceItems[0].getIdentity()).toEqual(reduceItem1.getIdentity());
			expect(result.reduceItems[1].getIdentity()).toEqual(reduceItem2.getIdentity());
		});

		it('should return an object with two shift items if the state has two shift item', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
				state = new k.data.State({
					items: [shiftItem1, shiftItem2]
				});

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result.shiftItems.length).toBe(2);
			expect(result.shiftItems[0].getIdentity()).toEqual(shiftItem1.getIdentity());
			expect(result.shiftItems[1].getIdentity()).toEqual(shiftItem2.getIdentity());
			expect(result.reduceItems.length).toBe(0);
		});

		it('should return an object with two shift items and two reduce items in the state has two reduce and two shift item without conflcts', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L2])[0],
				state = new k.data.State({
					items: [shiftItem1, shiftItem2, reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 3;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.L2.tail[1]);

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result.shiftItems.length).toBe(2);
			expect(result.shiftItems[0].getIdentity()).toEqual(shiftItem1.getIdentity());
			expect(result.shiftItems[1].getIdentity()).toEqual(shiftItem2.getIdentity());

			expect(result.reduceItems.length).toBe(2);
			expect(result.reduceItems[0].getIdentity()).toEqual(reduceItem1.getIdentity());
			expect(result.reduceItems[1].getIdentity()).toEqual(reduceItem2.getIdentity());
		});


		//WITH look Ahead and WITH resolvers
		it('should return an object with two reduce item if there are two reduce items in a resolvable conflict', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_REDUCEREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			spyOn(fakeConflictResolver, 'resolve').and.returnValue({
				action: k.parser.tableAction.REDUCE,
				itemRule: reduceItem1
			});

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result.shiftItems.length).toBe(0);
			expect(result.reduceItems.length).toBe(2);
			expect(result.reduceItems[0].getIdentity()).toBe(reduceItem1.getIdentity());
			expect(result.reduceItems[1].getIdentity()).toBe(reduceItem2.getIdentity());
		});

		it('should retrun an object with a shift item and a reduce item if the state has a resolvable shift/reduce conflict', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			spyOn(fakeConflictResolver, 'resolve').and.returnValue({
				action: k.parser.tableAction.SHIFT,
				itemRule: shiftItem
			});

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result.shiftItems.length).toBe(1);
			expect(result.shiftItems[0].getIdentity()).toBe(shiftItem.getIdentity());
			expect(result.reduceItems.length).toBe(1);
			expect(result.reduceItems[0].getIdentity()).toBe(reduceItem.getIdentity());
		});

		it('should return an object with two shift items and two reduce items if the state has resolvable shift/reduce and reduce/reduce conflicts with resolvers', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L2])[0],
				fakeConflictResolverShiftReduce = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake1'}),
				fakeConflictResolverRedcueReduce = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_REDUCEREDUCE, name: 'fake2'}),
				state = new k.data.State({
					items: [shiftItem1, shiftItem2, reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 3;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(shiftItem2.getCurrentSymbol());
			reduceItem2.lookAhead.push(shiftItem2.getCurrentSymbol());

			spyOn(fakeConflictResolverShiftReduce, 'resolve').and.returnValue({
				action: k.parser.tableAction.SHIFT,
				itemRule: shiftItem1
			});

			spyOn(fakeConflictResolverRedcueReduce, 'resolve').and.returnValue({
				action: k.parser.tableAction.REDUCE,
				itemRule: reduceItem1
			});

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolverShiftReduce, fakeConflictResolverRedcueReduce]
			});

			expect(result.shiftItems.length).toBe(2);
			expect(result.shiftItems[0].getIdentity()).toEqual(shiftItem1.getIdentity());
			expect(result.shiftItems[1].getIdentity()).toEqual(shiftItem2.getIdentity());

			expect(result.reduceItems.length).toBe(2);
			expect(result.reduceItems[0].getIdentity()).toEqual(reduceItem1.getIdentity());
			expect(result.reduceItems[1].getIdentity()).toEqual(reduceItem2.getIdentity());
		});

		it('should return reduce items only with the VALID lookAhead symbols after applying all resovlers', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E1])[0],
				shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E1])[0],
				shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E2])[0],
				shiftItem3 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E3])[0],
				shiftItem4 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E4])[0],
				state = new k.data.State({
					items: [reduceItem1, shiftItem1, shiftItem2, shiftItem3, shiftItem4]
				});

			reduceItem1.dotLocation = 3;
			reduceItem1._id = null;

			shiftItem1.dotLocation = 1;
			shiftItem1._id = null;

			shiftItem2.dotLocation = 1;
			shiftItem2._id = null;

			shiftItem3.dotLocation = 1;
			shiftItem3._id = null;

			shiftItem4.dotLocation = 1;
			shiftItem4._id = null;


			reduceItem1.lookAhead = [new k.data.Symbol({name: k.data.specialSymbol.EOF, isSpecial: true}), sampleGrammars.arithmetic.plus_T, sampleGrammars.arithmetic.minus_T,
				sampleGrammars.arithmetic.multi_T, sampleGrammars.arithmetic.div_T];

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: k.parser.ConflictResolver.getDefaultResolvers()
			});

			expect(result.shiftItems.length).toBe(4);

			expect(result.reduceItems.length).toBe(1);

			expect(result.reduceItems[0].lookAhead.length).toBe(3);
			expect(result.reduceItems[0].lookAhead[0].name).toEqual(k.data.specialSymbol.EOF);
			expect(result.reduceItems[0].lookAhead[1].name).toEqual(sampleGrammars.arithmetic.plus_T.name);
			expect(result.reduceItems[0].lookAhead[2].name).toEqual(sampleGrammars.arithmetic.minus_T.name);
		});
	});

	describe('isStateValid', function ()
	{
		it('should return true if the state does not have any reduce item', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				item1 = new k.data.ItemRule(
				{
					rule: {
						index: 1,
						tail:[]
					}
				}),
				item2 = new k.data.ItemRule(
				{
					rule: {
						index: 5,
						tail:[]
					}
				}),
				s = new k.data.State({
					items: [item1, item2]
				});

			spyOn(item1, 'isReduce').and.returnValue(false);
			spyOn(item2, 'isReduce').and.returnValue(false);

			expect(ag.isStateValid(s)).toBe(true);
		});

		it('should return true if the state has just one reduce item without lookAhead', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				item1 = new k.data.ItemRule(
				{
					rule: {
						index: 1,
						tail:[]
					}
				}),
				s = new k.data.State({
					items: [item1]
				});

			spyOn(item1, 'isReduce').and.returnValue(true);

			expect(ag.isStateValid(s)).toBe(true);
		});

		it('should return true if the state has one reduce item and one shift item that does not share anything between them (using lookAhead)', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;

			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(true);

			reduceItem._id = null;
			reduceItem.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);

			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(true);
		});

		it('should return true if the state has two reduce items but with different look-ahead', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(true);
		});

		it('should return true if the state has two reduce rule and one shift rule but their look-ahead is different', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L2])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2, shiftItem]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;

			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[0]);
			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(true);
		});

		it('should return false if the state has two reduce rule with a non disjoin lookAhead set', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			expect(ag.isStateValid(state, {considerLookAhead: true})).toBe(false);
		});

		it('should return false if the state has one reduce rule and one shift rule with the same symbol', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;

			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(true);

			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(false);
		});

		it('should ask for resolver of there is a Shift/Reduce conflict', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			spyOn(fakeConflictResolver, 'resolve');

			ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(fakeConflictResolver.resolve).toHaveBeenCalled();
		});

		it('should return false if there is a Shift/Reduce conflict and there is no resolvers', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result).toBe(false);
		});

		it('should return false if there is a Shift/Reduce conflict and the resolvers cannot resolve the issue', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			spyOn(fakeConflictResolver, 'resolve').and.returnValue(false);

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result).toBe(false);
		});

		it('should return true if there is a Shift/Reduce that can be resolved by the resolvers', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			spyOn(fakeConflictResolver, 'resolve').and.returnValue({
				action: k.parser.tableAction.SHIFT,
				itemRule: shiftItem
			});

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result).toBe(true);
		});

		it('should ask for resolver of there is a Reduce/Reduce conflict', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_REDUCEREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			spyOn(fakeConflictResolver, 'resolve');

			ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(fakeConflictResolver.resolve).toHaveBeenCalled();
		});

		it('should return false if there is a Reduce/Reduce conflict and there is no resolvers', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result).toBe(false);
		});

		it('should return false if there is a Reduce/Reduce conflict and the resolvers cannot resolve the issue', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_REDUCEREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			spyOn(fakeConflictResolver, 'resolve').and.returnValue(false);

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result).toBe(false);
		});

		it('should return true if there is a Reduce/Reduce that can be resolved by the resolvers', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_REDUCEREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			spyOn(fakeConflictResolver, 'resolve').and.returnValue({
				action: k.parser.tableAction.REDUCE,
				itemRule: reduceItem1
			});

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result).toBe(true);
		});
	})
});
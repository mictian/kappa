/* global spyOn:true, expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/sampleGrammars', '../../../src/data/state', '../../../src/data/itemRule', '../../../src/utils/str', '../../../src/parser/conflictResolver'],
	function(sampleGrammars, k)
{
    'use strict';

    describe('State', function()
    {
		it('shoud override toString', function()
		{
			var s = new k.data.State({});
			expect(Object.getPrototypeOf(s).hasOwnProperty('toString')).toBe(true);
		});

		describe('constructor', function()
		{
			it('should define a transitions array', function()
			{
				var s =  new k.data.State({});
				expect(s.transitions).toBeDefined();
			});
		});

		describe('getNextItem', function()
		{
			it('shoud return undefined if it has no items', function()
			{
				var s =  new k.data.State({});
				var result = s.getNextItem();

				expect(result).toBeFalsy();
			});

			it('shoud return null if it has processed all items', function()
			{
				var s = new k.data.State({
					items: [new k.data.ItemRule({
						rule: {
							index: 0,
							tail:[]
						}
					})]
				});

				s.getNextItem();
				var result = s.getNextItem();

				expect(result).toBeFalsy();
			});

			it('shoud return an item if it has it', function()
			{
				var expectedResultOptions = {
						rule: {
							index: 0,
							tail:[]
						}
					},
					items = [new k.data.ItemRule(expectedResultOptions)],
					s = new k.data.State({
						items: items
					});

				var result = s.getNextItem();

				expect(result).toBe(items[0]);
			});

			it('shoud never return the same item twise', function()
			{
				var expectedResultOptions = {
						rule: {
							index: 0,
							tail:[]
						}
					},
					items = [new k.data.ItemRule(expectedResultOptions)],
					s = new k.data.State({
						items: items
					});

				var result = s.getNextItem();
				expect(result).toBe(items[0]);

				result = s.getNextItem();
				expect(result).toBeFalsy();
				result = s.getNextItem();
				expect(result).toBeFalsy();
				result = s.getNextItem();
				expect(result).toBeFalsy();
			});
		});

		describe('addItems', function()
		{
			it('should add an item into the state if it is new', function()
			{
				var s = new k.data.State({}),
					item = new k.data.ItemRule({
						rule: {
							index: 0,
							tail:[]
						}
					});

				s.addItems([item]);
				var result = s.getNextItem();

				expect(result).toBe(item);
			});

			it('should not add an item into the state if it is duplicated', function()
			{
				var items = [new k.data.ItemRule({
						rule: {
							index:0,
							tail:[]
						}
					})],
					s = new k.data.State({
						items: items
					}),
					item = new k.data.ItemRule({
							rule: {
								index: 0,
								tail:[]
							}
						});

				s.addItems([item]);
				var result = s.getNextItem();
				expect(result).toEqual(item);

				result = s.getNextItem();
				expect(result).toBeFalsy();
			});

			it('should get available the added item to the getNextItem method', function()
			{
				var s = new k.data.State({}),
					item = new k.data.ItemRule({
							rule: {
								index: 0,
								tail:[]
							}
						});

				s.addItems([item]);
				var result = s.getNextItem();
				expect(result).toBe(item);
			});
		});

		describe('getIdentity', function()
		{
			it('should return null if the state does not have any rule', function()
			{
				var s = new k.data.State({});
				
				expect(k.utils.str.startsWith(s.getIdentity(), 'node_')).toBe(true);
			});

			it('should NOT returns always the same regardless if its item where updated', function()
			{
				var s = new k.data.State({
					items: [new k.data.ItemRule({
							rule: {
								index: 0,
								tail:[]
							}
						}),
						new k.data.ItemRule({
							rule: {
								index: 1,
								tail:[]
							}
						})
					]
				});

				var result = s.getIdentity();
				expect(result).toEqual('0(0)1(0)');

				s.addItems([new k.data.ItemRule({
					rule: {
						index: 2,
						tail:[]
					}
				})]);

				var id2 = s.getIdentity();

				expect(result).not.toBe(id2);
				expect(id2).toEqual('0(0)1(0)2(0)');
			});
		});
		
		describe('getItems', function()
		{
			it('should return empty array if there is no items in the state', function()
			{
				var s = new k.data.State({});

				expect(s.getItems()).toEqual([]);
			});

			it('should return a copy of the state\'s items', function()
			{
				var item = new k.data.ItemRule({rule: sampleGrammars.numDivs.F}),
					s = new k.data.State({
						items: [item]
					});

				var items2 = s.getItems();
				expect(items2.length).toBe(1);
				expect(items2[0]).not.toBe(item);

				items2[0].rule.index = item.rule.index; //The index is NOT copied
				items2[0].getIdentity(); //Calculate id
				expect(items2[0]).toBeInstanceOf(k.data.ItemRule);
				expect(items2[0].getIdentity()).toEqual(item.getIdentity());
			});
		});

		describe('getSupportedTransitionSymbols', function()
		{
			it('should return an empty array if there is not any item', function()
			{
				var s = new k.data.State({});

				expect(s.getSupportedTransitionSymbols()).toEqual([]);
			});

			it('should return an array with the rule specified by the item', function()
			{
				var item = new k.data.ItemRule(
					{
						rule: {
							index: 0,
							tail:[]
						}
					}),
					s = new k.data.State({
						items: [item]
					});
					
				item.getCurrentSymbol = function() {
					return {
						name: 'S'
					};
				};

				var ts = s.getSupportedTransitionSymbols();

				expect(ts.length).toBe(1);
				expect(ts[0].items.length).toBe(1);
				expect(ts[0].symbol).toEqual({
					name: 'S'
				});
				expect(ts[0].items[0]).toBe(item);

			});

			it('should one element of the array per symbol', function()
			{
				var item1 = new k.data.ItemRule({
						rule: {
							index: 0,
							tail:[]
						}
					}),
					item2 = new k.data.ItemRule({
						rule: {
							index: 1,
							tail:[]
						}
					}),
					s = new k.data.State({
						items: [item1, item2]
					});
					
				
				item1.getCurrentSymbol = function() {
					return {
						name: 'S'
					};
				};
				item2.getCurrentSymbol = function() {
					return {
						name: 'H'
					};
				};

				var ts = s.getSupportedTransitionSymbols();

				expect(ts.length).toBe(2);
				expect(ts[0].items.length).toBe(1);
				expect(ts[0].symbol).toEqual({
					name: 'S'
				});
				expect(ts[0].items[0]).toBe(item1);

				expect(ts[1].items.length).toBe(1);
				expect(ts[1].symbol).toEqual({
					name: 'H'
				});
				expect(ts[1].items[0]).toBe(item2);
			});

			it('should group the items per symbol', function()
			{
				var item1 = new k.data.ItemRule({
						rule: {
							index: 0,
							tail:[]
						}
					}),
					item2 = new k.data.ItemRule({
						rule: {
							index: 1,
							tail:[]
						}
					}),
					item3 = new k.data.ItemRule({
						rule: {
							index: 1,
							tail:[]
						}
					}),
					s = new k.data.State({
						items: [item1, item2, item3]
					});
					
				item1.getCurrentSymbol = function() {
					return {
						name: 'S'
					};
				};
				item2.getCurrentSymbol = function() {
					return {
						name: 'H'
					};
				};
				item3.getCurrentSymbol = function() {
					return {
						name: 'H'
					};
				};

				var ts = s.getSupportedTransitionSymbols();

				expect(ts.length).toBe(2);
				expect(ts[0].items.length).toBe(1);
				expect(ts[0].symbol).toEqual({
					name: 'S'
				});
				expect(ts[0].items[0]).toBe(item1);

				expect(ts[1].items.length).toBe(2);
				expect(ts[1].symbol).toEqual({
					name: 'H'
				});
				expect(ts[1].items[0]).toBe(item2);
				expect(ts[1].items[1]).toBe(item3);
			});
		});

		describe('addTransition', function()
		{
			it('should add the specified transaction into the transactions list as an object', function()
			{
				var s = new k.data.State({}),
					symbol = 'S',
					state = 'state';

				expect(s.transitions.length).toBe(0);

				s.addTransition(symbol, state);
				expect(s.transitions.length).toBe(1);
				expect(s.transitions[0].symbol).toBe('S');
				expect(s.transitions[0].state).toBe('state');
			});
		});

		describe('getCondencedString', function ()
		{
			it('should return 1-5 when having only two rules with that indexes', function ()
			{
				var items = [
					new k.data.ItemRule(
					{
						rule: {
							index: 1,
							tail:[]
						}
					}),
					new k.data.ItemRule(
					{
						rule: {
							index: 5,
							tail:[]
						}
					})
					],
					s = new k.data.State({
						items: items
					});
					
				expect(s.getCondencedString()).toEqual('1-5');
			});
			
			it('should return 0-15 when having only two rules with that indexes in inverse order', function ()
			{
				var items = [
					new k.data.ItemRule(
					{
						rule: {
							index: 15,
							tail:[]
						}
					}),
					new k.data.ItemRule(
					{
						rule: {
							index: 0,
							tail:[]
						}
					})
					],
					s = new k.data.State({
						items: items
					});
					
				expect(s.getCondencedString()).toEqual('0-15');
			});
			
			it('should calculate the result only once', function ()
			{
				var items = [
					new k.data.ItemRule(
					{
						rule: {
							index: 15,
							tail:[]
						}
					}),
					new k.data.ItemRule(
					{
						rule: {
							index: 0,
							tail:[]
						}
					})
					],
					s = new k.data.State({
						items: items
					});
					
				expect(s.getCondencedString()).toEqual('0-15');
				
				items[1].rule.index = 33;
				
				expect(s.getCondencedString()).toEqual('0-15');
			});
		});
		
		describe('isValid', function ()
		{
			it('should return true if the state does not have any reduce item', function()
			{
				var item1 = new k.data.ItemRule(
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
					
				expect(s.isValid()).toBe(true);
			});
			
			it('should return true if the state has just one reduce item', function()
			{
				var item1 = new k.data.ItemRule(
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
					
				expect(s.isValid()).toBe(true);
			});
			
			it('should return false if it has two reduce items without look-ahead', function()
			{
				var item1 = new k.data.ItemRule(
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
				
				spyOn(item1, 'isReduce').and.returnValue(true);
				spyOn(item2, 'isReduce').and.returnValue(true);
				
				expect(s.isValid()).toBe(false);
			});
			
			it('should return false if it has one reduce item and one shift item without look-ahead', function()
			{
				var item1 = new k.data.ItemRule(
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
				spyOn(item2, 'isReduce').and.returnValue(true);
					
				expect(s.isValid()).toBe(false);
			});
			
			it('should return true if the state has one reduce item, one shift item that does not share anything between them (using lookAhead)', function()
			{
				var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					state = new k.data.State({
						items: [reduceItem, shiftItem]
					});
					
				reduceItem.dotLocation = 1;
				
				expect(state.isValid({considerLookAhead:true})).toBe(true);
				
				reduceItem._id = null;
				reduceItem.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
				
				expect(state.isValid({considerLookAhead:true})).toBe(true);
			});
			
			it('should return true if the state has two reduce items but with different look-ahead', function()
			{
				var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				expect(state.isValid({considerLookAhead:true})).toBe(true);
			});
			
			it('should return true if the state has two reduce rule and one shift rule but their look-ahead is different', function()
			{
				var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				expect(state.isValid({considerLookAhead:true})).toBe(true);
			});
			
			it('should return false if the state has two reduce rule with a non disjoin lookAhead set', function()
			{
				var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				expect(state.isValid({considerLookAhead: true})).toBe(false);
			});
			
			it('should return false if the state has one reduce rule and one shift rule with the same symbol', function()
			{
				var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					state = new k.data.State({
						items: [reduceItem, shiftItem]
					});
					
				reduceItem.dotLocation = 1;
				
				expect(state.isValid({considerLookAhead:true})).toBe(true);
				
				reduceItem._id = null;
				reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());
				
				expect(state.isValid({considerLookAhead:true})).toBe(false);
			});
			
			it('should ask for resolver of there is a Shift/Reduce conflict', function()
			{
				var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake'}),
					state = new k.data.State({
						items: [reduceItem, shiftItem]
					});
					
				reduceItem.dotLocation = 1;
				reduceItem._id = null;
				reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());
				
				spyOn(fakeConflictResolver, 'resolve');
				
				state.isValid({
					considerLookAhead: true,
					conflictResolvers: [fakeConflictResolver]
				});
				
				expect(fakeConflictResolver.resolve).toHaveBeenCalled();
			});
			
			it('should return false if there is a Shift/Reduce conflict and there is no resolvers', function()
			{
				var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					state = new k.data.State({
						items: [reduceItem, shiftItem]
					});
					
				reduceItem.dotLocation = 1;
				reduceItem._id = null;
				reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());
				
				var result = state.isValid({
					considerLookAhead: true,
					conflictResolvers: []
				});
				
				expect(result).toBe(false);
			});
			
			it('should return false if there is a Shift/Reduce conflict and the resolvers cannot resolve the issue', function()
			{
			    var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake'}),
					state = new k.data.State({
						items: [reduceItem, shiftItem]
					});
					
				reduceItem.dotLocation = 1;
				reduceItem._id = null;
				reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());
				
				spyOn(fakeConflictResolver, 'resolve').and.returnValue(false);
				
				var result = state.isValid({
					considerLookAhead: true,
					conflictResolvers: [fakeConflictResolver]
				});
				
				expect(result).toBe(false);
			});
			
			it('should return true if there is a Shift/Reduce that can be resolved by the resolvers', function()
			{
				var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.isValid({
					considerLookAhead: true,
					conflictResolvers: [fakeConflictResolver]
				});
				
				expect(result).toBe(true);
			});
			
			it('should ask for resolver of there is a Reduce/Reduce conflict', function()
			{
				var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				state.isValid({
					considerLookAhead: true,
					conflictResolvers: [fakeConflictResolver]
				});
				
				expect(fakeConflictResolver.resolve).toHaveBeenCalled();
			});
			
			it('should return false if there is a Reduce/Reduce conflict and there is no resolvers', function()
			{
			    var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.isValid({
					considerLookAhead: true,
					conflictResolvers: []
				});
				
				expect(result).toBe(false);
			});
			
			it('should return false if there is a Reduce/Reduce conflict and the resolvers cannot resolve the issue', function()
			{
			    var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.isValid({
					considerLookAhead: true,
					conflictResolvers: [fakeConflictResolver]
				});
				
				expect(result).toBe(false);
			});
			
			it('should return true if there is a Reduce/Reduce that can be resolved by the resolvers', function()
			{
				var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.isValid({
					considerLookAhead: true,
					conflictResolvers: [fakeConflictResolver]
				});
				
				expect(result).toBe(true);
			});
		});
		
		describe('getShiftReduceItemRule', function ()
		{
			//NO look Ahead (without resolvers)
			it('should return an object with two shift items if the state only has two shift items (without lookAhead)', function ()
			{
				var shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
					state = new k.data.State({
						items: [shiftItem1, shiftItem2]
					});
					
				var result = state.getShiftReduceItemRule();
				
				expect(result.shiftItems.length).toBe(2);
				expect(result.shiftItems[0].getIdentity()).toEqual(shiftItem1.getIdentity());
				expect(result.shiftItems[1].getIdentity()).toEqual(shiftItem2.getIdentity());
				expect(result.reduceItems.length).toBe(0);
			});
			
			it('should return an object with one shift item if the state only has one shift item (without lookAhead)', function ()
			{
				var shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
					state = new k.data.State({
						items: [shiftItem1]
					});
					
				var result = state.getShiftReduceItemRule();
				
				expect(result.shiftItems.length).toBe(1);
				expect(result.shiftItems[0].getIdentity()).toEqual(shiftItem1.getIdentity());
				expect(result.reduceItems.length).toBe(0);
			});
			
			it('should return false if there is a reduce and a shift item (without lookAhead)', function ()
			{
				var	shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
					reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					state = new k.data.State({
						items: [shiftItem1, reduceItem]
					});
					
				reduceItem.dotLocation = 1;
					
				var result = state.getShiftReduceItemRule();
				
				expect(result).toBe(false);
			});
			
			it('should return false if there are two reduce items without lookAhead', function ()
			{
				var	reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					state = new k.data.State({
						items: [reduceItem1, reduceItem2]
					});
					
				reduceItem1.dotLocation = 1;
				reduceItem2.dotLocation = 3;
					
				var result = state.getShiftReduceItemRule();
				
				expect(result).toBe(false);
			});
			
			it('should return an object with one reduce item if the state only has one reduce item (whith out lookAhead)', function ()
			{
				var	reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					state = new k.data.State({
						items: [reduceItem1]
					});
					
				reduceItem1.dotLocation = 1;
					
				var result = state.getShiftReduceItemRule();
				
				expect(result.reduceItems.length).toBe(1);
				expect(result.reduceItems[0].getIdentity()).toBe(reduceItem1.getIdentity());
				expect(result.shiftItems.length).toBe(0);
			});
			
			
			// //WITH look Ahead and without resolvers
			it('should return false if there are two reduce items with the same lookAhead (without resolvers and NOT ignore errors)', function ()
			{
				var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.getShiftReduceItemRule({
					considerLookAhead: true,
					conflictResolvers: []
				});
				
				expect(result).toBe(false);
			});
			
			it('should return false if there is a shift item in conflict with a reduce items (without resolvers and NOT ignore errors)', function ()
			{
				var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					state = new k.data.State({
						items: [reduceItem, shiftItem]
					});
					
				reduceItem.dotLocation = 1;
				reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());
				
				var result = state.getShiftReduceItemRule({
					considerLookAhead: true,
					conflictResolvers: []
				});
				
				expect(result).toBe(false);
			});
			
			it('should return an object with two reduce items if there are two reduce items with the same lookAhead (without resolvers and DO USING ignore errors)', function ()
			{
				var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.getShiftReduceItemRule({considerLookAhead:true});
				
				expect(result.shiftItems.length).toBe(0);
				expect(result.reduceItems.length).toBe(2);
			});
			
			it('should return an object with one shift item and one reduce items that are in conflict with using ignore errors (without resolvers)', function ()
			{
				var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					state = new k.data.State({
						items: [reduceItem, shiftItem]
					});
					
				reduceItem.dotLocation = 1;
				reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());
				
				var result = state.getShiftReduceItemRule({
					considerLookAhead: true,
					conflictResolvers: [],
					ignoreErrors: true
				});
				
				expect(result.shiftItems.length).toBe(1);
				expect(result.reduceItems.length).toBe(1);
			});
			
			it('should return an object with two reduce items if the state has two reduce items without conflict', function ()
			{
				var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.getShiftReduceItemRule({
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
				var shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
					state = new k.data.State({
						items: [shiftItem1, shiftItem2]
					});
					
				var result = state.getShiftReduceItemRule({
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
				var shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.getShiftReduceItemRule({
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
			
			
			// //WITH look Ahead and WITH resolvers
			it('should return an object with two reduce item if there are two reduce items in a resolvable conflict', function ()
			{
				var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.getShiftReduceItemRule({
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
				var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.getShiftReduceItemRule({
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
				var shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
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
				
				var result = state.getShiftReduceItemRule({
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
				var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E1])[0],
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
				
				
				reduceItem1.lookAhead= [new k.data.Symbol({name: k.data.specialSymbol.EOF, isSpecial: true}), sampleGrammars.arithmetic.plus_T, sampleGrammars.arithmetic.minus_T, 
					sampleGrammars.arithmetic.multi_T, sampleGrammars.arithmetic.div_T];
				
				var result = state.getShiftReduceItemRule({
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
		
		describe('getOriginalItems', function ()
		{
			it('should return an empty array if there are no item', function ()
			{
				var s = new k.data.State({});
				
				expect(s.getOriginalItems().length).toBe(0);
			});
			
			it('should return the item added into the state', function ()
			{
				var s = new k.data.State({
					items: k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])
				});
				
				expect(s.getOriginalItems().length).toBe(1);
				
				s.addItems(k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2]));
				
				expect(s.getOriginalItems().length).toBe(2);
			});
			
			it('should return the original items', function ()
			{
				var items = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1]),
					s = new k.data.State({
						items: items
					});
					
				expect(s.getOriginalItems().length).toBe(1);
				expect(s.getOriginalItems()[0]).toBe(items[0]);
			});
		});
		
		describe('getRecudeItems', function ()
		{
			it('should return empty array the state has not reduce item', function ()
			{
				var shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					state = new k.data.State({
						items: [shiftItem]
					});
				
				expect(state.getRecudeItems()).toEqual([]);
			});
			
			it('shoudl return empty id the state has no item rule', function ()
			{
				var state = new k.data.State({});
				
				expect(state.getRecudeItems()).toEqual([]);
			});
			
			it('should have one item if the state has one reduce item', function ()
			{
				var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					state = new k.data.State({
						items: [reduceItem]
					});
					
				reduceItem.dotLocation = 1;
				reduceItem._id = null;
				reduceItem.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
				
				expect(state.getRecudeItems()).toEqual([reduceItem]);
			});
		});
		
		describe('getOriginalItemById', function ()
		{
			it('should return undefined when te item is not present in the state', function()
			{
				var s = new k.data.State({});
				
				expect(s.getOriginalItemById('1(0)')).toBeUndefined();
			});
			
			it('should return the item rule specified when it is present', function()
			{
				var items = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1]),
					s = new k.data.State({
						items: items
					});
					
				expect(s.getOriginalItemById(items[0].getIdentity())).toBe(items[0]);
			});
		});
    });
});
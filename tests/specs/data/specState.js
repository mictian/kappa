/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/sampleGrammars', '../../../src/data/state', '../../../src/data/itemRule'], function(sampleGrammars, k)
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
							index: 0
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
							index: 0
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
							index: 0
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
							index: 0
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
							index:0
						}
					})],
					s = new k.data.State({
						items: items
					}),
					item = new k.data.ItemRule({
							rule: {
								index: 0
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
								index: 0
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
				expect(s.getIdentity()).toBe('');
			});

			it('should NOT returns always the same regardless if its item where updated', function()
			{
				var s = new k.data.State({
					items: [new k.data.ItemRule({
							rule: {
								index: 0
							}
						}),
						new k.data.ItemRule({
							rule: {
								index: 1
							}
						})
					]
				});

				var result = s.getIdentity();
				expect(result).toEqual('0(0)1(0)');

				s.addItems([new k.data.ItemRule({
					rule: {
						index: 2
					}
				})]);

				var id2 = s.getIdentity();

				expect(result).not.toBe(id2);
				expect(id2).toEqual('0(0)1(0)2(0)');
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
							index: 0
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
							index: 0
						}
					}),
					item2 = new k.data.ItemRule({
						rule: {
							index: 1
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
							index: 0
						}
					}),
					item2 = new k.data.ItemRule({
						rule: {
							index: 1
						}
					}),
					item3 = new k.data.ItemRule({
						rule: {
							index: 1
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
				expect(items2[0]).toEqual(item);
				expect(items2[0]).toBeInstanceOf(k.data.ItemRule);
			});
		});

    });
});
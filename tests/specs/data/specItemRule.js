/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/sampleGrammars', '../../../src/data/itemRule'], function(sampleGrammars, k)
{
	'use strict';

	describe('itemRule', function()
	{
		it('shoud override toString', function()
		{
			var i = new k.data.ItemRule({});
			expect(Object.getPrototypeOf(i).hasOwnProperty('toString')).toBe(true);
		});

		describe('constructor', function()
		{
			it('should define a rule property accesor from the passed in options object', function()
			{
				var rule = {
						tail: []
					},
					i = new k.data.ItemRule({
						rule: rule
					});

				expect(i.rule).toBe(rule);

				i = new k.data.ItemRule({});
				expect(i.rule).toBeUndefined();
			});

			it('should define a dot location form options if specified', function()
			{
				var i = new k.data.ItemRule({
					dotLocation: 2
				});

				expect(i.dotLocation).toBe(2);
			});

			it('should define a dot location in 0 if not specified', function()
			{
				var i = new k.data.ItemRule({});

				expect(i.dotLocation).toBe(0);
			});

			it('should save passed in options', function()
			{
				var options = {
						fakeValue: 12,
						name: 'Fake',
						isFake: true
					},
					i = new k.data.ItemRule(options);

				expect(i.options).toBe(options);
			});
			
			it('should set dot location in 1 when the rule is an empty rule', function ()
			{
				var i = new k.data.ItemRule({
					rule: {
						tail: [{
							name: k.data.specialSymbol.EMPTY
						}]
					}
				});

				expect(i.dotLocation).toBe(1);
			});
		});

		describe('clone', function()
		{
			it('should create a new rule without any change if nothing else is specified', function()
			{
				var options = {
						dotLocation: 42,
						name: 'testing',
						rule: {
							index: 0,
							tail: [],
							clone: function ()
							{
								return this;
							}
						}
					},
					i = new k.data.ItemRule(options);
				
				i.getIdentity(); // Calculate internal id

				var clone = i.clone({});
				clone.getIdentity();

				expect(clone.options).toEqual(options);
				expect(clone.options).not.toBe(options);

				expect(clone).toEqual(i);

				clone = i.clone();
				clone.getIdentity();

				expect(clone.options).toEqual(options);
				expect(clone.options).not.toBe(options);

				expect(clone).toEqual(i);
			});

			it('should create a new rule with the speicified dot increment when specified', function()
			{
				var i = new k.data.ItemRule({
					dotLocation: 2
				});

				var clone = i.clone({dotLocationIncrement: 40});

				expect(clone.dotLocation).toBe(42);
			});

			it('should ignore invalid options', function()
			{
					var i = new k.data.ItemRule({
					dotLocation: 2
				});

				var clone = i.clone({
					dotLocationIncrement: 40,
					isFake: true,
					hahah: 'hehe'
				});

				expect(clone.dotLocation).toBe(42);
				expect(clone.isFake).toBeUndefined();
				expect(clone.options.isFake).toBeUndefined();
				expect(clone.hahah).toBeUndefined();
				expect(clone.options.hahah).toBeUndefined();
			});
		});

		describe('getCurrentSymbol', function()
		{
			it('should return throw exception if rule not specified', function()
			{
				var i = new k.data.ItemRule({});
				expect(function() { return i.getCurrentSymbol();}).toThrow();
			});

			it('should return null if dot location is greater than the rule\'s tail length', function()
			{
				//tails length is added 1 to support addgin the dot at the beging
				var i = new k.data.ItemRule({
					dotLocation: 1,
					rule: {
						tail: []
					}
				});

				expect(i.getCurrentSymbol()).toBe(null);
			});

			it('should return the symbol in the tails at the dot locations when dot location lower than the tail\'s legnth', function()
			{
				var symbol = {
						name: 'foo'
					},
					i = new k.data.ItemRule({
						rule: {
							tail: [symbol]
						}
					});

				expect(i.getCurrentSymbol()).toBe(symbol);
			});

			it('should return the symbol in the tails at the dot locations when dot location lower than the tail\'s legnth', function()
			{
				var symbol1 = {name:1},
					symbol2 = {name:2},
					symbol3 = {name:3},
					i = new k.data.ItemRule({
						dotLocation: 1,
						rule: {
							tail: [symbol1, symbol2, symbol3]
						}
					});

				expect(i.getCurrentSymbol()).toBe(symbol2);
			});

			it('should return undefined when dot location is negative', function()
			{
				var i = new k.data.ItemRule({
					rule: {
						tail: []
					}
				});
				expect(i.getCurrentSymbol()).toBeUndefined();

				i.dotLocation = -1;
				expect(i.getCurrentSymbol()).toBeUndefined();
			});
		});
		
		describe('isReduce', function ()
		{
			it('should return true when the dot location is at the end of the rule', function()
			{
				var symbol = {
						name: 'foo'
					},
					i = new k.data.ItemRule({
						dotLocation: 1,
						rule: {
							tail: [symbol]
						}
					});

				expect(i.isReduce()).toBe(true);
			});
			
			it ('should return false when the dot location is not at the end of the rule', function()
			{
				var symbol = {
						name: 'foo'
					},
					i = new k.data.ItemRule({
						dotLocation: 1,
						rule: {
							tail: [symbol, symbol]
						}
					});

				expect(i.isReduce()).toBe(false);	
			});
		});

		describe('newFromRules', function()
		{
			it('shoud return an empty array if an empty array is passed in', function()
			{
				var result = k.data.ItemRule.newFromRules([]);

				expect(result).toEqual([]);
			});

			it('shoud for each rule create a new item rule with dot location at 0', function()
			{
				var result = k.data.ItemRule.newFromRules([{tail:[]},{test:true,tail:[]}]);

				expect(result.length).toBe(2);
				expect(result[0].options).toEqual({rule:{tail:[]}, lookAhead:[], dotLocation:0});
				expect(result[0].dotLocation).toBe(0);
				expect(result[1].options).toEqual({rule:{test:true, tail:[]}, lookAhead:[], dotLocation:0});
				expect(result[1].dotLocation).toBe(0);
			});
			
			it('shoud for each rule create a new item rule with the lookAhead specified', function()
			{
				var result = k.data.ItemRule.newFromRules([{tail:[]},{test:true,tail:[]}], [{name:'lookAhead1'}, {name:'lookAhead2'}]);

				expect(result.length).toBe(2);
				expect(result[0].options).toEqual({rule:{tail:[]}, dotLocation:0, lookAhead:[{name:'lookAhead1'}, {name:'lookAhead2'}]});
				result[0].lookAhead.push({test:true});
				expect(result[0].options).toEqual({rule:{tail:[]}, dotLocation:0, lookAhead:[{name:'lookAhead1'}, {name:'lookAhead2'}, {test:true}]});
				expect(result[0].dotLocation).toBe(0);
				expect(result[1].options).toEqual({rule:{test:true, tail:[]}, dotLocation:0,  lookAhead:[{name:'lookAhead1'}, {name:'lookAhead2'}]});
				expect(result[1].dotLocation).toBe(0);
			});
			
			it('should not share the same lookAhead instance', function ()
			{
				var result = k.data.ItemRule.newFromRules([{tail:[]},{test:true,tail:[]}], [{name:'lookAhead1'}, {name:'lookAhead2'}]);
				
				expect(result[0].lookAhead).not.toBe(result[1].lookAhead);
				expect(result[0].lookAhead).toEqual(result[1].lookAhead);
			});
		});
		
		describe('getIdentity', function ()
		{
			it('should return the same string if consulted many times', function ()
			{
				var item = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0];
					
				var result = item.getIdentity();
				
				expect(item.getIdentity()).toEqual(result);
				expect(item.getIdentity()).toEqual(result);
				expect(item.getIdentity()).toEqual(result);
				expect(item.getIdentity()).toEqual(result);
			});
			
			it('should return different stirng for two different item rules', function ()
			{
				var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0];
					
				reduceItem.dotLocation = 1;
				reduceItem._id = null;
				reduceItem.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
				
				expect(reduceItem.getIdentity()).not.toEqual(shiftItem.getIdentity());
			});
		});
	});
});
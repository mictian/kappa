/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/itemRule'], function(k)
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
			it('should define copy rule form options', function()
			{
				var rule = {},
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
		});

		describe('clone', function()
		{
			it('should create a new rule without any change if nothing else is specified', function()
			{
				var options = {
						dotLocation: 42,
						name: 'testing'
					},
					i = new k.data.ItemRule(options);

				var clone = i.clone({});

				expect(clone.options).toEqual(options);
				expect(clone.options).not.toBe(options);

				expect(clone).toEqual(i);

				clone = i.clone();

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
				var symbol = {},
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

		describe('newFromRules', function()
		{
			it('shoud return an empty array if an empty array is passed in', function()
			{
				var result = k.data.ItemRule.newFromRules([]);

				expect(result).toEqual([]);
			});

			it('shoud for each rule create a new item rule with dot location at 0', function()
			{
				var result = k.data.ItemRule.newFromRules([{},{test:true}]);

				expect(result.length).toBe(2);
				expect(result[0].options).toEqual({rule:{}, dotLocation:0});
				expect(result[0].dotLocation).toBe(0)
				expect(result[1].options).toEqual({rule:{test:true}, dotLocation:0});
				expect(result[1].dotLocation).toBe(0)
			});
		});
    });
});
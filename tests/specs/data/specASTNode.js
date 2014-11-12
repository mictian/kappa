/* global expect: true, describe: true, it: true, beforeEach: true, k: true */
'use strict';

describe('AST Node', function()
{
	it('should override toString', function()
	{
		var a = new k.data.ASTNode({});
		expect(Object.getPrototypeOf(a).hasOwnProperty('toString')).toBe(true);
	});

	describe('constructor', function()
	{
		it('should define a rule, stringValue and a symbol properties', function()
		{
			var symbolTest = {},
				ruleTest = {name:'test'},
				a = new k.data.ASTNode({
					stringValue: 'test',
					symbol: symbolTest,
					rule: ruleTest
				});

			expect(a.stringValue).toBe('test');
			expect(a.symbol).toBe(symbolTest);
			expect(a.rule).toBe(ruleTest);
		});

		it('should be a Node', function()
		{
			var a = new k.data.ASTNode({
				states: [{
					getIdentity: function() {return 1; }
				}, {
					getIdentity: function() {return 2; }
				}, {
					getIdentity: function() {return 3; }
				}]
			});

			expect(a).toBeInstanceOf(k.data.Node);
		});
	});
});
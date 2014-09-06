/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/sampleGrammars', '../../../src/data/stackItem'], function(sampleGrammars, k)
{
	'use strict';

	describe('Stack Item', function ()
	{
		describe('Constructor', function()
		{
			it('should require a state property', function ()
			{
				expect(function () { return new k.data.StackItem({});}).toThrow();
			});
			
			it('should accept the params: currentValue, stringValue, symbol and AST', function ()
			{
				var fakeState = {name: 'state'},
					fakeSymbol = {name: 'symbol'},
					fakeCurrentValue = {name: 'currentValue'},
					fakeAST = {name: 'AST'},
					si = new k.data.StackItem({
						state: fakeState,
						currentValue: fakeCurrentValue,
						stringValue: 'StringValue',
						symbol: fakeSymbol,
						AST: fakeAST
					});
					
				expect(si.state).toBe(fakeState);
				expect(si.currentValue).toBe(fakeCurrentValue);
				expect(si.stringValue).toBe('StringValue');
				expect(si.symbol).toBe(fakeSymbol);
				expect(si.AST).toBe(fakeAST);
			});
		});
	});
});
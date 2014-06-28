/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/sampleGrammars', '../../../src/parser/parser'], function(sampleGrammars, k)
{
	'use strict';

	describe('Parser', function ()
	{
		describe('Constructor', function()
		{
			//TODO FINISH THIS
			it('should do FOO', function()
			{
				var p = k.parser.parserCreator.create({
						grammar: sampleGrammars.aPlusb.g,
						strInput: '-HOLA-'
					});
		        
		        // p.lexer.setStream(strInput);
		        var result = p.parser.parse(p.lexer);
		        
		        expect(result).toBe(false);
		        // debugger;
		        
			});
		});
	});
});
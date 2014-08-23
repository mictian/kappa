/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/sampleGrammars', '../../../src/parser/parser'], function(sampleGrammars, k)
{
	'use strict';

	describe('Parser', function ()
	{
		describe('Constructor', function()
		{
		    it('should define an empty stack if it not specified', function()
			{
			    var	parser = new k.parser.Parser({
    					gotoTable: {},
    					grammar: {},
    					actionTable: {},
    					initialState: {},
    				});
    				
    			expect(parser.stack).toEqual(jasmine.any(Array));
			});
			
		});
		
		describe('parse', function ()
		{
			it('should accept the string "aab" for the grammar a+b', function()
			{
				var p = k.parser.parserCreator.create(
				    {
						grammar: sampleGrammars.aPlusb.g,
						strInput: 'aab'
					});
		        
		        var result = p.parser.parse(p.lexer);
		        expect(result).toBeTruthy();
			});
			
			it('should reject the string "aaa" for the grammar a+b', function()
			{
				var p = k.parser.parserCreator.create(
				    {
						grammar: sampleGrammars.aPlusb.g,
						strInput: 'aaa'
					});
		        
		        var result = p.parser.parse(p.lexer);
		        
		        expect(result).toBe(false);
			});
			
			it('should reject the string "" for the grammar a+b', function()
			{
				var p = k.parser.parserCreator.create(
				    {
						grammar: sampleGrammars.aPlusb.g,
						strInput: ''
					});
		        
		        var result = p.parser.parse(p.lexer);
		        
		        expect(result).toBe(false);
			});

			xit('should accept the string "aab" for the grammar aPlusEMPTY', function()
			{
				var p = k.parser.parserCreator.create(
				    {
						grammar: sampleGrammars.aPlusEMPTY.g,
						strInput: ''
					});
		        
		        // debugger;
		        var result = p.parser.parse(p.lexer);
		        expect(result).toBeTruthy();
			});
		});
	});
	
	describe('parserCreator', function ()
	{
		describe('create', function ()
		{
		//TODO Finish this!	
		});
	});
});
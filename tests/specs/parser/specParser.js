/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/sampleGrammars', '../../../src/parser/parser', , '../../../src/parser/automataLALR1Generator'], function(sampleGrammars, k)
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

			it('should accept the string "" for the grammar aPlusEMPTY', function()
			{
				var p = k.parser.parserCreator.create(
				    {
						grammar: sampleGrammars.aPlusEMPTY.g,
						strInput: ''
					});
		        
		        var result = p.parser.parse(p.lexer);
		        expect(result).toBeTruthy();
		        expect(result.nodes.length).toBe(0); //The only rule that applies is the one present at the root!
		        expect(result.rule.name).toEqual('S2RULE');
			});
			
			it('should accept the string "aa" for the grammar aPlusEMPTY', function()
			{
				var p = k.parser.parserCreator.create(
				    {
						grammar: sampleGrammars.aPlusEMPTY.g,
						strInput: 'aa'
					});
		        
		        var result = p.parser.parse(p.lexer);
		        expect(result).toBeTruthy();
			});
			
			xit('should FOO!!', function()
			{
				var	grammar = sampleGrammars.arithmetic.g,
					automataGenerator = new k.parser.AutomataLALR1Generator({
						grammar: grammar
					}),
					automata = automataGenerator.generateAutomata({
						conflictResolvers: k.parser.ConflictResolver.getDefaultResolvers()
					}),
					gotoTable = automataGenerator.generateGOTOTable(automata),
					actionTable = automataGenerator.generateACTIONTable(automata, {
						conflictResolvers: k.parser.ConflictResolver.getDefaultResolvers(),
						ignoreErrors: false
					}),
					lexer = new k.lexer.Lexer({
						grammar: grammar
					}),
					parser = new k.parser.Parser({
						gotoTable: gotoTable,
						grammar: grammar,
						actionTable: actionTable,
						initialState: automata.initialStateAccessor()
					});
		        
		        
		        lexer.setStream('(1+1)');
		        // debugger;
		        var result = parser.parse(lexer);
			});
		});
	});
	
	describe('parserCreator', function ()
	{
		describe('create', function ()
		{
			it('should throw an exception if a grammar is not specified', function ()
			{
				expect(function(){return k.parser.parserCreator.create();}).toThrow();	
			});
			
			it('should create a parser and a lexer with the specified Automata constructor', function ()
			{
				//As the default Automata Generator is LALR1 and the grammar is LR1, when the automta gets validated will generate return false
				var contructorFnc = function () {
					return k.parser.parserCreator.create({
						grammar: sampleGrammars.idsList.g,
						automataGenerator: k.parser.AutomataLR0Generator
					});
				};
				expect(contructorFnc).toThrow();
				
				var r = k.parser.parserCreator.create({
					grammar: sampleGrammars.idsList.g
				});
				
				expect(r).toBeDefined();
				
			});
			
			it('should use the Automata LALR 1 generator by default if one is not specified', function ()
			{
				var contructorFnc = function () {
					return k.parser.parserCreator.create({
						grammar: sampleGrammars.idsList.g
					});
				};
				expect(contructorFnc).not.toThrow();
				
				var r = k.parser.parserCreator.create({
					grammar: sampleGrammars.aPlusb.g	
				});
				
				expect(r).toBeDefined();
			});
			
			it('should accept an input string to be used by the lexer', function ()
			{
				var rStr = k.parser.parserCreator.create({
						grammar: sampleGrammars.aPlusb.g,
						strInput: 'aab'
					}),
					r = k.parser.parserCreator.create({
						grammar: sampleGrammars.aPlusb.g
					});
				
				var token = rStr.lexer.getNext();
				
				expect(token).toBeDefined();
				expect(token.length).toBe(1);
				expect(token.string).toEqual('a');
				expect(token.terminal.name).toEqual('A_LET')
				
				expect(r.lexer.getNext).toThrow();
			});
		});
	});
});
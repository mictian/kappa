/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/grammar'], function(k)
{
    'use strict';

	describe('Symbol', function ()
	{
        it('should only accept string parameters as a name', function()
		{
            expect(function() {
                return new k.data.Symbol({
                    name: {}
                });
            }).toThrow();

            expect(function() {
                return new k.data.Symbol({
                    name: 12
                });
            }).toThrow();


            expect(function() {
                return new k.data.Symbol({
                    name: false
                });
            }).toThrow();


            expect(function() {
                return new k.data.Symbol({
                    name: []
                });
            }).toThrow();

            expect(function() {
                return new k.data.Symbol({
                    name: 'test'
                });
            }).not.toThrow();
		});

		it('should not create a special one by default', function()
		{
            var s =  new k.data.Symbol({
                name: 'Test Symbol'
			});

			expect(s.isSpecial).toBe(false);
		});

		it('should create a special symbol if specified', function()
		{
			var s =  new k.data.Symbol({
                name: 'Test Symbol',
                isSpecial: true
			});

			expect(s.isSpecial).toBe(true);
		});

		it('should have a name specified', function()
		{
			expect(function() {
                return new k.data.Symbol({});
			}).toThrow();
		});

		it('must override toString to return its name', function()
		{
			var s =  new k.data.Symbol({
                name: 'result'
			});

			expect(s+'').toBe('result');
		});
	});

	describe('NonTerminal', function()
	{
        it('must be a Symbol', function() {
            var nonTerminal = new k.data.NonTerminal({
                name: 'Test'
            });

            expect(nonTerminal).toBeInstanceOf(k.data.Symbol);
        });

        it('should be invalid to create a non terminal without a name', function() {

            expect(function(){
                return new k.data.NonTerminal({});
            }).toThrow();
        });

        it ('should be able to create an array from a string array', function() {
            var result = k.data.NonTerminal.fromArray(['A','B']);

            expect(result.length).toBe(2);
            expect(result[0]).toBeInstanceOf(k.data.NonTerminal);
            expect(result[1]).toBeInstanceOf(k.data.NonTerminal);
            expect(result[0].name).toEqual('A');
            expect(result[1].name).toEqual('B');
        });

        it ('should be able to create an array from a string', function() {
            var result = k.data.NonTerminal.fromArray('AB');

            expect(result.length).toBe(2);
            expect(result[0]).toBeInstanceOf(k.data.NonTerminal);
            expect(result[1]).toBeInstanceOf(k.data.NonTerminal);
            expect(result[0].name).toEqual('A');
            expect(result[1].name).toEqual('B');
        });

        it ('will throw an exception if the passed in parameters are not strings', function() {
            expect(function() {
                k.data.NonTerminal.fromArray([{}]);
            }).toThrow();

            expect(function() {
                k.data.NonTerminal.fromArray([true]);
            }).toThrow();

            expect(function() {
                k.data.NonTerminal.fromArray([12]);
            }).toThrow();

            expect(function() {
                k.data.NonTerminal.fromArray(12);
            }).toThrow();

            expect(function() {
                k.data.NonTerminal.fromArray(true);
            }).toThrow();
        });

        it ('should return empty array if requested to create from an empty array', function() {
            expect(k.data.NonTerminal.fromArray([])).toEqual([]);
        });

        it('should have an isSpecial set to false', function() {
            var nonTerminal = new k.data.NonTerminal({
                name: 'Test'
            });

            expect(nonTerminal.isSpecial).toBeFalsy();
        });
	});

	describe('Terminal', function()
	{
        it('should have a body specified as string or regexp when creating', function() {
            var t = new k.data.Terminal({
                body: 'String'
            });

            expect(t).toBeDefined();

            t = new k.data.Terminal({
                body: /\d/
            });

            expect(t).toBeDefined();

            expect(function(){return new k.data.Terminal({body: 12});}).toThrow();
            expect(function(){return new k.data.Terminal({body: true});}).toThrow();
            expect(function(){return new k.data.Terminal({body: []});}).toThrow();
            expect(function(){return new k.data.Terminal({body: {}});}).toThrow();
        });

        it('should be a symbol', function() {
            var t = new k.data.Terminal({
                body: 'String'
            });

            expect(t).toBeInstanceOf(k.data.Symbol);
        });

        it('should have body to string as its name if name is not specified', function() {
            var t = new k.data.Terminal({
                body: 'String'
            });

            expect(t.name).toBe('String');

            var regexp = /\d/;
            t = new k.data.Terminal({
                body: regexp
            });

            expect(t.name).toBe(regexp.toString());
        });

        it('should have an isTerminal set to true', function() {
            var t = new k.data.Terminal({
                body: 'String'
            });

            expect(t.isTerminal).toBe(true);
        });

        it('should have an isSpecial set to false', function() {
            var t = new k.data.Terminal({
                body: 'String'
            });

            expect(t.isSpecial).toBeFalsy();
        });

        it('should override toString to return its name between < and > when name is specified', function() {
            var t = new k.data.Terminal({
                body: 'Body',
                name: 'String'
            });

            expect(t.toString()).toBe('<String>');
        });

        it('should override toString to return its name between < and > when name is not specified', function() {
            var t = new k.data.Terminal({
                body: 'Body'
            });

            expect(t.toString()).toBe('<Body>');

            var re = /\d/;
            t = new k.data.Terminal({
                body: re
            });

            expect(t.toString()).toBe('<'+re.toString()+'>');
        });
	});

	describe('Rule', function()
	{
        var r;

        beforeEach(function(){
            r = new k.data.Rule({
                head: 'TEST'
            });
        });

        it('should have a head specified when creating', function () {
            expect(function(){
                return k.data.Rule();
            }).toThrow();

            expect(function(){
                return k.data.Rule({
                    tail: []
                });
            }).toThrow();
        });

        it('should have a index property', function () {
            expect(r.index).toBeDefined();
            expect(Object.prototype.toString.call(r.index) === '[object Number]').toBe(true);
        });

        it('should create a non terminal head if the specified head is not a non terminal', function () {
            expect(r.head).toBeInstanceOf(k.data.NonTerminal);
        });

        it('should have the pass in head if it is a non terminal', function () {
            var nonTerminalHead = new k.data.NonTerminal({
                name: 'H'
            });

            var rule = new k.data.Rule({
                head: nonTerminalHead
            });

            expect(rule.head).toBe(nonTerminalHead);
        });

        it('should have a single array tail containing only the Empty special symbol if not tail is specified', function () {
            expect(r.tail.length).toBe(1);
            expect(r.tail[0]).toBeInstanceOf(k.data.Symbol);
            expect(r.tail[0].isSpecial).toBe(true);
            expect(r.tail[0].name).toBe(k.data.specialSymbol.EMPTY);
        });

        it('should have a single array tail containing only the Empty special symbol if the speicified tail is not an array', function () {
             var rule = new k.data.Rule({
                head: 'H',
                tail: 'fake'
            });

            expect(rule.tail.length).toBe(1);
            expect(rule.tail[0]).toBeInstanceOf(k.data.Symbol);
            expect(rule.tail[0].isSpecial).toBe(true);
            expect(rule.tail[0].name).toBe(k.data.specialSymbol.EMPTY);
        });

        it('should have toString method overriden ', function () {
            expect(r.toString()).toBe(''+r);
            expect(r.toString()).toBe('TEST-->EMPTY');
        });
	});

	describe('Grammar', function()
	{

        var S,
			EXPS1,
			EXPS2,
			EXP,
			OPAREN,
			CPAREN,
			g;

		beforeEach(function()
		{
            S = new k.data.Rule({
				head: 'S',
				tail: k.data.NonTerminal.fromArray(['OPAREN','EXPS','CPAREN'])
			});

			EXPS1 = new k.data.Rule({
				head: 'EXPS',
				tail: k.data.NonTerminal.fromArray(['EXPS','EXP'])
			});

            EXPS2 = new k.data.Rule({
				head: 'EXPS'
			});

			EXP = new k.data.Rule({
				head: 'EXP',
				tail: [new k.data.Terminal({name:'id', body: /[a-zA-Z]+/})]
			});

			OPAREN = new k.data.Rule({
				head: 'OPAREN',
				tail: [new k.data.Terminal({name:'OPAREN', body: /\(/})]
			});

			CPAREN = new k.data.Rule({
				head: 'CPAREN',
				tail: [new k.data.Terminal({name:'CPAREN', body: /\)/})]
			});

			g = new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, EXPS1, EXPS2, EXP, OPAREN, CPAREN]
			});
		});

        it('should have an empty name if it\'s not specified', function (){
            var gr = new k.data.Grammar({
				startSymbol: null,
				rules: []
            });

            expect(gr.options.name).toBe('');
        });

        it('should have an specified name', function (){
            var gr = new k.data.Grammar({
				startSymbol: null,
				rules: [],
				name: 'TEST'
            });

            expect(gr.options.name).toBe('TEST');
        });

        it ('should have grouped all rules by it head', function(){

            /*jshint -W069 */
			expect(g.rulesByHeader).toBeDefined();

			expect(g.rulesByHeader['S'].length).toBe(1);
			expect(g.rulesByHeader['S'][0]).toBe(S);

			expect(g.rulesByHeader['EXPS'].length).toBe(2);
			expect(g.rulesByHeader['EXPS'][0]).toBe(EXPS1);
			expect(g.rulesByHeader['EXPS'][1]).toBe(EXPS2);

			expect(g.rulesByHeader['EXP'].length).toBe(1);
			expect(g.rulesByHeader['EXP'][0]).toBe(EXP);

			expect(g.rulesByHeader['OPAREN'].length).toBe(1);
			expect(g.rulesByHeader['OPAREN'][0]).toBe(OPAREN);

			expect(g.rulesByHeader['CPAREN'].length).toBe(1);
			expect(g.rulesByHeader['CPAREN'][0]).toBe(CPAREN);
        });

        it ('should add a index to each rule', function(){
			expect(S.index).toBe(0);
			expect(EXPS1.index).toBe(1);
			expect(EXPS2.index).toBe(2);
			expect(EXP.index).toBe(3);
			expect(OPAREN.index).toBe(4);
			expect(CPAREN.index).toBe(5);
        });

        it ('should have grouped all terminal symbols', function(){

            expect(g.terminals).toBeDefined();
            expect(g.terminals.length).toBe(3); //The number of non terminal in the current grammar
            expect(g.terminals[0]).toEqual({
                body: EXP.tail[0].body,
                rule: EXP
            });

            expect(g.terminals[1]).toEqual({
                body: OPAREN.tail[0].body,
                rule: OPAREN
            });

            expect(g.terminals[2]).toEqual({
                body: CPAREN.tail[0].body,
                rule: CPAREN
            });
        });

        it ('.getRulesFromNonTerminal should return a rule by passing its valid head', function(){
            expect(g.getRulesFromNonTerminal(S.head)).toEqual([S]);
            expect(g.getRulesFromNonTerminal(EXP.head)).toEqual([EXP]);
            expect(g.getRulesFromNonTerminal(CPAREN.head)).toEqual([CPAREN]);
            expect(g.getRulesFromNonTerminal(OPAREN.head)).toEqual([OPAREN]);

            expect(g.getRulesFromNonTerminal(EXPS1.head)[0]).toEqual(EXPS1);
            expect(g.getRulesFromNonTerminal(EXPS1.head)[1]).toEqual(EXPS2);

            expect(g.getRulesFromNonTerminal(EXPS2.head)[0]).toEqual(EXPS1);
            expect(g.getRulesFromNonTerminal(EXPS2.head)[1]).toEqual(EXPS2);
        });

        it ('.getRulesFromNonTerminal should return undefined by passing a non valid head', function(){
             expect(function(){ return g.getRulesFromNonTerminal(undefined);}).toThrow();
             expect(g.getRulesFromNonTerminal({})).toBeUndefined();
             expect(g.getRulesFromNonTerminal(true)).toBeUndefined();
             expect(g.getRulesFromNonTerminal('')).toBeUndefined();
        });

        it ('should have .toString overridden', function(){
            expect(k.data.Grammar.prototype.toString).toBeDefined();
        });
	});
});
/* global expect: true, describe: true, it:  true, beforeEach: true, k: true, sampleGrammars: true */
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

	it('should create a special one by default', function()
	{
		var s =  new k.data.Symbol({
			name: 'Test Symbol'
		});

		expect(s.isSpecial).toBe(true);
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

	it('should have toString method overriden', function () {
		expect(Object.getPrototypeOf(r).hasOwnProperty('toString')).toBe(true);
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
			tail: [new k.data.Terminal({name:'id_terminal', body: /[a-zA-Z]+/})]
		});

		OPAREN = new k.data.Rule({
			head: 'OPAREN',
			tail: [new k.data.Terminal({name:'oparent_terminal', body: /\(/})]
		});

		CPAREN = new k.data.Rule({
			head: 'CPAREN',
			tail: [new k.data.Terminal({name:'cparent_terminal', body: /\)/})]
		});

		g = new k.data.Grammar({
			startSymbol: S.head,
			rules: [S, EXPS1, EXPS2, EXP, OPAREN, CPAREN]
		});
	});

	it ('should have .toString overridden', function(){
		expect(k.data.Grammar.prototype.toString).toBeDefined();
	});

	describe('constructor', function ()
	{
		it('should have an empty name if it\'s not specified', function (){
			var gr = new k.data.Grammar({
				startSymbol: new k.data.Symbol({name: k.data.specialSymbol.EMPTY, isSpecial:true}), //Because a grammar requires a start symbol
				rules: []
			});

			expect(gr.name).toBe('');
		});

		it('should have an specified name', function (){
			var gr = new k.data.Grammar({
				startSymbol: new k.data.Symbol({name: k.data.specialSymbol.EOF, isSpecial:true}), //Because a grammar requires a start symbol
				rules: [],
				name: 'TEST'
			});

			expect(gr.name).toBe('TEST');
		});

		it ('should have grouped all rules by it head', function(){

			// Ignore error caused by invoke object properties by using array notation
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
			expect(S.index).toBe(1);
			expect(EXPS1.index).toBe(2);
			expect(EXPS2.index).toBe(3);
			expect(EXP.index).toBe(4);
			expect(OPAREN.index).toBe(5);
			expect(CPAREN.index).toBe(6);
		});

		it ('should have grouped all terminal symbols', function(){

			expect(g.terminals).toBeDefined();
			expect(g.terminals.length).toBe(3); //The number of non terminal in the current grammar

			var terminal = k.utils.obj.find(g.terminals, function (terminal)
			{
			   return terminal.name === 'id_terminal';
			});
			expect(terminal).toBe(EXP.tail[0]);

			terminal = k.utils.obj.find(g.terminals, function (terminal)
			{
			   return terminal.name === 'oparent_terminal';
			});
			expect(terminal).toBe(OPAREN.tail[0]);

			terminal = k.utils.obj.find(g.terminals, function (terminal)
			{
			   return terminal.name === 'cparent_terminal';
			});
			expect(terminal).toBe(CPAREN.tail[0]);

		});

		it ('should expand the original grammar adding an extra initial rule', function (){
			expect(g.rules.length).toBe(7);
		});

		it ('should put the extra rule at first place', function (){
			expect(g.rules[0].name).toBe(k.data.Grammar.constants.AugmentedRuleName);
		});

		it ('should preserve the specified start symbol as specifiedStartSymbol', function (){
			expect(g.specifiedStartSymbol).toBe(S.head);
		});

		describe('un-productive rules detection', function ()
		{
			it ('shoud remove unproductive rules is nothing is specified', function ()
			{
				var Sa = new k.data.Rule({
						head: 'Sa',
						tail: [new k.data.Terminal({name:'aa_terminal', body: 'aa'})]
					}),
					Sa1 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['A'])
					}),
					Sa2 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B'])
					}),
					A = new k.data.Rule({
						head: 'A',
						tail: [new k.data.Terminal({name:'b_terminal', body: 'b'}), new k.data.NonTerminal({name: 'B'})]
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Terminal({name:'a_terminal', body: 'a'}), new k.data.NonTerminal({name: 'A'})]
					}),
					g1 =new k.data.Grammar({
						startSymbol: Sa.head,
						rules: [Sa, Sa1, Sa2, A, B]
					});

				expect(g1.rules.length).toBe(2);
			});

			it ('should convert the grammar to only generate epsilon if all the rules are non-productive', function ()
			{
					var Sa = new k.data.Rule({
							head: 'Sa',
							tail: k.data.NonTerminal.fromArray(['A'])
						}),
						Sa2 = new k.data.Rule({
							head: 'Sa',
							tail: k.data.NonTerminal.fromArray(['B'])
						}),
						B = new k.data.Rule({
							head: 'B',
							tail: [new k.data.Terminal({name:'a_terminal', body: 'a'}), new k.data.NonTerminal({name: 'A'})]
						}),
						g1 =new k.data.Grammar({
							startSymbol: Sa.head,
							rules: [Sa, Sa2, B]
						});

					expect(g1.rules.length).toBe(1);
					expect(g1.rules[0].name).toEqual(k.data.Grammar.constants.AugmentedRuleName);
					expect(g1.rules[0].tail.length).toBe(2);
					expect(g1.rules[0].tail[0].name).toEqual(k.data.specialSymbol.EMPTY);
			});

			it ('should set as unproductive rules that are reachable but are cyclic', function ()
			{
				var Sa = new k.data.Rule({
						head: 'Sa',
						tail: [new k.data.Terminal({name:'aa_terminal', body: 'aa'})]
					}),
					Sa1 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['A'])
					}),
					Sa2 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B'])
					}),
					A = new k.data.Rule({
						head: 'A',
						tail: [new k.data.Terminal({name:'b_terminal', body: 'b'}), new k.data.NonTerminal({name: 'B'})]
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Terminal({name:'a_terminal', body: 'a'}), new k.data.NonTerminal({name: 'A'})]
					});

				//Calling this constructor update the grammar's symbols!
				new k.data.Grammar({
					startSymbol: Sa.head,
					rules: [Sa, Sa1, Sa2, A, B],
					preserveNonProductiveRules: true
				});

				expect(Sa.isProductive).toBe(true);
				expect(Sa1.isProductive).toBe(false);
				expect(Sa2.isProductive).toBe(false);
				expect(A.isProductive).toBe(false);
				expect(B.isProductive).toBe(false);
			});

			it ('should consider empsilon rules as productive', function ()
			{
				var Sa = new k.data.Rule({
						head: 'Sa',
						tail: [new k.data.Terminal({name:'aa_terminal', body: 'aa'})]
					}),
					Sa1 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['A'])
					}),
					A = new k.data.Rule({
						head: 'A'
					});
				//Calling this constructor update the grammar's symbols!
				new k.data.Grammar({
					startSymbol: Sa.head,
					rules: [Sa, Sa1, A],
					preserveNonProductiveRules: true
				});

				expect(Sa.isProductive).toBe(true);
				expect(Sa1.isProductive).toBe(true);
				expect(A.isProductive).toBe(true);
			});

		});

		describe('epsilon rule tails remove process', function ()
		{
			it ('should remove epsilon in the middle of a rule when epsilon is not the only element in the rule', function ()
			{
				var Sa = new k.data.Rule({
						head: 'Sa'
					}),
					Sa1 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['A'])
					}),
					Sa2 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B'])
					}),
					A = new k.data.Rule({
						head: 'A',
						tail: [new k.data.Symbol({name: k.data.specialSymbol.EMPTY}), new k.data.Terminal({name:'aa_terminal', body: 'aa'}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Terminal({name:'a_terminal', body: 'a'})]
					}),
					g1 =new k.data.Grammar({
						startSymbol: Sa.head,
						rules: [Sa, Sa1, Sa2, A, B]
					});

				expect(g1.rules.length).toBe(6);
				expect(Sa.tail.length).toBe(1);
				expect(A.tail.length).toBe(1);
			});

			it ('should preseve epsilon in the initial rule', function ()
			{
				var Sa = new k.data.Rule({
						head: 'Sa'
					}),
					Sa2 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B'])
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Terminal({name:'b_terminal', body: 'b'})]
					}),
					g1 = new k.data.Grammar({
						startSymbol: Sa.head,
						rules: [Sa, Sa2, B]
					});

				expect(Sa.tail.length).toBe(1);
				expect(Sa.tail[0].name).toBe(k.data.specialSymbol.EMPTY);
				expect(g1.rules.length).toBe(4);
				expect(B.tail.length).toBe(1);
			});

			it ('should preseve epsilon in the initial GENERATED (when the specifeid rules are all removed) rule', function ()
			{
				var Sa = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B'])
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: k.data.NonTerminal.fromArray(['FAKE'])
					}),
					g1 = new k.data.Grammar({
						startSymbol: Sa.head,
						rules: [Sa, B]
					});

				expect(g1.rules.length).toBe(1);
				expect(g1.rules[0].tail.length).toBe(2);
				expect(g1.rules[0].index).toBe(0);
				expect(g1.rules[0].tail[0].name).toBe(k.data.specialSymbol.EMPTY);
				expect(g1.rules[0].tail[1].name).toBe(k.data.specialSymbol.EOF);
			});

			it ('should preserve epsilon in rules where it is the only element in the tail', function ()
			{
				var Sa = new k.data.Rule({
						head: 'Sa'
					}),
					Sa1 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['A'])
					}),
					Sa2 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B'])
					}),
					A = new k.data.Rule({
						head: 'A',
						tail: [new k.data.Symbol({name: k.data.specialSymbol.EMPTY}), new k.data.Terminal({name:'aa_terminal', body: 'aa'}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					g1 =new k.data.Grammar({
						startSymbol: Sa.head,
						rules: [Sa, Sa1, Sa2, A, B]
					});

				expect(g1.rules.length).toBe(6);
				expect(B.tail.length).toBe(1);
				expect(A.tail.length).toBe(1);
			});
		});

		describe('unrechable nonTerminal removal', function()
		{
			it('should remove all rules that are unrechable from the initial start symbol', function()
			{
				var Sa = new k.data.Rule({
						head: 'Sa'
					}),
					Sa2 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B'])
					}),
					A = new k.data.Rule({
						head: 'A',
						tail: [new k.data.Terminal({name:'aa_terminal', body: 'aa'}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					g1 =new k.data.Grammar({
						startSymbol: Sa.head,
						rules: [Sa, Sa2, A, B]
					});

				expect(g1.rules.length).toBe(4);
				expect(A.isProductive).toBe(true);
				expect(A.isReachable).toBe(false);
				expect(Sa.isReachable).toBe(true);
				expect(Sa2.isReachable).toBe(true);
				expect(B.isReachable).toBe(true);
			});

			it('should preseve all rules even those that are unrechable from the initial start symbol if it is specified', function()
			{
				var Sa = new k.data.Rule({
						head: 'Sa'
					}),
					Sa2 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B'])
					}),
					A = new k.data.Rule({
						head: 'A',
						tail: [new k.data.Terminal({name:'aa_terminal', body: 'aa'}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					g1 =new k.data.Grammar({
						startSymbol: Sa.head,
						preserveUnReachableRules: true,
						rules: [Sa, Sa2, A, B]
					});

				expect(g1.rules.length).toBe(5);
			});
		});

		describe('determine nullable non terminals', function ()
		{
			it('should mark as nullable nontermials that are head of empty rules', function ()
			{
				var Sa = new k.data.Rule({
						head: 'Sa'
					}),
					Sa2 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B', 'C', 'A'])
					}),
					A = new k.data.Rule({
						head: 'A',
						tail: [new k.data.Symbol({name: k.data.specialSymbol.EMPTY}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					C = new k.data.Rule({
						head: 'C',
						tail: [new k.data.Terminal({name:'c_terminal', body: 'c'})]
					}),
					g1 =new k.data.Grammar({
						startSymbol: Sa.head,
						rules: [Sa, Sa2, A, B, C]
					});

				expect(A.head.isNullable).toBe(true);

				expect(Sa.head.isNullable).toBe(true);
				expect(Sa2.head.isNullable).toBe(true);

				expect(g1.nullableNonTerminals.indexOf(A.head.name) >= 0).toBe(true);
			});

			it('should mark as nullable item that are indirect nullable', function ()
			{
				var Sa = new k.data.Rule({
						head: 'Sa'
					}),
					Sa2 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B'])
					}),
					A = new k.data.Rule({
						head: 'A',
						tail: [new k.data.Terminal({name:'aa_terminal', body: 'aa'}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY}), new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Symbol({name: k.data.specialSymbol.EMPTY})]
					}),
					g1 =new k.data.Grammar({
						startSymbol: Sa.head,
						rules: [Sa, Sa2, A, B]
					});

				expect(g1.rules.length).toBe(4);
				expect(A.head.isNullable).toBe(false);
				expect(B.head.isNullable).toBe(true);
			});
		});

		describe('pre calculate FIRST SETs', function ()
		{
			it('Should include terminal "a" with the simple rule A->"a"', function ()
			{
				var B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Terminal({name:'b_terminal', body: 'b'})]
					}),
					g1 = new k.data.Grammar({
						startSymbol: B.head,
						rules: [B]
					});

				expect(g1.rules.length).toBe(2);
				expect(g1.firstSetsByHeader[B.head.name].length).toBe(1);
				expect(g1.firstSetsByHeader[B.head.name][0].name).toBe('b_terminal');
			});

			it('Should return epsilon for a simple rule S->EMPTY', function ()
			{
				var B = new k.data.Rule({
						head: 'B'
					}),
					g1 = new k.data.Grammar({
						startSymbol: B.head,
						rules: [B]
					});

				expect(g1.rules.length).toBe(2);
				expect(g1.firstSetsByHeader[B.head.name].length).toBe(1);
				expect(g1.firstSetsByHeader[B.head.name][0].name).toBe('EMPTY');
			});

			it('Should return terminals and EMPTY if the non terminal is nullable', function ()
			{
				var B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Terminal({name:'b_terminal', body: 'b'})]
					}),
					B1 = new k.data.Rule({
						head: 'B'
					}),
					g1 = new k.data.Grammar({
						startSymbol: B.head,
						rules: [B, B1]
					});

				expect(g1.rules.length).toBe(3);
				var head_firstset = g1.firstSetsByHeader[B.head.name];
				expect(head_firstset.length).toBe(2);
				expect(head_firstset[0].name).toBe('b_terminal');
			});

			it('Should supprt valid recursions', function ()
			{
				//This grammar contains recursive rules: EXPS -> EXPS EXP
				var g = sampleGrammars.idsList.g,
					expsNT = sampleGrammars.idsList.EXPS1.head;

				expect(g.rules.length).toBe(7);
				expect(g.firstSetsByHeader[expsNT.name].length).toBe(2);
				var exps_firsset = g.firstSetsByHeader[expsNT.name];
				expect(exps_firsset[0].name).toBe('id_terminal');
				expect(exps_firsset[1].name).toBe('EMPTY');
			});

			it('Should return multiples terminals when needed', function ()
			{
				var Sa = new k.data.Rule({
						head: 'Sa',
						tail: [new k.data.Terminal({name:'a_terminal', body: 'a'})]
					}),
					Sa2 = new k.data.Rule({
						head: 'Sa',
						tail: k.data.NonTerminal.fromArray(['B'])
					}),
					B = new k.data.Rule({
						head: 'B',
						tail: [new k.data.Terminal({name:'b_terminal', body: 'b'})]
					}),
					g1 = new k.data.Grammar({
						startSymbol: Sa.head,
						rules: [Sa, Sa2, B]
					});

				var head_firstset = g1.firstSetsByHeader[Sa.head.name];
				expect(head_firstset.length).toBe(2);
				expect(head_firstset[0].name).toBe('a_terminal');
				expect(head_firstset[1].name).toBe('b_terminal');
			});
		});
	});

	describe('getRulesFromNonTerminal', function()
	{
		it ('should return a rule by passing its valid head', function(){
			expect(g.getRulesFromNonTerminal(S.head)).toEqual([S]);
			expect(g.getRulesFromNonTerminal(EXP.head)).toEqual([EXP]);
			expect(g.getRulesFromNonTerminal(CPAREN.head)).toEqual([CPAREN]);
			expect(g.getRulesFromNonTerminal(OPAREN.head)).toEqual([OPAREN]);

			expect(g.getRulesFromNonTerminal(EXPS1.head)[0]).toEqual(EXPS1);
			expect(g.getRulesFromNonTerminal(EXPS1.head)[1]).toEqual(EXPS2);

			expect(g.getRulesFromNonTerminal(EXPS2.head)[0]).toEqual(EXPS1);
			expect(g.getRulesFromNonTerminal(EXPS2.head)[1]).toEqual(EXPS2);
		});

		it ('should return undefined by passing a non valid head', function(){
			 expect(function(){ return g.getRulesFromNonTerminal(undefined);}).toThrow();
			 expect(g.getRulesFromNonTerminal({})).toBeUndefined();
			 expect(g.getRulesFromNonTerminal(true)).toBeUndefined();
			 expect(g.getRulesFromNonTerminal('')).toBeUndefined();
		});
	});
});
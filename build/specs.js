
function addMatchers(jasmine)
{
	beforeEach(function() {
        jasmine.addMatchers({

            toBeInstanceOf: function(util, customEqualityTesters)
            {
                return  {
                    compare: function(actual, expected)
                    {
                        return {
                            pass: actual instanceof expected,
                            message: (actual instanceof expected) ? 'OK' : 'Expected ' + actual.constructor.name + ' is instance of ' + expected.name
                        };
                    }
                };
            }
        });
    });
}

addMatchers(jasmine);


var k = kappa;


/* global k:true  */
var sampleGrammars = {

	/*
	001. Very simple grammar to represent number divisions
	*/
	numDivs: (function() {
		'use strict';
		/*
		LR(1)
		0. S --> E
		1. E --> E Q F
		2. E --> F
		3. Q --> '%'
		4. F --> 'number
		*/
		var S = new k.data.Rule({
				head: 'S',
				tail: k.data.NonTerminal.fromArray(['E']),
				name: 'SRULE'
			}),

			E1 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['E','Q', 'F']),
				name: 'E1RULE'
			}),

			E2 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['F']),
				name: 'E2RULE'
			}),

			Q = new k.data.Rule({
				head: 'Q',
				tail: [new k.data.Terminal({name:'DIV', body: /\//})],
				name: 'QRULE'
			}),

			F = new k.data.Rule({
				head: 'F',
				tail: [new k.data.Terminal({name:'NUMBER', body: /\d/})],
				name: 'FRULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, E1, E2, Q, F],
				name: 'numDivs'
			}),
			S: S,
			E1: E1,
			E2: E2,
			Q: Q,
			F: F
		};
	})(),

	/*
	002. Very simple list of ids (letters) divides by spaces between '(' and ')'
	*/
	idsList: (function() {
		'use strict';
		/*
		LR(1)
		1. S --> OPAREN EXPS CPAREN
		2. EXPS --> EXPS EXP
		3. EXPS --> <EMPTY>
		4. EXP --> 'id'
		5. OPAREN --> '('
		6. CPAREN --> ')'
		*/
		var S = new k.data.Rule({
			head: 'S',
			tail: k.data.NonTerminal.fromArray(['OPAREN','EXPS','CPAREN']),
			name: 'SRULE'
		}),

			EXPS1 = new k.data.Rule({
				head: 'EXPS',
				tail: k.data.NonTerminal.fromArray(['EXPS','EXP']),
				name: 'EXPS1RULE'
			}),

	        EXPS2 = new k.data.Rule({
				head: 'EXPS',
				name: 'EXPS2RULE'
			}),

			EXP = new k.data.Rule({
				head: 'EXP',
				tail: [new k.data.Terminal({name:'id_terminal', body: /[a-zA-Z]+/})],
				name: 'EXPRULE'
			}),

			OPAREN = new k.data.Rule({
				head: 'OPAREN',
				tail: [new k.data.Terminal({name:'oparen_terminal', body: /\(/})],
				name: 'OPARENRULE'
			}),

			CPAREN = new k.data.Rule({
				head: 'CPAREN',
				tail: [new k.data.Terminal({name:'cparen_terminal', body: /\)/})],
				name: 'CPARENRULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, EXPS1, EXPS2, EXP, OPAREN, CPAREN],
				name: 'idsList'
			}),
			S: S,
			EXPS1: EXPS1,
			EXPS2: EXPS2,
			EXP: EXP,
			OPAREN: OPAREN,
			CPAREN: CPAREN
		};
	})(),

	/*
	003. Very simple grammar to represent number divisions with epsilon rule
	*/
	numDivsEmpty: (function() {
		'use strict';
		/*
		LR(1)
		0. S --> E
		1. E --> E Q F
		2. E --> F
		3. Q --> '%'
		4. Q --> <EMPTY>
		5. F --> 'number'

		*/
		var S = new k.data.Rule({
			head: 'S',
			tail: k.data.NonTerminal.fromArray(['E']),
			name: 'SRULE'
		}),

			E1 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['E','Q', 'F']),
				name: 'E1RULE'
			}),

			E2 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['F']),
				name: 'E2RULE'
			}),

			Q1 = new k.data.Rule({
				head: 'Q',
				tail: [new k.data.Terminal({name:'DIV', body: /\//})],
				name: 'Q1RULE'
			}),

			Q2 = new k.data.Rule({
				head: 'Q',
				name: 'Q2RULE'
			}),

			F = new k.data.Rule({
				head: 'F',
				tail: [new k.data.Terminal({name:'NUMBER', body: /\d/})],
				name: 'FRULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, E1, E2, Q1, Q2, F],
				name: 'numDivsEmpty'
			}),
			S: S,
			E1: E1,
			E2: E2,
			Q1: Q1,
			Q2: Q2,
			F: F
		};
	})(),

	/*
	004. Very simple grammar for difference of numbers
	*/
	numDiff: (function() {
		'use strict';
		/*
		LR(k>1)
		1. S --> E
		2. E --> E R T
		3. E --> T
		4. T --> 'number'
		5. T --> OPAREN E CPAREN
		6. OPAREN --> '('
		7. CPAREN --> ')'
		8. R --> '-'
		*/
		var S = new k.data.Rule({
				head: 'S',
				tail: k.data.NonTerminal.fromArray(['E']),
				name: 'SRULE'
			}),

			E1 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['E', 'R', 'T']),
				name: 'E1RULE'
			}),

			E2 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['T']),
				name: 'E2RULE'
			}),

			T1 = new k.data.Rule({
				head: 'T',
				tail: [new k.data.Terminal({name:'NUMBER', body: /\d/})],
				name: 'T1RULE'
			}),

			T2 = new k.data.Rule({
				head: 'T',
				tail: k.data.NonTerminal.fromArray(['OPAREN', 'E', 'CPAREN']),
				name: 'T2RULE'
			}),

			OPAREN = new k.data.Rule({
				head: 'OPAREN',
				tail: [new k.data.Terminal({name:'OPAREN', body: /\(/})],
				name: 'OPARENRULE'
			}),

			CPAREN = new k.data.Rule({
				head: 'CPAREN',
				tail: [new k.data.Terminal({name:'CPAREN', body: /\)/})],
				name: 'CPARENRULE'
			}),

			R = new k.data.Rule({
				head: 'R',
				tail: [new k.data.Terminal({name:'DIFF', body: '-'})],
				name: 'RRULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, E1, E2, T1, T2, OPAREN, CPAREN, R],
				name: 'numDiff'
			}),
			S: S,
			E1: E1,
			E2: E2,
			T1: T1,
			T2: T2,
			OPAREN: OPAREN,
			CPAREN: CPAREN,
			R:R
		};
	})(),

	/*
	005. Very simple grammar for a*b (b, ab, aab, aaaaaaab)
	*/
	aPlusb: (function() {
		'use strict';
		/*
		LR(0)
		1. A --> 'a' A
		2. A --> 'b'
		*/
		var A1 = new k.data.Rule({
				head: 'A',
				tail: [new k.data.Terminal({name:'A_LET', body: 'a'}), new k.data.NonTerminal({name: 'A'})],
				name: 'A1RULE'
			}),

			A2 = new k.data.Rule({
				head: 'A',
				tail: [new k.data.Terminal({name:'B_LET', body: 'b'})],
				name: 'A2RULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: A1.head,
				rules: [A1, A2],
				name: 'aPlusb'
			}),
			A1: A1,
			A2: A2
		};
	})(),

	/*
	006. Very simple grammar for a*
	*/
	aPlusEMPTY: (function () {
		'use strict';
		/*
		LR(1)
		1. S --> 'a' S
		2. S --> EMPTY
		*/
		var S1 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Terminal({name:'A_LET', body: 'a'}), new k.data.NonTerminal({name: 'S'})],
				name: 'S1RULE'
			}),

			S2 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Symbol({name:k.data.specialSymbol.EMPTY})],
				name: 'S2RULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S1.head,
				rules: [S1, S2],
				name:'aPlusEMPTY'
			}),
			S1: S1,
			S2: S2
		};
	})(),

	/*
	007. Condenced version of the grammar numDiff (same language)
	*/
	numDiffCondenced: (function() {
		'use strict';
		/*
		LR(1)
		1. S --> E
		2. E --> E '-' T
		3. E --> T
		4. T --> 'number'
		5. T --> '(' E ')'
		*/
		var S = new k.data.Rule({
				head: 'S',
				tail: k.data.NonTerminal.fromArray(['E']),
				name: 'SRULE'
			}),

			E1 = new k.data.Rule({
				head: 'E',
				tail: [new k.data.NonTerminal({name: 'E'}), new k.data.Terminal({name:'DIFF', body: '-'}), new k.data.NonTerminal({name: 'T'})],
				name: 'E1RULE'
			}),

			E2 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['T']),
				name: 'E2RULE'
			}),

			T1 = new k.data.Rule({
				head: 'T',
				tail: [new k.data.Terminal({name:'NUMBER', body: /\d/})],
				name: 'T1RULE'
			}),

			T2 = new k.data.Rule({
				head: 'T',
				tail: [new k.data.Terminal({name:'OPAREN', body: /\(/}), new k.data.NonTerminal({name: 'E'}), new k.data.Terminal({name:'CPAREN', body: /\)/})],
				name: 'T2RULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, E1, E2, T1, T2],
				name: 'numDiffCondenced'
			}),
			S: S,
			E1: E1,
			E2: E2,
			T1: T1,
			T2: T2
		};
	})(),

	/*
	008. Simple a^(n+1)b^(n) Grammar
	*/
	aPowN1b: (function () {
		'use strict';
		/*
		LR(1)
		1. S --> AD
		2. A --> 'a' A 'b'
		3. A --> 'a'
		4. D --> 'd'
		*/
		var S = new k.data.Rule({
				head: 'S',
				tail: k.data.NonTerminal.fromArray(['A','D']),
				name: 'SRULE'
			}),

			A1 = new k.data.Rule({
				head: 'A',
				tail: [new k.data.Terminal({name:'a_terminal', body: 'a'}), new k.data.NonTerminal({name: 'A'}), new k.data.Terminal({name:'b_terminal', body: 'b'})],
				name: 'A1RULE'
			}),

			A2 = new k.data.Rule({
				head: 'A',
				tail: [new k.data.Terminal({name:'a_terminal', body: 'a'})],
				name: 'A2RULE'
			}),

			D = new k.data.Rule({
				head: 'D',
				tail: [new k.data.Terminal({name:'d_terminal', body: 'd'})],
				name: 'DRULE'
			});

		return  {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules:[S,A1,A2,D],
				name:'aPowN1b'
			}),
			S:S,
			A1:A1,
			A2:A2,
			D:D
		};
	})(),

	/*
	009. Simple a^(n+1)b^(n) Grammar
	*/
	selectedBs: (function () {
		'use strict';
		/*
		LR(0)
		1. S --> 'b'
		2. S --> '(' L ')'
		3. L --> S
		4. L --> L ';' S
		*/
		//IMPORTANT: This grammar is intentionally without precendence set!
		var S1 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Terminal({name:'b_terminal', body: 'b'})],
				name: 'S1RULE'
			}),

			S2 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Terminal({name:'oparen_terminal', body: '('}), new k.data.NonTerminal({name: 'L'}), new k.data.Terminal({name:'cparen_terminal', body: ')'})],
				name: 'S2RULE'
			}),

			L1 = new k.data.Rule({
				head: 'L',
				tail: [new k.data.NonTerminal({name:'S'})],
				name: 'L1RULE'
			}),

			L2 = new k.data.Rule({
				head: 'L',
				tail: [new k.data.NonTerminal({name:'L'}), new k.data.Terminal({name:'semicol_terminal', body: ';'}), new k.data.NonTerminal({name:'S'})],
				name: 'L2RULE'
			});

		return  {
			g: new k.data.Grammar({
				startSymbol: S1.head,
				rules:[S1, S2, L1, L2],
				name:'selectedBs'
			}),
			S1:S1,
			S2:S2,
			L1:L1,
			L2:L2
		};
	})(),

	/*
	010. Grammar for simple arithmetic expressions
	*/
	arithmetic: (function () {
		'use strict';
		/*
		LR(1)
		1. E --> E '+' E
		2. E --> E '-' E
		3. E --> E '*' E
		4. E --> E '/' E
		5. E --> (E)
		. E --> \d
		*/
		var E_NT = new k.data.NonTerminal({name: 'E'}),

			plus_T = new k.data.Terminal({name:'plus_terminal', body: '+', assoc: k.data.associativity.LEFT}),
			minus_T = new k.data.Terminal({name:'minus_terminal', body: '-', assoc: k.data.associativity.LEFT}),
			multi_T = new k.data.Terminal({name:'multi_terminal', body: '*', assoc: k.data.associativity.LEFT}),
			div_T = new k.data.Terminal({name:'div_terminal', body: '/', assoc: k.data.associativity.LEFT}),
			oparen_T = new k.data.Terminal({name:'oparen_terminal', body: '('}),
			cparen_T = new k.data.Terminal({name:'cparen_terminal', body: ')'}),
			number_T = new k.data.Terminal({name:'number_terminal', body: /\d+/}),

			E1 = new k.data.Rule({
				head: E_NT.name,
				tail: [E_NT, plus_T, E_NT],
				reduceFunc: function (expressionsParams)
				{
					return expressionsParams.values[0] + expressionsParams.values[2];
				},
				precendence: 10,
				name: 'EPLUSRULE'
			}),

			E2 = new k.data.Rule({
				head: E_NT.name,
				tail: [E_NT, minus_T, E_NT],
				reduceFunc: function (expressionsParams)
				{
					return expressionsParams.values[0] - expressionsParams.values[2];
				},
				precendence: 10,
				name: 'EMINUSRULE'
			}),

			E3 = new k.data.Rule({
				head: E_NT.name,
				tail: [E_NT, multi_T, E_NT],
				reduceFunc: function (expressionsParams)
				{
					return expressionsParams.values[0] * expressionsParams.values[2];
				},
				precendence: 20,
				name: 'EMULTIRULE'
			}),

			E4 = new k.data.Rule({
				head: E_NT.name,
				tail: [E_NT, div_T, E_NT],
				reduceFunc: function (expressionsParams)
				{
					return expressionsParams.values[0] / expressionsParams.values[2];
				},
				precendence: 20,
				name: 'EDIVRULE'
			}),

			E5 = new k.data.Rule({
				head: E_NT.name,
				tail: [oparen_T, E_NT, cparen_T],
				reduceFunc: function (expressionsParams)
				{
					return expressionsParams.values[1];
				},
				precendence: 30,
				name: 'EPARENRULE'
			}),

			EN = new k.data.Rule({
				head: E_NT.name,
				tail: [number_T],
				reduceFunc: function (numberParam)
				{
					return parseInt(numberParam.values[0]);
				},
				name: 'ENUMBERRULE'
			});

		return  {
			g: new k.data.Grammar({
				startSymbol: E1.head,
				rules:[E1, E2, E3, E4, E5, EN],
				name:'arithmetic'
			}),
			plus_T:plus_T,
			minus_T:minus_T,
			multi_T:multi_T,
			div_T:div_T,
			number_T:number_T,

			E1:E1,
			E2:E2,
			E3:E3,
			E4:E4,
			E5:E5,
			EN:EN
		};
	})(),

	/*
	011. Simple [test|succeeded]*
	*/
	testSucceeded: (function () {
		'use strict';
		/*
		LR(0)
		1. S --> 'test'
		2. S --> S L
		3. L --> 'succeeded'
		*/
		var S1 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Terminal({name:'test_terminal', body: 'test'})],
				name: 'S1RULE'
			}),

			S2 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.NonTerminal({name:'S'}), new k.data.NonTerminal({name: 'L'})],
				name: 'S2RULE'
			}),

			L1 = new k.data.Rule({
				head: 'L',
				tail: [new k.data.Terminal({name:'test_terminal', body: 'test'})],
				name: 'L1RULE'
			});

		return  {
			g: new k.data.Grammar({
				startSymbol: S1.head,
				rules:[S1, S2, L1],
				name:'testSucceeded'
			}),
			S1:S1,
			S2:S2,
			L1:L1
		};
	})(),

	/*
	012. Simple [te\nst|succeeded]*
	*/
	testSucceededEnter: (function () {
		'use strict';
		/*
		LR(0)
		1. S --> 'test'
		2. S --> S L
		3. L --> 'succeeded'
		*/
		var S1 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Terminal({name:'test_terminal', body: 'te\nst'})],
				name: 'S1RULE'
			}),

			S2 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.NonTerminal({name:'S'}), new k.data.NonTerminal({name: 'L'})],
				name: 'S2RULE'
			}),

			L1 = new k.data.Rule({
				head: 'L',
				tail: [new k.data.Terminal({name:'test_terminal', body: 'test'})],
				name: 'L1RULE'
			});

		return  {
			g: new k.data.Grammar({
				startSymbol: S1.head,
				rules:[S1, S2, L1],
				name:'testSucceeded'
			}),
			S1:S1,
			S2:S2,
			L1:L1
		};
	})(),

	/*
	013. Simple Grammar used to test lexer's priority and multiple matchign features
	IMPORTNAT: DO NOT UPDATE THIS GRAMMAR, otherwise some lexer test will fail!
	*/
	testPrioritiesMultipleMatching: (function ()
	{
		'use strict';
		/*
		LR(0)
		1. S --> id
		2. S --> S L
		3. L --> ','
		3. L --> lower_letter
		*/
		var S1 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Terminal({name:'id_terminal', priority: 10, body: /[A-Za-z]+/})],
				name: 'S1RULE'
			}),

			S2 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.NonTerminal({name:'S'}), new k.data.NonTerminal({name: 'L'})],
				name: 'S2RULE'
			}),

			L1 = new k.data.Rule({
				head: 'L',
				tail: [new k.data.Terminal({name:'comma_terminal', body: ','})],
				name: 'L1RULE'
			}),

			L2 = new k.data.Rule({
				head: 'L',
				tail: [new k.data.Terminal({name:'lower_letter_terminal', priority: 15, body: /[a-z]+/})],
				name: 'L2RULE'
			});

		return  {
			g: new k.data.Grammar({
				startSymbol: S1.head,
				rules:[S1, S2, L1, L2],
				name:'testSucceeded'
			}),
			S1:S1,
			S2:S2,
			L1:L1,
			L2:L2
		};
	})()
};
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
/* global expect: true, describe: true, it:  true, beforeEach: true, k: true, sampleGrammars: true */
'use strict';

describe('automata', function()
{
	it('should override toString', function()
	{
		var a = new k.data.Automata({});
		expect(Object.getPrototypeOf(a).hasOwnProperty('toString')).toBe(true);
	});

	describe('constructor', function()
	{
		it('should define a states array if not specified', function()
		{
			var a = new k.data.Automata({});

			expect(a.states).toBeDefined();
			expect(a.states).toBeInstanceOf(Array);
			expect(a.states.length).toBe(0);
		});

		it('should save the states property if specified', function()
		{
			var a = new k.data.Automata({
				states: [{
					getIdentity: function() {return 1; }
				}, {
					getIdentity: function() {return 2; }
				}, {
					getIdentity: function() {return 3; }
				}]
			});

			expect(a.states).toBeDefined();
			expect(a.states).toBeInstanceOf(Array);
			expect(a.states.length).toBe(3);
			expect(a.states[0].getIdentity()).toBe(1);
			expect(a.states[1].getIdentity()).toBe(2);
			expect(a.states[2].getIdentity()).toBe(3);
		});

		it('should save the specified options', function()
		{
			var options = {
					name: 'testing',
					forReal: true
				},
				a = new k.data.Automata(options);

			expect(a.options).toBe(options);
		});
	});

	describe('getNextState', function()
	{
		it('should return falsy if we retrieve all automata\'s states', function()
		{
			var a = new k.data.Automata({
				states: [{
					getIdentity: function() {return 1; }
				}, {
					getIdentity: function() {return 2; }
				}, {
					getIdentity: function() {return 3; }
				}]
			});

			a.getNextState(); //get 1
			a.getNextState(); //get 2
			a.getNextState(); //get 3

			var result = a.getNextState();
			expect(result).toBeFalsy();
		});

		it('should return falsy if there is no state', function()
		{
			var a = new k.data.Automata({});

			expect(a.getNextState()).toBeFalsy();
		});

		it('should return the first state only once', function()
		{
			var state1 = {
					getIdentity: function() {return 1; }
				},
				state2 = {
					getIdentity: function() {return 2; }
				},
				state3 = {
					getIdentity: function() {return 3; }
				},
				a = new k.data.Automata({
					states: [state1, state2, state3]
				});

			expect(a.getNextState()).toBe(state1); //get 1
			expect(a.getNextState()).toBe(state2); //get 2
			expect(a.getNextState()).toBe(state3); //get 3

			var result = a.getNextState();
			expect(result).toBeFalsy();
		});

		it('should return added states', function ()
		{
			var shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L2])[0],
				state1 = new k.data.State({
					items: [shiftItem1, reduceItem1]
				}),
				state2 = new k.data.State({
					items: [shiftItem2, reduceItem2]
				}),
				automata = new k.data.Automata({});

			reduceItem1.dotLocation = 3;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(shiftItem2.getCurrentSymbol());
			reduceItem2.lookAhead.push(shiftItem2.getCurrentSymbol());

			expect(automata.getNextState()).toBeFalsy();

			automata.addState(state1);
			expect(automata.getNextState()).toBe(state1);

			automata.addState(state2);
			expect(automata.getNextState()).toBe(state2);
		});

		it('should add as unprocessed state when adding an already present state but with different lookAhead (editing existing state) (USING LOOKAHEAD of course)', function ()
		{
			var shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L2])[0],
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state1 = new k.data.State({
					items: [shiftItem1, reduceItem1]
				}),
				//We clone the reduce items, so when adding extra symbols in tis lookAhead, this new symbols will be only in hte cloned item rule and not in the original one
				clonedReduceItem = reduceItem1.clone(),
				state2 = new k.data.State({
					items: [shiftItem1, clonedReduceItem]
				}),
				automata = new k.data.Automata({
					hasLookAhead: true
				});

			//This cause that the itemrule identity change, se we need to update the state register items
			reduceItem1.dotLocation = 3;
			reduceItem1._id = null;
			reduceItem1.lookAhead.push(shiftItem1.getCurrentSymbol());

			clonedReduceItem.dotLocation = 3;
			clonedReduceItem._id = null;
			clonedReduceItem.lookAhead.push(shiftItem1.getCurrentSymbol());

			state1._registerItems = {};
			state1._registerItemRules();

			state2._registerItems = {};
			state2._registerItemRules();

			expect(automata.getNextState()).toBeFalsy();

			automata.addState(state1);
			expect(automata.getNextState()).toBe(state1);
			expect(automata.getNextState()).toBeFalsy();

			clonedReduceItem.lookAhead.push(shiftItem1.rule.tail[1]);

			automata.addState(state2);
			expect(automata.getNextState()).toEqual(state1);
		});
	});

	describe('initialStateAccessor', function()
	{
	    it('should set the initial state if it is passed', function()
	    {
	        var a = new k.data.Automata({}),
	        	expectedResult = {
					mock:true
				};

			a.initialStateAccessor(expectedResult);
			expect(a.initialStateAccessor()).toBe(expectedResult);
	    });

	    it('should return the initial state if nothing is passed', function()
	    {
	        var expectedResult = {
					mock:true
				},
				a = new k.data.Automata({initialState: expectedResult});

			expect(a.initialStateAccessor()).toBe(expectedResult);
	    });
	});

	describe('addState', function()
	{
		it('should throw an exception if the state is invalid', function()
		{
			var a = new k.data.Automata({});

			expect(function() { return a.addState({}); }).toThrow();
		});

		it('should add the specified state', function()
		{
			var a = new k.data.Automata({});

			a.addState({
				getIdentity: function() {return 1; }
			});

			expect(a.getNextState().getIdentity()).toBe(1);
		});

		it('should add only once each state', function()
		{
			var a = new k.data.Automata({});

			a.addState({
				getIdentity: function() {return 1; }
			});

			a.addState({
				getIdentity: function() {return 1; }
			});

			expect(a.getNextState().getIdentity()).toBe(1);
			expect(a.getNextState()).toBeFalsy();
		});
	});
});
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
/* global expect: true, describe: true, it:  true, beforeEach: true, k:true, sampleGrammars: true */
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
		it('should create a new item rule without any change if nothing else is specified', function()
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
		
		it('should create a new array of lookAhead symbols that point to the original symbols', function ()
		{
			var reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E1])[0];
			
			reduceItem1.lookAhead.push(sampleGrammars.arithmetic.plus_T);
			reduceItem1.lookAhead.push(sampleGrammars.arithmetic.minus_T);
			
			var result = reduceItem1.clone();

			expect(result.lookAhead).not.toBe(reduceItem1.lookAhead);
			expect(result.lookAhead.length).toBe(reduceItem1.lookAhead.length);
			expect(result.lookAhead.length).toBe(2);
			
			reduceItem1.lookAhead.splice(0, 1);
			
			expect(result.lookAhead.length).toBe(2);
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
/* global spyOn:true, expect: true, describe: true, it:  true, beforeEach: true, k:  true */
'use strict';

describe('Node', function()
{
    it('should override toString', function()
	{
		var a = new k.data.Node({});
		expect(Object.getPrototypeOf(a).hasOwnProperty('toString')).toBe(true);
	});
	
    describe('constructor', function ()
    {
        it('should define a nodes and a transitions property as arrays', function ()
        {
            var node1 = {mname:'node1'},
                node2 = {mname:'node2'},
                transition1 = {name:'transition1'},
                transition2 = {name:'transition2'},
                n = new k.data.Node({
                    nodes: [node1, node2],
                    transitions: [transition1, transition2]
                });
                
            expect(n.transitions).toEqual([transition1, transition2]);
            expect(n.nodes).toEqual([node1, node2]);
        });
        
        it('should define a nodes and a transitions property as arrays when they are not specified', function ()
        {
            var  n = new k.data.Node({});
                
            expect(n.transitions).toBeInstanceOf(Array);
            expect(n.nodes).toBeInstanceOf(Array);
        });
        
        it('should accept a name property', function ()
        {
            var  n = new k.data.Node({name: 'Test'});
                
            expect(n.name).toBe('Test');
        });
    });
    
    describe('getIdentity', function ()
    {
        it('should return a string value unique when I have more than one node', function ()
        {
            var n1 = new k.data.Node({}),
                n2 = new k.data.Node({});
                
            expect(n1.getIdentity()).not.toEqual(n2.getIdentity());
        });
        
        it('should return always the same id', function ()
        {
            var n = new k.data.Node({});
            
            var firstId = n.getIdentity();
            
            expect(n.getIdentity()).toBe(firstId);
            expect(n.getIdentity()).toBe(firstId);
            expect(n.getIdentity()).toBe(firstId);
            expect(n.getIdentity()).toBe(firstId);
        });
    });
    
    describe('addTransition', function ()
    {
        it('should save the new value in the list of transitions', function ()
        {
            var n = new k.data.Node({});
            
            expect(n.transitions.length).toBe(0);
            
            n.addTransition(12,'Hola');
            expect(n.transitions.length).toBe(1);
            expect(n.transitions[0].transitionValue).toBe(12);
            expect(n.transitions[0].node).toBe('Hola');
        });
    });
});
/* global expect: true, describe: true, it:  true, beforeEach: true, k:true */
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
/* global expect: true, describe: true, it:  true, beforeEach: true, k: true, sampleGrammars: true */
'use strict';

describe('Lexer', function ()
{
	describe('constructor', function ()
	{
		it ('should ignore spaces by default', function() {
             var lexer = new k.lexer.Lexer({
				grammar: sampleGrammars.idsList.g,
				stream: ''
             });
             expect(lexer.options.notIgnoreSpaces).toBe(false);
        });

        it ('should manage spaces as specified', function() {
            var lexer = new k.lexer.Lexer({
				grammar: sampleGrammars.idsList,
				stream: '',
                notIgnoreSpaces: true
            });
            expect(lexer.options.notIgnoreSpaces).toBe(true);
        });
	});

    describe('getNext', function()
    {
        it ('should return EOF if the only string remaining is enter and IgnoreNewLines is true', function ()
        {
            var lexer = new k.lexer.Lexer({
				grammar: sampleGrammars.idsList.g,
				notIgnoreSpaces: true,
				stream: '\n'
            });

            var result = lexer.getNext();

			expect(result.length).toBe(-1);
            expect(result.terminal).toBeInstanceOf(k.data.Symbol);
            expect(result.terminal.isSpecial).toBe(true);
            expect(result.terminal.name).toBe(k.data.specialSymbol.EOF);
        });

        it ('should left trim the input after reading a valid input if ignore spaced is specified', function()
        {
            var lexer = new k.lexer.Lexer({
				grammar: sampleGrammars.idsList.g,
				stream: '(  THIS IS A TEST) '
            });

            lexer.getNext();
            expect(lexer.inputStream).toBe('THIS IS A TEST) ');

            lexer.getNext();
            expect(lexer.inputStream).toBe('IS A TEST) ');
        });

        it ('should return EOF if there is no more input to process (ignore spaces equals true)', function()
        {
            var lexer = new k.lexer.Lexer({
				grammar: sampleGrammars.idsList.g,
				stream: ''
            });

            var result = lexer.getNext();

			expect(result.length).toBe(-1);
            expect(result.terminal).toBeInstanceOf(k.data.Symbol);
            expect(result.terminal.isSpecial).toBe(true);
            expect(result.terminal.name).toBe(k.data.specialSymbol.EOF);
        });

        it ('should return EMPTY if the only remaining string is "" and not ignoring spaced is false and there are rule with empty', function ()
        {
        	var sort = new k.data.Rule({
                    head: 'sort'
				}),
				grammar = new k.data.Grammar({
					startSymbol: sort.head,
					rules: [sort]
				}),
				lexer = new k.lexer.Lexer({
					grammar: grammar,
					notIgnoreSpaces: true,
					notIgnoreNewLines: true,
					stream: ''
                });

            var result = lexer.getNext();

            expect(result.length).toBe(0);
            expect(result.string).toBe('');
            expect(result.terminal.name).toBe('EMPTY');

        });

        it ('should return EOF if the only remaining string is "" and DO ignore spaced and there are rules with empty', function ()
        {
        	var sort = new k.data.Rule({
                    head: 'sort'
				}),
				grammar = new k.data.Grammar({
					startSymbol: sort.head,
					rules: [sort]
				}),
				lexer = new k.lexer.Lexer({
					grammar: grammar,
					stream: ''
                });

            var result = lexer.getNext();

            expect(result.length).toBe(-1);
            expect(result.string).toBeUndefined();
            expect(result.terminal.name).toBe('EOF');
            expect(result.error).toBeUndefined();
        });

        it ('should return the larget possible match when regexp', function()
        {
            var init = new k.data.Rule({
                    head: 'init',
                    tail: k.data.NonTerminal.fromArray(['short','large'])
				}),
            	short = new k.data.Rule({
                    head: 'short',
                    tail: [new k.data.Terminal({name:'SHORT_TERMINAL', body: /hel/})]
				}),
				large = new k.data.Rule({
					head: 'large',
					tail: [new k.data.Terminal({name:'LARGE_TERMINAL', body: /hello/})]
				}),
				gramar = new k.data.Grammar({
					startSymbol: init.head,
					rules:[init, short, large]
				}),
				lexer = new k.lexer.Lexer({
					grammar: gramar,
					stream: 'hello world'
				});

			var result = lexer.getNext();

			expect(result.string).toBe('hello');
			expect(result.terminal.name).toBe('LARGE_TERMINAL');
        });

        it ('should return the larget possible match when string', function()
        {
			 var init = new k.data.Rule({
                    head: 'init',
                    tail: k.data.NonTerminal.fromArray(['short','large'])
				}),
            	short = new k.data.Rule({
                    head: 'short',
                    tail: [new k.data.Terminal({name:'SHORT_TERMINAL', body: 'hel'})]
				}),
				large = new k.data.Rule({
					head: 'large',
					tail: [new k.data.Terminal({name:'LARGE_TERMINAL', body: 'hello'})]
				}),
				gramar = new k.data.Grammar({
					startSymbol: init.head,
					rules:[init, short, large]
				}),
				lexer = new k.lexer.Lexer({
					grammar: gramar,
					stream: 'hello world'
				});

			var result = lexer.getNext();

			expect(result.string).toBe('hello');
			expect(result.terminal.name).toBe('LARGE_TERMINAL');
        });

        it ('should return OPAREN, ID, ID, ID, ID, CPAREN for a simple gramar with ( THIS IS A TEST )', function()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.idsList.g,
				stream: '( THIS IS A TEST )'
            });

            var n = l.getNext();
            expect(n.string).toBe('(');
            expect(n.terminal.name).toBe('oparen_terminal');

            n = l.getNext();
            expect(n.string).toBe('THIS');
            expect(n.terminal.name).toBe('id_terminal');

            n = l.getNext();
            expect(n.string).toBe('IS');
            expect(n.terminal.name).toBe('id_terminal');

            n = l.getNext();
            expect(n.string).toBe('A');
            expect(n.terminal.name).toBe('id_terminal');

            n = l.getNext();
            expect(n.string).toBe('TEST');
            expect(n.terminal.name).toBe('id_terminal');

            n = l.getNext();
            expect(n.string).toBe(')');
            expect(n.terminal.name).toBe('cparen_terminal');
        });

        //FEARURES
        it ('should not use by default multi-matching', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.idsList.g
            });

            expect(l.useMultipleMatching).toBeFalsy();
        });

        it ('should not use by default priorities', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.idsList.g
            });

            expect(l.usePriorities).toBeFalsy();
        });

        it ('should return the most priority token and ignore the passed in valid next tokens if not using multi-matching and using priorities', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.testPrioritiesMultipleMatching.g,
				usePriorities: true,
				stream: 'this IS, A test '
            });

            var token = l.getNext(['FAIL', 'IGNORABLE', {TEST: true}, false]);

            expect(token.terminal.name).toEqual('lower_letter_terminal');
        });

        it ('should return the most priority token from the list of valid tokens when using priorities and multi-matching', function ()
        {
             var l = new k.lexer.Lexer({
				grammar: sampleGrammars.testPrioritiesMultipleMatching.g,
				usePriorities: true,
				useMultipleMatching: true,
				stream: 'this IS, A test '
            });

            var token = l.getNext(['comma_terminal', 'id_terminal']);

            expect(token.terminal.name).toEqual('id_terminal');
            expect(token.string).toEqual('this');
        });

        it ('should return the first defined matching token although its priority is lowen then other matching token when not using priorities', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.testPrioritiesMultipleMatching.g,
				usePriorities: false,
				stream: 'this IS, A test '
            });

            var token = l.getNext(['FAIL', 'IGNORABLE']);

            expect(token.terminal.name).toEqual('id_terminal');
        });

        it ('should return the most priority token when using priorities and more than one token match', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.testPrioritiesMultipleMatching.g,
				usePriorities: true,
				stream: 'this IS, A test '
            });

            var token = l.getNext();

            expect(token.terminal.name).toEqual('lower_letter_terminal');
        });

        // ERRORS
        it ('should return ERROR if using multi-matching and there is no match in the input Stream', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.testPrioritiesMultipleMatching.g,
				usePriorities: false,
				useMultipleMatching: true,
				stream: ': '
            });

            var token = l.getNext(['comma_terminal', 'fake_termianl']);

            expect(token.error).toBeTruthy();
            expect(token.length).toEqual(-1);
        });

        it ('should return ERROR if using multi-matching and there is no match with the list of passed in valid tokens', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.testPrioritiesMultipleMatching.g,
				usePriorities: true,
				useMultipleMatching: true,
				stream: 'this IS, A test '
            });

            var token = l.getNext(['comma_terminal', 'fake_termianl']);

            expect(token.error).toBeTruthy();
            expect(token.length).toEqual(-1);
        });

        it ('should return ERROR if not matching is found and priorities is being used', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.testPrioritiesMultipleMatching.g,
				usePriorities: true,
				useMultipleMatching: false,
				stream: ': '
            });

            var token = l.getNext();

            expect(token.error).toBeTruthy();
        });

        it ('should return ERROR if the string contains enters, the grammar does not support it and notIgnoreNewLines IS true', function ()
        {
            var short = new k.data.Rule({
                    head: 'short',
                    tail: [new k.data.Terminal({name:'hi', body: 'hi'})]
				}),
				grammar = new k.data.Grammar({
					startSymbol: short.head,
					rules: [short]
				}),
				lexer = new k.lexer.Lexer({
					grammar: grammar,
					notIgnoreSpaces: true,
					notIgnoreNewLines: true,
					stream: '\nfin'
                });

            var result = lexer.getNext();

            expect(result.length).toBe(-1);
            expect(result.string).toBe('\nfin');
            expect(result.terminal).toBeUndefined();
            expect(result.error).toBeDefined();
        });

        it ('should return ERROR if the only remaining string is "" and not ignoring spaced and there are NOT rule with empty', function ()
        {
        	var short = new k.data.Rule({
                    head: 'short',
                    tail: [new k.data.Terminal({name:'hi', body: 'hi'})]
				}),
				grammar = new k.data.Grammar({
					startSymbol: short.head,
					rules: [short]
				}),
				lexer = new k.lexer.Lexer({
					grammar: grammar,
					notIgnoreSpaces: true,
					notIgnoreNewLines: true,
					stream: ''
                });

            var result = lexer.getNext();

            expect(result.length).toBe(-1);
            expect(result.string).toBe('');
            expect(result.terminal).toBeUndefined();
            expect(result.error).toBeDefined();
        });

        it ('should return ERROR if the current input do NOT match any terminal NOT ignoring paces', function ()
        {
        	var sort = new k.data.Rule({
                    head: 'sort',
                    tail: [new k.data.Terminal({name:'hi', body: 'hi'})]
				}),
				grammar = new k.data.Grammar({
					startSymbol: sort.head,
					rules: [sort]
				}),
				lexer = new k.lexer.Lexer({
					grammar: grammar,
					notIgnoreSpaces: true,
					stream: 'not match'
                });

            var result = lexer.getNext();

            expect(result.length).toBe(-1);
            expect(result.string).toBe('not match');
            expect(result.terminal).toBeUndefined();
            expect(result.error).toBeDefined();
        });

        it ('should return ERROR if the current input do NOT match any terminal ignoring paces', function ()
        {
        	var sort = new k.data.Rule({
                    head: 'sort',
                    tail: [new k.data.Terminal({name:'hi', body: 'hi'})]
				}),
				grammar = new k.data.Grammar({
					startSymbol: sort.head,
					rules: [sort]
				}),
				lexer = new k.lexer.Lexer({
					grammar: grammar,
					notIgnoreSpaces: false,
					stream: 'not match'
                });

            var result = lexer.getNext();

            expect(result.length).toBe(-1);
            expect(result.string).toBe('not match');
            expect(result.terminal).toBeUndefined();
            expect(result.error).toBeDefined();
        });

        it ('should say line number 0 in the case of error when the error is in the line 0', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.testSucceeded.g,
				stream: 'xtest test\ntest\ntest'
            });

            var result = l.getNext();

            expect(result.error).toBeTruthy();
            expect(result.line).toBe(0);
            expect(result.character).toBe(0);
            expect(result.string).toEqual('xtest test\ntest\ntest');
        });

        it ('should say line number 3 in the case of error when the error is in the line 3 (even if a valid token contains enter)', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.testSucceededEnter.g,
				stream: 'te\nst te\nst \n te\nXst'
            });

            var result = l.getNext();   // first valid 'test'
            result = l.getNext();       // second valid 'test'
            result = l.getNext();

            expect(result.error).toBeTruthy();
            expect(result.line).toBe(3);
            expect(result.character).toBe(1);
            expect(result.string).toEqual('te\nXst');
        });

        it ('should say line number 2 in the case of error when the error is in the line 2', function ()
        {
            var l = new k.lexer.Lexer({
				grammar: sampleGrammars.testSucceeded.g,
				stream: 'test test\ntest\nxtest'
            });

            var result = l.getNext();   // first valid 'test'
            result = l.getNext();       // second valid 'test'
            result = l.getNext();       // third valid 'test'
            result = l.getNext();

            expect(result.error).toBeTruthy();
            expect(result.line).toBe(2);
            expect(result.character).toBe(0);
            expect(result.string).toEqual('xtest');
        });

    });
});
/* global spyOn:true, expect: true, describe: true, it:  true, beforeEach: true, k: true, sampleGrammars: true */

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
						index: 0,
						tail:[]
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
						tail:[]
					}
				},
				items = [new k.data.ItemRule(expectedResultOptions)],
				s = new k.data.State({
					items: []
				});

			s.addItems(items);

			var result = s.getNextItem();

			expect(result).toBe(items[0]);
		});

		it('shoud never return the same item twise', function()
		{
			var expectedResultOptions = {
					rule: {
						index: 0,
						tail:[]
					}
				},
				items = [new k.data.ItemRule(expectedResultOptions)],
				s = new k.data.State({});

			s.addItems(items);
			s.addItems(items); //when adding the same without change multi-times or
			items[0].lookAhead = ['test'];
			s.addItems(items); //when adding the same with changes multi-times

			var result = s.getNextItem();
			expect(result).toBe(items[0]);

			result = s.getNextItem();
			expect(result).toBeFalsy();
			result = s.getNextItem();
			expect(result).toBeFalsy();
			result = s.getNextItem();
			expect(result).toBeFalsy();
		});

		it('should return the items added in the constructor', function ()
		{
			var item1 = new k.data.ItemRule({
					rule: sampleGrammars.selectedBs.L1
				}),
				item2 = new k.data.ItemRule({
					rule: sampleGrammars.selectedBs.L1
				}),
				s = new k.data.State({
					items: [item1,item2]
				});

			var result = s.getNextItem();
			expect(result).toBe(item1);

			result = s.getNextItem();
			expect(result).toBe(item2);

			expect(s.getNextItem()).toBeUndefined();
		});
	});

	describe('addItems', function()
	{
		it('should add an item into the state if it is new', function()
		{
			var s = new k.data.State({}),
				item = new k.data.ItemRule({
					rule: {
						index: 0,
						tail:[]
					}
				});

			s.addItems([item]);
			var items_result = s.getOriginalItems();

			expect(items_result).toBeDefined();
			expect(items_result.length).toBe(1);
			expect(items_result[0]).toBe(item);
		});

		it('should not add an item into the state if it is duplicated', function()
		{
			var items = [new k.data.ItemRule({
					rule: {
						index:0,
						tail:[]
					}
				})],
				s = new k.data.State({
					items: items
				}),
				item = new k.data.ItemRule({
						rule: {
							index: 0,
							tail:[]
						}
					});

			s.addItems([item]);
			var items_result = s.getOriginalItems();
			expect(items_result.length).toBe(1);
			expect(items_result[0]).toBe(items[0]);
		});

		it('should get available the added item to the getNextItem method', function()
		{
			var s = new k.data.State({}),
				item = new k.data.ItemRule({
						rule: {
							index: 0,
							tail:[]
						}
					});

			s.addItems([item]);
			var result = s.getNextItem();
			expect(result).toBe(item);
		});

		it('should merge lookAhead by default', function ()
		{
			var s = new k.data.State({}),
				item1 = new k.data.ItemRule({
					rule: sampleGrammars.selectedBs.L1
				}),
				item2 = new k.data.ItemRule({
					rule: sampleGrammars.selectedBs.L1
				});

			item1.lookAhead = [{name:1}, {name:2}];
			item2.lookAhead = [{name:1}, {name:3}];

			s.addItems([item1]);
			s.addItems([item2]);

			var result = s.getOriginalItems();

			expect(result).toEqual(jasmine.any(Array));
			expect(result.length).toBe(1);
			expect(result[0].lookAhead).toEqual([{name:1},{name:2},{name:3}]);
		});

		it('should NOT merge lookAhead if specified', function ()
		{
			var s = new k.data.State({}),
				item1 = new k.data.ItemRule({
					rule: sampleGrammars.selectedBs.L1
				}),
				item2 = new k.data.ItemRule({
					rule: sampleGrammars.selectedBs.L1
				});

			item1.lookAhead = [];
			item2.lookAhead = [{name:1}, {name:3}];

			s.addItems([item1], {notMergeLookAhead:true});
			s.addItems([item2], {notMergeLookAhead:true});

			var result = s.getOriginalItems();

			expect(result).toEqual(jasmine.any(Array));
			expect(result.length).toBe(1);
			expect(result[0].lookAhead).toEqual([]);
		});

		it('should add items into the unprocessed list just the the item is not already there', function ()
		{
			var s = new k.data.State({}),
				item1 = new k.data.ItemRule({
					rule: sampleGrammars.selectedBs.L1
				});

			s.addItems([item1]);
			s.addItems([item1]);
			s.addItems([item1]);
			s.addItems([item1]);
			s.addItems([item1]);
			s.addItems([item1]);

			var result = s.getNextItem();
			expect(result).toBe(item1);
			expect(s.getNextItem()).toBeUndefined();
			expect(s.getNextItem()).toBeUndefined();
			expect(s.getNextItem()).toBeUndefined();
		});

		it('should add items into the unprocessed list just the the new item add changes in the lookAhead', function ()
		{
			var s = new k.data.State({}),
				item1 = new k.data.ItemRule({
					rule: sampleGrammars.selectedBs.L1
				}),
				item2 = new k.data.ItemRule({
					rule: sampleGrammars.selectedBs.L1
				});

			item1.lookAhead = [];
			s.addItems([item1]);

			var result = s.getNextItem();
			expect(result).toBe(item1);
			expect(s.getNextItem()).toBeUndefined();

			item2.lookAhead = [{name:1}, {name:3}];
			s.addItems([item2]);

			//the returned instance is NOT GUARANTY that was the first or the second one!
			result = s.getNextItem();
			expect(result.options).toEqual(item2.options);
			expect(s.getNextItem()).toBeUndefined();

		});
	});

	describe('getIdentity', function()
	{
		it('should return null if the state does not have any rule', function()
		{
			var s = new k.data.State({});

			expect(k.utils.str.startsWith(s.getIdentity(), 'node_')).toBe(true);
		});

		it('should NOT returns always the same regardless if its item where updated', function()
		{
			var s = new k.data.State({
				items: [new k.data.ItemRule({
						rule: {
							index: 0,
							tail:[]
						}
					}),
					new k.data.ItemRule({
						rule: {
							index: 1,
							tail:[]
						}
					})
				]
			});

			var result = s.getIdentity();
			expect(result).toEqual('0(0)1(0)');

			s.addItems([new k.data.ItemRule({
				rule: {
					index: 2,
					tail:[]
				}
			})]);

			var id2 = s.getIdentity();

			expect(result).not.toBe(id2);
			expect(id2).toEqual('0(0)1(0)2(0)');
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
			expect(items2[0]).toBeInstanceOf(k.data.ItemRule);
			expect(items2[0].getIdentity()).toEqual(item.getIdentity());
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
						index: 0,
						tail:[]
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
						index: 0,
						tail:[]
					}
				}),
				item2 = new k.data.ItemRule({
					rule: {
						index: 1,
						tail:[]
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
						index: 0,
						tail:[]
					}
				}),
				item2 = new k.data.ItemRule({
					rule: {
						index: 1,
						tail:[]
					}
				}),
				item3 = new k.data.ItemRule({
					rule: {
						index: 1,
						tail:[]
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

	describe('getCondencedString', function ()
	{
		it('should return 1-5 when having only two rules with that indexes', function ()
		{
			var items = [
				new k.data.ItemRule(
				{
					rule: {
						index: 1,
						tail:[]
					}
				}),
				new k.data.ItemRule(
				{
					rule: {
						index: 5,
						tail:[]
					}
				})
				],
				s = new k.data.State({
					items: items
				});

			expect(s.getCondencedString()).toEqual('1-5');
		});

		it('should return 0-15 when having only two rules with that indexes in inverse order', function ()
		{
			var items = [
				new k.data.ItemRule(
				{
					rule: {
						index: 15,
						tail:[]
					}
				}),
				new k.data.ItemRule(
				{
					rule: {
						index: 0,
						tail:[]
					}
				})
				],
				s = new k.data.State({
					items: items
				});

			expect(s.getCondencedString()).toEqual('0-15');
		});

		it('should calculate the result only once', function ()
		{
			var items = [
				new k.data.ItemRule(
				{
					rule: {
						index: 15,
						tail:[]
					}
				}),
				new k.data.ItemRule(
				{
					rule: {
						index: 0,
						tail:[]
					}
				})
				],
				s = new k.data.State({
					items: items
				});

			expect(s.getCondencedString()).toEqual('0-15');

			items[1].rule.index = 33;

			expect(s.getCondencedString()).toEqual('0-15');
		});
	});

	describe('getOriginalItems', function ()
	{
		it('should return an empty array if there are no item', function ()
		{
			var s = new k.data.State({});

			expect(s.getOriginalItems().length).toBe(0);
		});

		it('should return the item added into the state', function ()
		{
			var s = new k.data.State({
				items: k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])
			});

			expect(s.getOriginalItems().length).toBe(1);

			s.addItems(k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2]));

			expect(s.getOriginalItems().length).toBe(2);
		});

		it('should return the original items', function ()
		{
			var items = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1]),
				s = new k.data.State({
					items: items
				});

			expect(s.getOriginalItems().length).toBe(1);
			expect(s.getOriginalItems()[0]).toBe(items[0]);
		});
	});

	describe('getRecudeItems', function ()
	{
		it('should return empty array the state has not reduce item', function ()
		{
			var shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [shiftItem]
				});

			expect(state.getRecudeItems()).toEqual([]);
		});

		it('shoudl return empty id the state has no item rule', function ()
		{
			var state = new k.data.State({});

			expect(state.getRecudeItems()).toEqual([]);
		});

		it('should have one item if the state has one reduce item', function ()
		{
			var reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				state = new k.data.State({
					items: [reduceItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);

			expect(state.getRecudeItems()).toEqual([reduceItem]);
		});
	});

	describe('getOriginalItemById', function ()
	{
		it('should return undefined when te item is not present in the state', function()
		{
			var s = new k.data.State({});

			expect(s.getOriginalItemById('1(0)')).toBeUndefined();
		});

		it('should return the item rule specified when it is present', function()
		{
			var items = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1]),
				s = new k.data.State({
					items: items
				});

			expect(s.getOriginalItemById(items[0].getIdentity())).toBe(items[0]);
		});
	});
});
/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true, k: true, sampleGrammars: true */
'use strict';

describe('Automata LR Generator Base', function ()
{
	describe('constructor', function()
	{
		it('requires an options parameter', function()
		{
			expect(function() { return new k.parser.AutomataLRGeneratorBase(); }).toThrow();
		});

		it('requires an options parameter with a grammar in it', function()
		{
			expect(function() { return new k.parser.AutomataLRGeneratorBase({}); }).toThrow();
		});

		it('should save the passed in options', function()
		{
			var options = {
					grammar: sampleGrammars.idsList.g
				},
				ag = new k.parser.AutomataLRGeneratorBase(options);

			expect(ag.options).toBe(options);
		});
	});

	describe('generateGOTOTable', function ()
	{
		it('should return the expected table for the simple LR0 grammar a+b', function ()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				automata = ag.generateAutomata(),
				gotoTable = ag.generateGOTOTable(automata);

			expect(gotoTable).toEqual(jasmine.any(Object));
			expect(gotoTable['0(1)']).toEqual(jasmine.any(Object));

			var keys = k.utils.obj.keys(gotoTable);

			expect(k.utils.obj.indexOf(keys, '0(0)1(0)2(0)') >= 0).toBe(true);
			expect(k.utils.obj.indexOf(keys, '2(1)') >= 0).toBe(true);
			expect(k.utils.obj.indexOf(keys, '1(1)1(0)2(0)') >= 0).toBe(true);
			expect(k.utils.obj.indexOf(keys, '1(2)') >= 0).toBe(true);
			expect(k.utils.obj.indexOf(keys, '0(1)') >= 0).toBe(true);
			expect(k.utils.obj.indexOf(keys, 'AcceptanceState') >= 0).toBe(true);
		});

		it('should return a table with only two entries when having a simple automata with only two transitions', function ()
		{
			var automata = new k.data.Automata({}),
				automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				state1 = new k.data.State({name:'state1'}),
				state2 = new k.data.State({name:'state2'});

			automata.addState(state1);
			automata.addState(state2);
			state1.addTransition('to2', state2);
			state2.addTransition('to1', state1);

			var gotoTable = automataGenerator.generateGOTOTable(automata);

			expect(gotoTable.state1).toBeDefined();
			expect(gotoTable.state2).toBeDefined();

			expect(k.utils.obj.keys(gotoTable.state1).length).toBe(1);
			expect(gotoTable.state1.to2).toBe(state2);

			expect(k.utils.obj.keys(gotoTable.state2).length).toBe(1);
			expect(gotoTable.state2.to1).toBe(state1);
		});

		it('should return a table with only two entries when having a simple automata with moltiples entries that superpose eachother', function ()
		{
			var automata = new k.data.Automata({}),
				automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				state1 = new k.data.State({name:'state1'}),
				state2 = new k.data.State({name:'state2'});

			automata.addState(state1);
			automata.addState(state1);
			automata.addState(state1);

			automata.addState(state2);

			state1.addTransition('to2', state2);
			state1.addTransition('to2', state2);
			state1.addTransition('to2', state2);

			state2.addTransition('to1', state1);
			state2.addTransition('to1', state2);
			state2.addTransition('to1', state1);

			var gotoTable = automataGenerator.generateGOTOTable(automata);

			expect(gotoTable.state1).toBeDefined();
			expect(gotoTable.state2).toBeDefined();

			expect(k.utils.obj.keys(gotoTable.state1).length).toBe(1);
			expect(gotoTable.state1.to2).toBe(state2);

			expect(k.utils.obj.keys(gotoTable.state2).length).toBe(1);
			expect(gotoTable.state2.to1).toBe(state1);
		});
	});

	describe('isAutomataValid', function ()
	{
	    it('should return false if there is one invalid state', function()
		{
			var automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				a = new k.data.Automata({
				states: [
					{
						getIdentity: function() {
							return '1';
						},
						isValid: function ()
						{
							return false;
						}
					},
					{
						getIdentity: function() {
							return '2';
						},
						isValid: function ()
						{
							return true;
						}
					},
					{
						getIdentity: function() {
							return '3';
						},
						isValid: function ()
						{
							return true;
						}
					}
				]
			});

			expect(automataGenerator.isAutomataValid(a)).toBe(false);
		});

		it('should return false if all states are invalid', function ()
		{
			var automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				a = new k.data.Automata({
				states: [
					{
						getIdentity: function() {
							return '1';
						},
						isValid: function ()
						{
							return false;
						}
					},
					{
						getIdentity: function() {
							return '2';
						},
						isValid: function ()
						{
							return false;
						}
					},
					{
						getIdentity: function() {
							return '3';
						},
						isValid: function ()
						{
							return false;
						}
					}
				]
			});

			expect(automataGenerator.isAutomataValid(a)).toBe(false);
		});

		it('should return TRUE if the automata has no states', function ()
		{
			var automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				a = new k.data.Automata({});

			expect(automataGenerator.isAutomataValid(a)).toBe(true);
		});

		it('should return true if all states are valid', function()
		{
		    var automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				a = new k.data.Automata({
				states: [
					{
						getIdentity: function() {
							return '1';
						}
					},
					{
						getIdentity: function() {
							return '2';
						}
					},
					{
						getIdentity: function() {
							return '3';
						}
					}
				]
			});

			spyOn(automataGenerator, 'isStateValid').and.returnValue(true);
			expect(automataGenerator.isAutomataValid(a)).toBe(true);
		});

	});
});
/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true, k: true, sampleGrammars: true */
'use strict';

describe('Automata LR(0) Generator', function ()
{
	describe('expandItem', function()
	{
		function getItemByRuleName(items, ruleName)
		{
			return k.utils.obj.find(items, function(item) {
			    return (item.rule.name === ruleName);
			});
		}

		it('should duplicate a rule if the dot location differs', function ()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				initialState,
				items = k.data.ItemRule.newFromRules([sampleGrammars.aPlusb.A1]),
				state,
				itemsState;

			// Convert A --> *'a'A into A --> 'a'*A
			items[0].dotLocation++;

			initialState = new k.data.State({
				items: items
			});

			state = ag.expandItem(initialState);

			itemsState = state.getItems();

			expect(itemsState.length).toBe(3);

			var groupedItems = k.utils.obj.groupBy(itemsState, function (itemRule)
			{
				return itemRule.rule.name;
			});
			expect(groupedItems.A1RULE.length).toBe(2);
			expect(groupedItems.A2RULE.length).toBe(1);
		});

		it('should return the full state for the grammar id list rule S', function()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.idsList.g
				}),
				initialState = new k.data.State({
					items: k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.startSymbol))
				});

			var state = ag.expandItem(initialState),
				itemsState = state.getItems();

			expect(itemsState.length).toBe(3);

			var itemS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
			expect(itemS).toBeDefined();
			expect(itemS.rule).toBe(sampleGrammars.idsList.S);

			var itemOparen = getItemByRuleName(itemsState, 'OPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
			expect(itemOparen).toBeDefined();
			expect(itemOparen.rule).toBe(sampleGrammars.idsList.OPAREN);

			var itemAugment = getItemByRuleName(itemsState, 'AUGMENTRULE'); //This name is defined in all the grammars
			expect(itemAugment).toBeDefined();
		});

		it('should return the full state for the grammar id list rule S with dot Location equal 1', function()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.idsList.g
				}),
				items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.specifiedStartSymbol));

			items[0].dotLocation++;
			var initialState = new k.data.State({
					items: items
				});

			var state = ag.expandItem(initialState),
				itemsState = state.getItems();

			expect(itemsState.length).toBe(3);


			var itemS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
			expect(itemS).toBeDefined();
			expect(itemS.dotLocation).toBe(1);
			expect(itemS.rule).toBe(sampleGrammars.idsList.S);

			var itemExps1 = getItemByRuleName(itemsState, 'EXPS1RULE'); //This name is defined in the rule inside the sampleGrammar file
			expect(itemExps1).toBeDefined();
			expect(itemExps1.dotLocation).toBe(0);
			expect(itemExps1.rule).toBe(sampleGrammars.idsList.EXPS1);

			var itemExps2 = getItemByRuleName(itemsState, 'EXPS2RULE');
			expect(itemExps2).toBeDefined();
			expect(itemExps2.dotLocation).toBe(1);
			expect(itemExps2.rule).toBe(sampleGrammars.idsList.EXPS2);
		});

		it('should return the full state for the grammar id list rule S with dot Location equal 2', function()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.idsList.g
				}),
				items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.specifiedStartSymbol));

			items[0].dotLocation++;
			items[0].dotLocation++;
			var initialState = new k.data.State({
					items: items
				});

			var state = ag.expandItem(initialState),
				itemsState = state.getItems();

			expect(itemsState.length).toBe(2);


			var itemS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
			expect(itemS).toBeDefined();
			expect(itemS.dotLocation).toBe(2);
			expect(itemS.rule).toBe(sampleGrammars.idsList.S);

			var itemCparent = getItemByRuleName(itemsState, 'CPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
			expect(itemCparent).toBeDefined();
			expect(itemCparent.dotLocation).toBe(0);
			expect(itemCparent.rule).toBe(sampleGrammars.idsList.CPAREN);
		});

		it('should return the full state for the grammar id list rule S with dot Location equal 2', function()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.idsList.g
				}),
				items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(sampleGrammars.idsList.EXPS1.head));

			var initialState = new k.data.State({
					items: items
				});

			var state = ag.expandItem(initialState),
				itemsState = state.getItems();

			expect(itemsState.length).toBe(2);


			var itemExp1 = getItemByRuleName(itemsState, 'EXPS1RULE'); //This name is defined in the rule definition inside the sampleGrammar file
			expect(itemExp1).toBeDefined();
			expect(itemExp1.dotLocation).toBe(0);
			expect(itemExp1.rule).toBe(sampleGrammars.idsList.EXPS1);

			var itemExp2 = getItemByRuleName(itemsState, 'EXPS2RULE'); //This name is defined in the rule inside the sampleGrammar file
			expect(itemExp2).toBeDefined();
			expect(itemExp2.dotLocation).toBe(1);
			expect(itemExp2.rule).toBe(sampleGrammars.idsList.EXPS2);
		});
	});

	describe('generateAutomata', function()
	{
		function findStateById(states, id)
		{
			return k.utils.obj.find(states, function(state) {
				return state.getIdentity() === id;
			});
		}

		function validateState(states, stateId, expectedItemsLength, lookAhead)
		{
			var state = findStateById(states, stateId);
			expect(state).toBeDefined();
			expect(state).not.toBe(null);
			expect(state.getItems().length).toBe(expectedItemsLength);
			k.utils.obj.each(k.utils.obj.keys(lookAhead), function (itemRuleId)
			{
				 var itemRule = state.getOriginalItemById(itemRuleId);
				 expect(lookAhead[itemRuleId].length).toBe(itemRule.lookAhead.length);

				k.utils.obj.each(lookAhead[itemRuleId], function (expectedLookAhead)
				{
				 	var lookAheadFound = !!k.utils.obj.find(itemRule.lookAhead, function (symbol)
					{
						return symbol.name === expectedLookAhead;
					});

					expect(lookAheadFound).toBe(true);
				});
			});
		}

		it('should return the correct automata for the simple grammar num divs', function ()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.numDivs.g
				}),
				result = ag.generateAutomata({notValidate:true}),
				states = result.states;

			expect(result.hasLookAhead).toBe(false);

			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(9);

			validateState(states, '0(0)1(0)2(0)3(0)5(0)', 5);
			validateState(states, '1(1)2(1)4(0)', 3);
			validateState(states, '2(2)5(0)', 2);
			validateState(states, '2(3)', 1);
			validateState(states, '3(1)', 1);
			validateState(states, '4(1)', 1);
			validateState(states, '5(1)', 1);
			validateState(states, '0(1)', 1);
			validateState(states, 'AcceptanceState', 1);
		});

		it('should return the correct automata for the simple grammar NUM DIFF', function ()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.numDiff.g
				}),
				result = ag.generateAutomata({notValidate:true}),
				states = result.states;

			expect(result.hasLookAhead).toBe(false);

			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(12);

			validateState(states, '0(0)1(0)2(0)3(0)4(0)5(0)6(0)', 7);
			validateState(states, '2(0)3(0)4(0)5(1)5(0)6(1)6(0)', 7);
			validateState(states, '2(2)4(0)5(0)6(0)', 4);
			validateState(states, '2(1)5(2)7(0)8(0)', 4);
			validateState(states, '1(1)2(1)8(0)', 3);
			validateState(states, '5(3)7(1)', 2);
			validateState(states, '2(3)', 1);
			validateState(states, '3(1)', 1);
			validateState(states, '4(1)', 1);
			validateState(states, '8(1)', 1);
			validateState(states, '0(1)', 1);
			validateState(states, 'AcceptanceState', 1);
		});

		it('should return the correct automata for the simple grammar A+B', function ()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				result = ag.generateAutomata({notValidate:true}),
				states = result.states;

			expect(result.hasLookAhead).toBe(false);

			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(6);

			validateState(states, '0(0)1(0)2(0)', 3);
			validateState(states, '1(1)1(0)2(0)', 3);
			validateState(states, '2(1)', 1);
			validateState(states, '0(1)', 1);
			validateState(states, '1(2)', 1);
			validateState(states, 'AcceptanceState',1);
		});

		it('should return the correct automata for the simple grammar a^(n+1)b^(n)', function ()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.aPowN1b.g
				}),
				result = ag.generateAutomata({notValidate:true}),
				states = result.states;

			expect(result.hasLookAhead).toBe(false);

			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(9);

			validateState(states, '0(0)1(0)2(0)3(0)', 4);
			validateState(states, '2(1)2(0)3(1)3(0)', 4);
			validateState(states, '2(2)', 1);
			validateState(states, '2(3)', 1);
			validateState(states, '0(1)', 1);
			validateState(states, '4(1)', 1);
			validateState(states, '1(2)', 1);
			validateState(states, '1(1)4(0)', 2);

			validateState(states, 'AcceptanceState', 1);
		});

		it('should return the correct automata for the simple grammar Condenced num Diff', function ()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.numDiffCondenced.g
				}),
				result = ag.generateAutomata({notValidate:true}),
				states = result.states;

			expect(result.hasLookAhead).toBe(false);

			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(11);

			validateState(states, '0(0)1(0)2(0)3(0)4(0)5(0)', 6);
			validateState(states, '0(1)', 1);
			validateState(states, '1(1)2(1)', 2);
			validateState(states, '3(1)', 1);
			validateState(states, '4(1)', 1);
			validateState(states, '2(0)3(0)4(0)5(1)5(0)', 5);
			validateState(states, '2(2)4(0)5(0)', 3);
			validateState(states, '2(1)5(2)', 2);
			validateState(states, '2(3)', 1);
			validateState(states, '5(3)', 1);
			validateState(states, 'AcceptanceState', 1);
		});
	});

	describe('generateACTIONTable', function ()
	{
		it('should return the expected action function for the simple LR0 grammar a+b', function ()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				automata = ag.generateAutomata({notValidate:true}),
				actionTable = ag.generateACTIONTable(automata);

			expect(actionTable).toEqual(jasmine.any(Function));

			expect(actionTable('0(1)').action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('1(1)1(0)2(0)').action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('0(0)1(0)2(0)').action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('2(1)').action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('2(1)').rule.name).toEqual(sampleGrammars.aPlusb.A2.name);

			expect(actionTable('1(2)').action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('1(2)').rule.name).toEqual(sampleGrammars.aPlusb.A1.name);

			expect(actionTable('AcceptanceState').action).toEqual(k.parser.tableAction.ACCEPT);
		});

		it('should return the expected action function for the simple LR0 grammar selectedBs', function ()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.selectedBs.g
				}),
				automata = ag.generateAutomata(),
				actionTable = ag.generateACTIONTable(automata);

			expect(actionTable).toEqual(jasmine.any(Function));

			expect(actionTable('0(0)1(0)2(0)').action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('0(1)').action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('1(0)2(0)4(2)').action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('1(0)2(1)2(0)3(0)4(0)').action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('1(1)').action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('1(1)').rule.name).toEqual(sampleGrammars.selectedBs.S1.name);

			expect(actionTable('2(2)4(1)').action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable('2(3)').action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('2(3)').rule.name).toEqual(sampleGrammars.selectedBs.S2.name);

			expect(actionTable('3(1)').action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('3(1)').rule.name).toEqual(sampleGrammars.selectedBs.L1.name);

			expect(actionTable('4(3)').action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable('4(3)').rule.name).toEqual(sampleGrammars.selectedBs.L2.name);

			expect(actionTable('AcceptanceState').action).toEqual(k.parser.tableAction.ACCEPT);

			expect(actionTable('0(1)1(0)2(0)').action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('0(4)').action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('1(2)2(0)').action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('5(0)').action).toEqual(k.parser.tableAction.ERROR);
			expect(actionTable('2(0)4(4)').action).toEqual(k.parser.tableAction.ERROR);
		});

	});

	describe('isStateValid', function ()
	{
		it('should return true if the state does not have any reduce item', function()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				item1 = new k.data.ItemRule(
				{
					rule: {
						index: 1,
						tail:[]
					}
				}),
				item2 = new k.data.ItemRule(
				{
					rule: {
						index: 5,
						tail:[]
					}
				}),
				s = new k.data.State({
					items: [item1, item2]
				});

			spyOn(item1, 'isReduce').and.returnValue(false);
			spyOn(item2, 'isReduce').and.returnValue(false);

			expect(ag.isStateValid(s)).toBe(true);
		});

		it('should return true if the state has just one reduce item without lookAhead', function()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				item1 = new k.data.ItemRule(
				{
					rule: {
						index: 1,
						tail:[]
					}
				}),
				s = new k.data.State({
					items: [item1]
				});

			spyOn(item1, 'isReduce').and.returnValue(true);

			expect(ag.isStateValid(s)).toBe(true);
		});

		it('should return false if it has two reduce items without look-ahead', function()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				item1 = new k.data.ItemRule(
				{
					rule: {
						index: 1,
						tail:[]
					}
				}),
				item2 = new k.data.ItemRule(
				{
					rule: {
						index: 5,
						tail:[]
					}
				}),
				s = new k.data.State({
					items: [item1, item2]
				});

			spyOn(item1, 'isReduce').and.returnValue(true);
			spyOn(item2, 'isReduce').and.returnValue(true);

			expect(ag.isStateValid(s)).toBe(false);
		});

		it('should return false if it has one reduce item and one shift item without look-ahead', function()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				item1 = new k.data.ItemRule(
				{
					rule: {
						index: 1,
						tail:[]
					}
				}),
				item2 = new k.data.ItemRule(
				{
					rule: {
						index: 5,
						tail:[]
					}
				}),
				s = new k.data.State({
					items: [item1, item2]
				});

			spyOn(item1, 'isReduce').and.returnValue(false);
			spyOn(item2, 'isReduce').and.returnValue(true);

			expect(ag.isStateValid(s)).toBe(false);
		});
	});
});
/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true, k:true, sampleGrammars: ture */
'use strict';

describe('Automata LALR(1) Generator', function ()
{
	describe('expandItem', function()
	{
		function getItemByRuleName(items, ruleName)
		{
			return k.utils.obj.find(items, function(item) {
				return (item.rule.name === ruleName);
			});
		}

		it('should duplicate a rule if the dot location differs', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				initialState,
				items = k.data.ItemRule.newFromRules([sampleGrammars.aPlusb.A1]),
				state,
				itemsState;

			// Convert A --> *'a'A into A --> 'a'*A
			items[0].dotLocation++;

			initialState = new k.data.State({
				items: items
			});

			state = ag.expandItem(initialState);

			itemsState = state.getItems();

			expect(itemsState.length).toBe(3);

			var groupedItems = k.utils.obj.groupBy(itemsState, function (itemRule)
			{
				return itemRule.rule.name;
			});
			expect(groupedItems.A1RULE.length).toBe(2);
			expect(groupedItems.A2RULE.length).toBe(1);
		});

		it('should return the full state for the grammar id list rule S', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.idsList.g
				}),
				initialState = new k.data.State({
					items: k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.startSymbol))
				});

			var state = ag.expandItem(initialState),
				itemsState = state.getItems();

			expect(itemsState.length).toBe(3);

			var itemS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
			expect(itemS).toBeDefined();
			expect(itemS.rule).toBe(sampleGrammars.idsList.S);

			var itemOparen = getItemByRuleName(itemsState, 'OPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
			expect(itemOparen).toBeDefined();
			expect(itemOparen.rule).toBe(sampleGrammars.idsList.OPAREN);

			var itemAugment = getItemByRuleName(itemsState, 'AUGMENTRULE'); //This name is defined in all the grammars
			expect(itemAugment).toBeDefined();
		});

		it('should return the full state for the grammar id list rule S with dot Location equal 1', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.idsList.g
				}),
				items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.specifiedStartSymbol));

			items[0].dotLocation++;
			var initialState = new k.data.State({
					items: items
				});

			var state = ag.expandItem(initialState),
				itemsState = state.getItems();

			expect(itemsState.length).toBe(3);


			var itemS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
			expect(itemS).toBeDefined();
			expect(itemS.dotLocation).toBe(1);
			expect(itemS.rule).toBe(sampleGrammars.idsList.S);

			var itemExps1 = getItemByRuleName(itemsState, 'EXPS1RULE'); //This name is defined in the rule inside the sampleGrammar file
			expect(itemExps1).toBeDefined();
			expect(itemExps1.dotLocation).toBe(0);
			expect(itemExps1.rule).toBe(sampleGrammars.idsList.EXPS1);

			var itemExps2 = getItemByRuleName(itemsState, 'EXPS2RULE');
			expect(itemExps2).toBeDefined();
			expect(itemExps2.dotLocation).toBe(1);
			expect(itemExps2.rule).toBe(sampleGrammars.idsList.EXPS2);
		});

		it('should return the full state for the grammar id list rule S with dot Location equal 2', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.idsList.g
				}),
				items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(ag.grammar.specifiedStartSymbol));

			items[0].dotLocation++;
			items[0].dotLocation++;
			var initialState = new k.data.State({
					items: items
				});

			var state = ag.expandItem(initialState),
				itemsState = state.getItems();

			expect(itemsState.length).toBe(2);


			var itemS = getItemByRuleName(itemsState, 'SRULE'); //This name is defined in the rule definition inside the sampleGrammar file
			expect(itemS).toBeDefined();
			expect(itemS.dotLocation).toBe(2);
			expect(itemS.rule).toBe(sampleGrammars.idsList.S);

			var itemCparent = getItemByRuleName(itemsState, 'CPARENRULE'); //This name is defined in the rule inside the sampleGrammar file
			expect(itemCparent).toBeDefined();
			expect(itemCparent.dotLocation).toBe(0);
			expect(itemCparent.rule).toBe(sampleGrammars.idsList.CPAREN);
		});

		it('should return the full state for the grammar id list rule S with dot Location equal 2', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.idsList.g
				}),
				items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(sampleGrammars.idsList.EXPS1.head));

			var initialState = new k.data.State({
					items: items
				});

			var state = ag.expandItem(initialState),
				itemsState = state.getItems();

			expect(itemsState.length).toBe(2);


			var itemExp1 = getItemByRuleName(itemsState, 'EXPS1RULE'); //This name is defined in the rule definition inside the sampleGrammar file
			expect(itemExp1).toBeDefined();
			expect(itemExp1.dotLocation).toBe(0);
			expect(itemExp1.rule).toBe(sampleGrammars.idsList.EXPS1);

			var itemExp2 = getItemByRuleName(itemsState, 'EXPS2RULE'); //This name is defined in the rule inside the sampleGrammar file
			expect(itemExp2).toBeDefined();
			expect(itemExp2.dotLocation).toBe(1);
			expect(itemExp2.rule).toBe(sampleGrammars.idsList.EXPS2);
		});

		it('should propagate all lookAhead when the rule that generate the lookAhead come last', function ()
		{
			var sourceElements_NT = new k.data.NonTerminal({name: 'sourceElements'}),
				sourceElement_NT = new k.data.NonTerminal({name: 'sourceElement'}),
				statement_NT = new k.data.NonTerminal({name: 'statement'}),
				block_NT = new k.data.NonTerminal({name: 'block'}),

				LBRACE = new k.data.Terminal({name:'lbrace_terminal', body: '{'}),
				RBRACE = new k.data.Terminal({name:'rbrace_terminal', body: '}'});

			var program = new k.data.Rule({
					head: 'program',
					tail: [sourceElements_NT],
					name: 'program-sourceElements'
				}),
				/*sourceElements : sourceElement
							| sourceElements sourceElement  */
				sourceElements_sourceElement = new k.data.Rule({
					head: sourceElements_NT.name,
					tail: [sourceElement_NT],
					name: 'sourceElements-sourceElement'
				}),

				sourceElements_sourceElements_sourceElement = new k.data.Rule({
					head: sourceElements_NT.name,
					tail: [sourceElements_NT, sourceElement_NT],
					name: 'sourceElements-sourceElements-sourceElement'
				}),
				/*sourceElement: statement */
				sourceElement_statement = new k.data.Rule({
					head: sourceElement_NT.name,
					tail: [statement_NT],
					name: 'sourceElement-statement'
				}),
				statement_block = new k.data.Rule({
					head: statement_NT.name,
					tail: [block_NT],
					name: 'statement-block'
				}),
				block_empty = new k.data.Rule({
					head: block_NT.name,
					tail: [LBRACE, RBRACE],
					name: 'block-empty'
				}),

				rules = [
					program,
					sourceElements_sourceElement,
					sourceElements_sourceElements_sourceElement,
					sourceElement_statement,
					statement_block,
					block_empty
				],

				grammar = new k.data.Grammar({
					startSymbol: program.head,
					rules: rules,
					name:'js'
				});

			var ag = new k.parser.AutomataLALR1Generator({
					grammar: grammar
				}),
				items = k.data.ItemRule.newFromRules(ag.grammar.getRulesFromNonTerminal(program.head));

			var initialState = new k.data.State({
					items: items
				});

			var state = ag.expandItem(initialState),
				itemsState = state.getItems();

			expect(itemsState.length).toBe(6);


			var itemProgram = getItemByRuleName(itemsState, 'program-sourceElements');
			expect(itemProgram).toBeDefined();
			expect(itemProgram.dotLocation).toBe(0);
			expect(itemProgram.rule).toBe(program);
			expect(itemProgram.lookAhead.length).toBe(0);

			var itemSES_SE = getItemByRuleName(itemsState, 'sourceElements-sourceElement');
			expect(itemSES_SE).toBeDefined();
			expect(itemSES_SE.dotLocation).toBe(0);
			expect(itemSES_SE.rule).toBe(sourceElements_sourceElement);
			expect(itemSES_SE.lookAhead.length).toBe(1);
			expect(itemSES_SE.lookAhead[0]).toBe(LBRACE);


			var itemSES_SES_SE = getItemByRuleName(itemsState, 'sourceElements-sourceElements-sourceElement');
			expect(itemSES_SES_SE).toBeDefined();
			expect(itemSES_SES_SE.dotLocation).toBe(0);
			expect(itemSES_SES_SE.rule).toBe(sourceElements_sourceElements_sourceElement);
			expect(itemSES_SES_SE.lookAhead.length).toBe(1);
			expect(itemSES_SES_SE.lookAhead[0]).toBe(LBRACE);

			var itemSE_ST = getItemByRuleName(itemsState, 'sourceElement-statement');
			expect(itemSE_ST).toBeDefined();
			expect(itemSE_ST.dotLocation).toBe(0);
			expect(itemSE_ST.rule).toBe(sourceElement_statement);
			expect(itemSE_ST.lookAhead.length).toBe(1);
			expect(itemSE_ST.lookAhead[0]).toBe(LBRACE);

			var itemST_BL = getItemByRuleName(itemsState, 'statement-block');
			expect(itemST_BL).toBeDefined();
			expect(itemST_BL.dotLocation).toBe(0);
			expect(itemST_BL.rule).toBe(statement_block);
			expect(itemST_BL.lookAhead.length).toBe(1);
			expect(itemST_BL.lookAhead[0]).toBe(LBRACE);

			var itemBL = getItemByRuleName(itemsState, 'block-empty');
			expect(itemBL).toBeDefined();
			expect(itemBL.dotLocation).toBe(0);
			expect(itemBL.rule).toBe(block_empty);
			expect(itemBL.lookAhead.length).toBe(1);
			expect(itemBL.lookAhead[0]).toBe(LBRACE);
		});
	});

	describe('generateAutomata', function()
	{
		function findStateById(states, id)
		{
			return k.utils.obj.find(states, function(state) {
				return state.getIdentity() === id;
			});
		}

		function validateState(states, stateId, expectedItemsLength, lookAhead)
		{
			var state = findStateById(states, stateId);
			expect(state).toBeDefined();
			expect(state).not.toBe(null);
			expect(state.getItems().length).toBe(expectedItemsLength);
			k.utils.obj.each(k.utils.obj.keys(lookAhead), function (itemRuleId)
			{
				 var itemRule = state.getOriginalItemById(itemRuleId);
				 expect(lookAhead[itemRuleId].length).toBe(itemRule.lookAhead.length);

				k.utils.obj.each(lookAhead[itemRuleId], function (expectedLookAhead)
				{
					var lookAheadFound = !!k.utils.obj.find(itemRule.lookAhead, function (symbol)
					{
						return symbol.name === expectedLookAhead;
					});

					expect(lookAheadFound).toBe(true);
				});
			});
		}

		it('should return the correct automata for the simple grammar num divs', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.numDivs.g
				}),
				result = ag.generateAutomata(),
				states = result.states;

			expect(result.hasLookAhead).toBe(true);

			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(9);

			validateState(states, '0(0)1(0)2(0)3(0)5(0)', 5,
			{
				'0(0)':['EOF'],
				'1(0)':['EOF'],
				'2(0)':['EOF','DIV'],
				'3(0)':['EOF','DIV'],
				'5(0)':['EOF','DIV']
			});
			validateState(states, '1(1)2(1)4(0)', 3,
			{
				'1(1)':['EOF'],
				'2(1)':['EOF', 'DIV'],
				'4(0)':['NUMBER']
			});
			validateState(states, '2(2)5(0)', 2,
			{
				'2(2)':['EOF', 'DIV'],
				'5(0)':['EOF', 'DIV']
			});
			validateState(states, '2(3)', 1,
			{
				'2(3)':['EOF', 'DIV']
			});
			validateState(states, '3(1)', 1,
			{
				'3(1)':['EOF','DIV']
			});
			validateState(states, '4(1)', 1,
			{
				'4(1)':['NUMBER']
			});
			validateState(states, '5(1)', 1,
			{
				'5(1)':['EOF','DIV']
			});
			validateState(states, '0(1)', 1,
			{
				'0(1)':['EOF']
			});
			validateState(states, 'AcceptanceState', 1,
			{
				'0(2)':['EOF']
			});
		});

		it('should return the correct automata for the simple grammar NUM DIFF', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.numDiff.g
				}),
				result = ag.generateAutomata({notValidate:true}),
				states = result.states;

			expect(result.hasLookAhead).toBe(true);

			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(12);

			validateState(states, '0(0)1(0)2(0)3(0)4(0)5(0)6(0)', 7,
			{
				'0(0)':['EOF'],
				'1(0)':['EOF'],
				'2(0)':['EOF','DIFF'],
				'3(0)':['EOF','DIFF'],
				'4(0)':['EOF','DIFF'],
				'5(0)':['EOF','DIFF'],
				'6(0)':['NUMBER','OPAREN'],
			});
			validateState(states, '2(0)3(0)4(0)5(1)5(0)6(1)6(0)', 7,
			{
				'2(0)':['CPAREN', 'DIFF'],
				'3(0)':['CPAREN', 'DIFF'],
				'4(0)':['CPAREN', 'DIFF'],
				'5(0)':['CPAREN', 'DIFF'],
				'5(1)':['CPAREN', 'EOF', 'DIFF'],
				'6(1)':['NUMBER', 'OPAREN'],
				'6(0)':['NUMBER', 'OPAREN']
			});
			validateState(states, '2(2)4(0)5(0)6(0)', 4,
			{
				'2(2)':['EOF','DIFF','CPAREN'],
				'4(0)':['EOF','DIFF','CPAREN'],
				'5(0)':['EOF','DIFF','CPAREN'],
				'6(0)':['NUMBER','OPAREN']
			});

			validateState(states, '2(1)5(2)7(0)8(0)', 4,
			{
				'2(1)':['CPAREN','DIFF'],
				'5(2)':['EOF', 'DIFF', 'CPAREN'],
				'8(0)':['NUMBER', 'OPAREN'],
				'7(0)':['EOF','DIFF','CPAREN']
			});
			validateState(states, '1(1)2(1)8(0)', 3,
			{
				'1(1)':['EOF'],
				'2(1)':['EOF', 'DIFF'],
				'8(0)':['NUMBER', 'OPAREN']
			});
			validateState(states, '5(3)7(1)', 2,
			{
				'5(3)':['EOF', 'DIFF', 'CPAREN'],
				'7(1)':['EOF', 'DIFF', 'CPAREN']
			});
			validateState(states, '2(3)', 1,
			{
				'2(3)': ['EOF', 'DIFF', 'CPAREN']
			});
			validateState(states, '3(1)', 1,
			{
				'3(1)':['EOF', 'DIFF', 'CPAREN']
			});
			validateState(states, '4(1)', 1,
			{
				'4(1)':['EOF','CPAREN','DIFF']
			});
			validateState(states, '8(1)', 1,
			{
				'8(1)':['NUMBER', 'OPAREN']
			});
			validateState(states, '0(1)', 1,
			{
				'0(1)':['EOF']
			});
			validateState(states, 'AcceptanceState', 1,
			{
				'0(2)':['EOF']
			});
		});

		it('should return the correct automata for the simple grammar A+B', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				result = ag.generateAutomata(),
				states = result.states;

			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(6);

			validateState(states, '0(0)1(0)2(0)', 3,
			{
				'0(0)':['EOF'],
				'1(0)':['EOF'],
				'2(0)':['EOF']
			});
			validateState(states, '1(1)1(0)2(0)', 3,
			{
				'1(1)':['EOF'],
				'1(0)':['EOF'],
				'2(0)':['EOF']
			});
			validateState(states, '2(1)', 1,
			{
				'2(1)':['EOF']
			});
			validateState(states, '0(1)', 1,
			{
				'0(1)':['EOF']
			});
			validateState(states, '1(2)', 1,
			{
				'1(2)':['EOF']
			});
			validateState(states, 'AcceptanceState', 1,
			{
				'0(2)':['EOF']
			});
		});

		it('should return the correct automata for the simple grammar a^(n+1)b^(n)', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPowN1b.g
				}),
				result = ag.generateAutomata(),
				states = result.states;

			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(9);

			validateState(states, '0(0)1(0)2(0)3(0)', 4,
				{
					'0(0)': ['EOF'],
					'1(0)': ['EOF'],
					'2(0)': ['d_terminal'],
					'3(0)': ['d_terminal']
				});
			validateState(states, '2(1)2(0)3(1)3(0)', 4,
				{
					'2(1)':['d_terminal', 'b_terminal'],
					'3(1)':['d_terminal', 'b_terminal'],
					'2(0)':['b_terminal'],
					'3(0)':['b_terminal'],
				});
			validateState(states, '2(2)', 1,
			{
				'2(2)': ['d_terminal', 'b_terminal']
			});
			validateState(states, '2(3)', 1,
			{
				'2(3)':['d_terminal', 'b_terminal']
			});
			validateState(states, '0(1)', 1,
			{
				'0(1)': ['EOF']
			});
			validateState(states, '4(1)', 1,
			{
				'4(1)':['EOF']
			});
			validateState(states, '1(2)', 1,
			{
				'1(2)':['EOF']
			});
			validateState(states, '1(1)4(0)', 2,
			{
				'1(1)':['EOF'],
				'4(0)':['EOF']
			});

			validateState(states, 'AcceptanceState', 1,
			{
				'0(2)':['EOF']
			});
		});

		it('should return the correct automata for the simple grammar Condenced num Diff', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.numDiffCondenced.g
				}),
				result = ag.generateAutomata(),
				states = result.states;


			expect(result).toBeInstanceOf(k.data.Automata);
			expect(states.length).toBe(11);

			validateState(states, '0(0)1(0)2(0)3(0)4(0)5(0)', 6,
			{
				'0(0)':['EOF'],
				'1(0)':['EOF'],
				'2(0)':['EOF', 'DIFF'],
				'3(0)':['EOF', 'DIFF'],
				'4(0)':['EOF', 'DIFF'],
				'5(0)':['EOF', 'DIFF']
			});
			validateState(states, '0(1)', 1,
			{
				'0(1)': ['EOF']
			});
			validateState(states, '1(1)2(1)', 2,
			{
				'1(1)':['EOF'],
				'2(1)': ['EOF', 'DIFF']
			});
			validateState(states, '3(1)', 1,
			{
				'3(1)': ['EOF', 'DIFF', 'CPAREN']
			});
			validateState(states, '4(1)', 1,
			{
				'4(1)': ['EOF', 'DIFF', 'CPAREN']
			});
			validateState(states, '2(0)3(0)4(0)5(1)5(0)', 5,
			{
				'5(1)': ['EOF', 'DIFF', 'CPAREN'],
				'2(0)': ['CPAREN', 'DIFF'],
				'3(0)': ['CPAREN', 'DIFF'],
				'4(0)': ['CPAREN', 'DIFF'],
				'5(0)': ['CPAREN', 'DIFF']
			});
			validateState(states, '2(2)4(0)5(0)', 3,
			{
				'2(2)': ['EOF', 'CPAREN', 'DIFF'],
				'4(0)': ['EOF', 'CPAREN', 'DIFF'],
				'5(0)': ['EOF', 'CPAREN', 'DIFF']
			});
			validateState(states, '2(1)5(2)', 2,
			{
				'2(1)': ['CPAREN', 'DIFF'],
				'5(2)': ['EOF', 'DIFF', 'CPAREN']
			});
			validateState(states, '2(3)', 1,
			{
				'2(3)': ['EOF', 'DIFF', 'CPAREN']
			});
			validateState(states, '5(3)', 1,
			{
				'5(3)': ['EOF','DIFF', 'CPAREN']
			});
			validateState(states, 'AcceptanceState', 1,
			{
				'0(2)':['EOF']
			});
		});
	});

	describe('generateACTIONTable', function ()
	{
		it('should return the expected action function for the simple LR0 grammar a+b', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				automata = ag.generateAutomata(),
				actionTable = ag.generateACTIONTable(automata);

			expect(actionTable).toEqual(jasmine.any(Object));

			expect(actionTable['0(0)1(0)2(0)']['A_LET']).toEqual({action: k.parser.tableAction.SHIFT});

			expect(actionTable['0(0)1(0)2(0)']['']).toBeUndefined();
			expect(actionTable['0(0)1(0)2(0)']['fake_value']).toBeUndefined();
			expect(actionTable['0(0)1(0)2(0)']['_A_LET']).toBeUndefined();

			expect(actionTable['1(1)1(0)2(0)']['A_LET']).toEqual({action: k.parser.tableAction.SHIFT});
			expect(actionTable['1(1)1(0)2(0)']['A_LET']).toEqual({action: k.parser.tableAction.SHIFT});

			expect(actionTable['0(1)']['EOF']).toEqual({action: k.parser.tableAction.SHIFT});

			expect(actionTable['2(1)']['EOF'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['2(1)']['EOF'].rule.name).toEqual(sampleGrammars.aPlusb.A2.name);

			expect(actionTable['2(1)']['A_LET']).toBeUndefined();

			expect(actionTable['1(2)']['EOF'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['1(2)']['EOF'].rule.name).toEqual(sampleGrammars.aPlusb.A1.name);

			expect(actionTable['AcceptanceState']['EOF'].action).toEqual('ACCEPT');
		});

		it('should return the expected action function (table) for the simple LR1 grammar num Diff Condenced', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.numDiffCondenced.g
				}),
				automata = ag.generateAutomata(),
				actionTable = ag.generateACTIONTable(automata);

			expect(actionTable).toEqual(jasmine.any(Object));

			expect(actionTable['0(0)1(0)2(0)3(0)4(0)5(0)']['NUMBER'].action).toEqual(k.parser.tableAction.SHIFT);
			expect(actionTable['0(0)1(0)2(0)3(0)4(0)5(0)']['OPAREN'].action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable['0(0)1(0)2(0)3(0)4(0)5(0)']['CPAREN']).toBeUndefined();
			expect(actionTable['0(0)1(0)2(0)3(0)4(0)5(0)']['EOF']).toBeUndefined();
			expect(actionTable['0(0)1(0)2(0)3(0)4(0)5(0)']['DIFF']).toBeUndefined();


			expect(actionTable['0(1)']['EOF'].action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable['0(1)']['CPAREN']).toBeUndefined();
			expect(actionTable['0(1)']['OPAREN']).toBeUndefined();
			expect(actionTable['0(1)']['DIFF']).toBeUndefined();
			expect(actionTable['0(1)']['NUMBER']).toBeUndefined();


			expect(actionTable['1(1)2(1)']['DIFF'].action).toEqual(k.parser.tableAction.SHIFT);
			expect(actionTable['1(1)2(1)']['EOF'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['1(1)2(1)']['EOF'].rule.name).toEqual(sampleGrammars.numDiffCondenced.S.name);

			expect(actionTable['1(1)2(1)']['OPAREN']).toBeUndefined();
			expect(actionTable['1(1)2(1)']['CPAREN']).toBeUndefined();
			expect(actionTable['1(1)2(1)']['NUMBER']).toBeUndefined();


			expect(actionTable['2(0)3(0)4(0)5(1)5(0)']['NUMBER'].action).toEqual(k.parser.tableAction.SHIFT);
			expect(actionTable['2(0)3(0)4(0)5(1)5(0)']['OPAREN'].action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable['2(0)3(0)4(0)5(1)5(0)']['EOF']).toBeUndefined();
			expect(actionTable['2(0)3(0)4(0)5(1)5(0)']['DIFF']).toBeUndefined();
			expect(actionTable['2(0)3(0)4(0)5(1)5(0)']['CPAREN']).toBeUndefined();


			expect(actionTable['2(1)5(2)']['CPAREN'].action).toEqual(k.parser.tableAction.SHIFT);
			expect(actionTable['2(1)5(2)']['DIFF'].action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable['2(1)5(2)']['EOF']).toBeUndefined();
			expect(actionTable['2(1)5(2)']['OPAREN']).toBeUndefined();
			expect(actionTable['2(1)5(2)']['NUMBER']).toBeUndefined();


			expect(actionTable['2(2)4(0)5(0)']['NUMBER'].action).toEqual(k.parser.tableAction.SHIFT);
			expect(actionTable['2(2)4(0)5(0)']['OPAREN'].action).toEqual(k.parser.tableAction.SHIFT);

			expect(actionTable['2(2)4(0)5(0)']['CPAREN']).toBeUndefined();
			expect(actionTable['2(2)4(0)5(0)']['EOF']).toBeUndefined();
			expect(actionTable['2(2)4(0)5(0)']['DIFF']).toBeUndefined();


			expect(actionTable['2(3)']['DIFF'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['2(3)']['DIFF'].rule.name).toEqual(sampleGrammars.numDiffCondenced.E1.name);
			expect(actionTable['2(3)']['EOF'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['2(3)']['EOF'].rule.name).toEqual(sampleGrammars.numDiffCondenced.E1.name);
			expect(actionTable['2(3)']['CPAREN'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['2(3)']['CPAREN'].rule.name).toEqual(sampleGrammars.numDiffCondenced.E1.name);

			expect(actionTable['2(3)']['OPAREN']).toBeUndefined();
			expect(actionTable['2(3)']['NUMBER']).toBeUndefined();


			expect(actionTable['3(1)']['CPAREN'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['3(1)']['CPAREN'].rule.name).toEqual(sampleGrammars.numDiffCondenced.E2.name);
			expect(actionTable['3(1)']['DIFF'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['3(1)']['DIFF'].rule.name).toEqual(sampleGrammars.numDiffCondenced.E2.name);
			expect(actionTable['3(1)']['EOF'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['3(1)']['EOF'].rule.name).toEqual(sampleGrammars.numDiffCondenced.E2.name);

			expect(actionTable['3(1)']['NUMBER']).toBeUndefined();
			expect(actionTable['3(1)']['OPAREN']).toBeUndefined();


			expect(actionTable['4(1)']['CPAREN'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['4(1)']['CPAREN'].rule.name).toEqual(sampleGrammars.numDiffCondenced.T1.name);
			expect(actionTable['4(1)']['EOF'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['4(1)']['EOF'].rule.name).toEqual(sampleGrammars.numDiffCondenced.T1.name);

			expect(actionTable['4(1)']['OPAREN']).toBeUndefined();
			expect(actionTable['4(1)']['DIFF'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['4(1)']['NUM']).toBeUndefined();


			expect(actionTable['5(3)']['EOF'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['5(3)']['EOF'].rule.name).toEqual(sampleGrammars.numDiffCondenced.T2.name);
			expect(actionTable['5(3)']['CPAREN'].action).toEqual(k.parser.tableAction.REDUCE);
			expect(actionTable['5(3)']['CPAREN'].rule.name).toEqual(sampleGrammars.numDiffCondenced.T2.name);

			expect(actionTable['5(3)']['NUM']).toBeUndefined();
			expect(actionTable['5(3)']['OPAREN']).toBeUndefined();
			expect(actionTable['5(3)']['DIFF'].action).toEqual(k.parser.tableAction.REDUCE);


			expect(actionTable[k.data.State.constants.AcceptanceStateName]['EOF'].action).toEqual(k.parser.tableAction.ACCEPT);
			expect(actionTable[k.data.State.constants.AcceptanceStateName]['EOF'].rule.name).toEqual(k.data.Grammar.constants.AugmentedRuleName);

			expect(actionTable[k.data.State.constants.AcceptanceStateName]['OPAREN']).toBeUndefined();
			expect(actionTable[k.data.State.constants.AcceptanceStateName]['CPAREN']).toBeUndefined();
			expect(actionTable[k.data.State.constants.AcceptanceStateName]['NUMBER']).toBeUndefined();
			expect(actionTable[k.data.State.constants.AcceptanceStateName]['DIFF']).toBeUndefined();
		});

	});

	describe('getShiftReduceItemRuleFromState', function ()
	{
		// //WITH look Ahead and without resolvers
		it('should return false if there are two reduce items with the same lookAhead (without resolvers and NOT ignore errors)', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result).toBe(false);
		});

		it('should return false if there is a shift item in conflict with a reduce items (without resolvers and NOT ignore errors)', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result).toBe(false);
		});

		it('should return an object with two reduce items if there are two reduce items with the same lookAhead (without resolvers and DO USING ignore errors)', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			var result = ag.getShiftReduceItemRuleFromState(state,{considerLookAhead:true});

			expect(result.shiftItems.length).toBe(0);
			expect(result.reduceItems.length).toBe(2);
		});

		it('should return an object with one shift item and one reduce items that are in conflict with using ignore errors (without resolvers)', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: [],
				ignoreErrors: true
			});

			expect(result.shiftItems.length).toBe(1);
			expect(result.reduceItems.length).toBe(1);
		});

		it('should return an object with two reduce items if the state has two reduce items without conflict', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[0]);

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result.shiftItems.length).toBe(0);
			expect(result.reduceItems.length).toBe(2);
			expect(result.reduceItems[0].getIdentity()).toEqual(reduceItem1.getIdentity());
			expect(result.reduceItems[1].getIdentity()).toEqual(reduceItem2.getIdentity());
		});

		it('should return an object with two shift items if the state has two shift item', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
				state = new k.data.State({
					items: [shiftItem1, shiftItem2]
				});

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result.shiftItems.length).toBe(2);
			expect(result.shiftItems[0].getIdentity()).toEqual(shiftItem1.getIdentity());
			expect(result.shiftItems[1].getIdentity()).toEqual(shiftItem2.getIdentity());
			expect(result.reduceItems.length).toBe(0);
		});

		it('should return an object with two shift items and two reduce items in the state has two reduce and two shift item without conflcts', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L2])[0],
				state = new k.data.State({
					items: [shiftItem1, shiftItem2, reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 3;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.L2.tail[1]);

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result.shiftItems.length).toBe(2);
			expect(result.shiftItems[0].getIdentity()).toEqual(shiftItem1.getIdentity());
			expect(result.shiftItems[1].getIdentity()).toEqual(shiftItem2.getIdentity());

			expect(result.reduceItems.length).toBe(2);
			expect(result.reduceItems[0].getIdentity()).toEqual(reduceItem1.getIdentity());
			expect(result.reduceItems[1].getIdentity()).toEqual(reduceItem2.getIdentity());
		});


		//WITH look Ahead and WITH resolvers
		it('should return an object with two reduce item if there are two reduce items in a resolvable conflict', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_REDUCEREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			spyOn(fakeConflictResolver, 'resolve').and.returnValue({
				action: k.parser.tableAction.REDUCE,
				itemRule: reduceItem1
			});

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result.shiftItems.length).toBe(0);
			expect(result.reduceItems.length).toBe(2);
			expect(result.reduceItems[0].getIdentity()).toBe(reduceItem1.getIdentity());
			expect(result.reduceItems[1].getIdentity()).toBe(reduceItem2.getIdentity());
		});

		it('should retrun an object with a shift item and a reduce item if the state has a resolvable shift/reduce conflict', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			spyOn(fakeConflictResolver, 'resolve').and.returnValue({
				action: k.parser.tableAction.SHIFT,
				itemRule: shiftItem
			});

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result.shiftItems.length).toBe(1);
			expect(result.shiftItems[0].getIdentity()).toBe(shiftItem.getIdentity());
			expect(result.reduceItems.length).toBe(1);
			expect(result.reduceItems[0].getIdentity()).toBe(reduceItem.getIdentity());
		});

		it('should return an object with two shift items and two reduce items if the state has resolvable shift/reduce and reduce/reduce conflicts with resolvers', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L2])[0],
				fakeConflictResolverShiftReduce = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake1'}),
				fakeConflictResolverRedcueReduce = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_REDUCEREDUCE, name: 'fake2'}),
				state = new k.data.State({
					items: [shiftItem1, shiftItem2, reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 3;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(shiftItem2.getCurrentSymbol());
			reduceItem2.lookAhead.push(shiftItem2.getCurrentSymbol());

			spyOn(fakeConflictResolverShiftReduce, 'resolve').and.returnValue({
				action: k.parser.tableAction.SHIFT,
				itemRule: shiftItem1
			});

			spyOn(fakeConflictResolverRedcueReduce, 'resolve').and.returnValue({
				action: k.parser.tableAction.REDUCE,
				itemRule: reduceItem1
			});

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolverShiftReduce, fakeConflictResolverRedcueReduce]
			});

			expect(result.shiftItems.length).toBe(2);
			expect(result.shiftItems[0].getIdentity()).toEqual(shiftItem1.getIdentity());
			expect(result.shiftItems[1].getIdentity()).toEqual(shiftItem2.getIdentity());

			expect(result.reduceItems.length).toBe(2);
			expect(result.reduceItems[0].getIdentity()).toEqual(reduceItem1.getIdentity());
			expect(result.reduceItems[1].getIdentity()).toEqual(reduceItem2.getIdentity());
		});

		it('should return reduce items only with the VALID lookAhead symbols after applying all resovlers', function ()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E1])[0],
				shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E1])[0],
				shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E2])[0],
				shiftItem3 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E3])[0],
				shiftItem4 = k.data.ItemRule.newFromRules([sampleGrammars.arithmetic.E4])[0],
				state = new k.data.State({
					items: [reduceItem1, shiftItem1, shiftItem2, shiftItem3, shiftItem4]
				});

			reduceItem1.dotLocation = 3;
			reduceItem1._id = null;

			shiftItem1.dotLocation = 1;
			shiftItem1._id = null;

			shiftItem2.dotLocation = 1;
			shiftItem2._id = null;

			shiftItem3.dotLocation = 1;
			shiftItem3._id = null;

			shiftItem4.dotLocation = 1;
			shiftItem4._id = null;


			reduceItem1.lookAhead = [new k.data.Symbol({name: k.data.specialSymbol.EOF, isSpecial: true}), sampleGrammars.arithmetic.plus_T, sampleGrammars.arithmetic.minus_T,
				sampleGrammars.arithmetic.multi_T, sampleGrammars.arithmetic.div_T];

			var result = ag.getShiftReduceItemRuleFromState(state,{
				considerLookAhead: true,
				conflictResolvers: k.parser.ConflictResolver.getDefaultResolvers()
			});

			expect(result.shiftItems.length).toBe(4);

			expect(result.reduceItems.length).toBe(1);

			expect(result.reduceItems[0].lookAhead.length).toBe(3);
			expect(result.reduceItems[0].lookAhead[0].name).toEqual(k.data.specialSymbol.EOF);
			expect(result.reduceItems[0].lookAhead[1].name).toEqual(sampleGrammars.arithmetic.plus_T.name);
			expect(result.reduceItems[0].lookAhead[2].name).toEqual(sampleGrammars.arithmetic.minus_T.name);
		});
	});

	describe('isStateValid', function ()
	{
		it('should return true if the state does not have any reduce item', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				item1 = new k.data.ItemRule(
				{
					rule: {
						index: 1,
						tail:[]
					}
				}),
				item2 = new k.data.ItemRule(
				{
					rule: {
						index: 5,
						tail:[]
					}
				}),
				s = new k.data.State({
					items: [item1, item2]
				});

			spyOn(item1, 'isReduce').and.returnValue(false);
			spyOn(item2, 'isReduce').and.returnValue(false);

			expect(ag.isStateValid(s)).toBe(true);
		});

		it('should return true if the state has just one reduce item without lookAhead', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				item1 = new k.data.ItemRule(
				{
					rule: {
						index: 1,
						tail:[]
					}
				}),
				s = new k.data.State({
					items: [item1]
				});

			spyOn(item1, 'isReduce').and.returnValue(true);

			expect(ag.isStateValid(s)).toBe(true);
		});

		it('should return true if the state has one reduce item and one shift item that does not share anything between them (using lookAhead)', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;

			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(true);

			reduceItem._id = null;
			reduceItem.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);

			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(true);
		});

		it('should return true if the state has two reduce items but with different look-ahead', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(true);
		});

		it('should return true if the state has two reduce rule and one shift rule but their look-ahead is different', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L2])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2, shiftItem]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;

			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[2]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[0]);
			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(true);
		});

		it('should return false if the state has two reduce rule with a non disjoin lookAhead set', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			expect(ag.isStateValid(state, {considerLookAhead: true})).toBe(false);
		});

		it('should return false if the state has one reduce rule and one shift rule with the same symbol', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;

			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(true);

			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			expect(ag.isStateValid(state, {considerLookAhead:true})).toBe(false);
		});

		it('should ask for resolver of there is a Shift/Reduce conflict', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			spyOn(fakeConflictResolver, 'resolve');

			ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(fakeConflictResolver.resolve).toHaveBeenCalled();
		});

		it('should return false if there is a Shift/Reduce conflict and there is no resolvers', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result).toBe(false);
		});

		it('should return false if there is a Shift/Reduce conflict and the resolvers cannot resolve the issue', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			spyOn(fakeConflictResolver, 'resolve').and.returnValue(false);

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result).toBe(false);
		});

		it('should return true if there is a Shift/Reduce that can be resolved by the resolvers', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				shiftItem = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_SHIFTREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem, shiftItem]
				});

			reduceItem.dotLocation = 1;
			reduceItem._id = null;
			reduceItem.lookAhead.push(shiftItem.getCurrentSymbol());

			spyOn(fakeConflictResolver, 'resolve').and.returnValue({
				action: k.parser.tableAction.SHIFT,
				itemRule: shiftItem
			});

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result).toBe(true);
		});

		it('should ask for resolver of there is a Reduce/Reduce conflict', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_REDUCEREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			spyOn(fakeConflictResolver, 'resolve');

			ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(fakeConflictResolver.resolve).toHaveBeenCalled();
		});

		it('should return false if there is a Reduce/Reduce conflict and there is no resolvers', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: []
			});

			expect(result).toBe(false);
		});

		it('should return false if there is a Reduce/Reduce conflict and the resolvers cannot resolve the issue', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_REDUCEREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			spyOn(fakeConflictResolver, 'resolve').and.returnValue(false);

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result).toBe(false);
		});

		it('should return true if there is a Reduce/Reduce that can be resolved by the resolvers', function()
		{
			var ag = new k.parser.AutomataLALR1Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
				reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
				fakeConflictResolver = new k.parser.ConflictResolver({type: k.parser.conflictResolverType.STATE_REDUCEREDUCE, name: 'fake'}),
				state = new k.data.State({
					items: [reduceItem1, reduceItem2]
				});

			reduceItem1.dotLocation = 1;
			reduceItem2.dotLocation = 3;

			reduceItem1._id = null;
			reduceItem2._id = null;
			reduceItem1.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);
			reduceItem2.lookAhead.push(sampleGrammars.selectedBs.S2.tail[1]);

			spyOn(fakeConflictResolver, 'resolve').and.returnValue({
				action: k.parser.tableAction.REDUCE,
				itemRule: reduceItem1
			});

			var result = ag.isStateValid(state, {
				considerLookAhead: true,
				conflictResolvers: [fakeConflictResolver]
			});

			expect(result).toBe(true);
		});
	})
});
/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true, k: true, sampleGrammars: true */
'use strict';

describe('Conflict Resolver', function ()
{
    describe('constructor', function ()
    {
        it ('should create a resolver of type SHIFT/REDUCE is non type is specified', function ()
        {
            var r = new k.parser.ConflictResolver();
            expect(r.type).toBe(k.parser.conflictResolverType.STATE_SHIFTREDUCE);
        });

        it ('should create a resolver of the specified type', function ()
        {
            var r = new k.parser.ConflictResolver({
                type: k.parser.conflictResolverType.STATE_REDUCEREDUCE
            });
            expect(r.type).toBe(k.parser.conflictResolverType.STATE_REDUCEREDUCE);
        });

        it ('should define: name, type, order and a resolution function', function ()
        {
            var r = new k.parser.ConflictResolver();
            expect(r.order).toEqual(jasmine.any(Number));
        });
    });

    describe('resolve', function ()
    {
        it ('should return false if non resolution function is specified', function ()
        {
            var r = new k.parser.ConflictResolver();
            expect(r.resolve()).toBe(false);
        });

        it ('should call the resolution function with the passed in paramters if a resolution function is specified', function ()
        {
            var r = new k.parser.ConflictResolver({
                    resolveFnc: jasmine.createSpy('fake resolution function').and.returnValue(42)
                })
            ,   automata = {}
            ,   state = {state:true}
            ,   itemRule1 = 1
            ,   itemRule2 = 2;

            var result = r.resolve(automata, state, itemRule1, itemRule2);
            expect(result).toBe(42);
            expect(r.resolveFnc).toHaveBeenCalledWith(automata, state, itemRule1, itemRule2);

        });
    });

    describe('getDefaultResolvers', function()
    {
        it ('should return two default resolvers, a precendence and an associativity resolver', function ()
        {
            var defaultResolvers = k.parser.ConflictResolver.getDefaultResolvers()
            ,   containsAssociativity
            ,   containsPrecendence;

            for (var i = 0; i < defaultResolvers.length; i++) {
                expect(defaultResolvers[i]).toBeInstanceOf(k.parser.ConflictResolver);
                containsAssociativity = containsAssociativity || defaultResolvers[i].name.indexOf('associativity') > -1;
                containsPrecendence = containsPrecendence || defaultResolvers[i].name.indexOf('precedence') > -1;
            }

            expect(containsPrecendence).toBe(true);
            expect(containsAssociativity).toBe(true);
        });

        function getPrecedenceDefaultResolver ()
        {
            var all_resolvers = k.parser.ConflictResolver.getDefaultResolvers();
            for (var i = 0; i < all_resolvers.length; i++) {
                if (all_resolvers[i].name.indexOf('precedence') > -1)
                {
                    return all_resolvers[i];
                }
            }

            return false;
        }

        function getAssociativityDefaultResolver ()
        {
            var all_resolvers = k.parser.ConflictResolver.getDefaultResolvers();
            for (var i = 0; i < all_resolvers.length; i++) {
                if (all_resolvers[i].name.indexOf('associativity') > -1)
                {
                    return all_resolvers[i];
                }
            }

            return false;
        }

        describe('precendence resolver', function ()
        {
            it('should return false when the two rules does not have precendence defined', function ()
            {
                var itemRule1 = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRule2 = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getPrecedenceDefaultResolver();

                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);

            });

            it('should return false when the two rules does not have precendence number', function ()
            {
                var itemRule1 = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRule2 = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getPrecedenceDefaultResolver();

                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);

                itemRule1.rule.precendence = 'nop';
                itemRule2.rule.precendence = 'nop';
                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);

                itemRule1.rule.precendence = 'nop';
                itemRule2.rule.precendence = false;
                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);

                itemRule1.rule.precendence = function(){};
                itemRule2.rule.precendence = {};
                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);

                itemRule1.rule.precendence = '';
                itemRule2.rule.precendence = null;
                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);
            });

            it('should return a shift resolution if the shift rule have a greater precendence number', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getPrecedenceDefaultResolver();

                itemRuleShift.rule.precendence = 42;
                itemRuleReduce.rule.precendence = 24;

                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);

                expect(result.action).toEqual(k.parser.tableAction.SHIFT);
                expect(result.itemRule).toBe(itemRuleShift);
            });

            it('should return a reduce resolution if the reduce rule have a greater precendence number', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getPrecedenceDefaultResolver();

                itemRuleShift.rule.precendence = 42;
                itemRuleReduce.rule.precendence = 69;

                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);

                expect(result.action).toEqual(k.parser.tableAction.REDUCE);
                expect(result.itemRule).toBe(itemRuleReduce);
            });

            it('should return false of both rules have the same precendence', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getPrecedenceDefaultResolver();

                itemRuleShift.rule.precendence = itemRuleReduce.rule.precendence = 1;

                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);
                expect(result).toBeFalsy();
            });

        });

        describe('associativity resolver', function ()
        {
            it('should return false if the next symbol of the shift rule have an associativity defined', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getAssociativityDefaultResolver();


                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);
                expect(result).toBeFalsy();
            });

            it('should return a shift resolution if the associativity of the next shift item rule symbol is RIGHT', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getAssociativityDefaultResolver();

                itemRuleShift.getCurrentSymbol().assoc = k.data.associativity.RIGHT;

                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);

                expect(result.action).toEqual(k.parser.tableAction.SHIFT);
                expect(result.itemRule).toBe(itemRuleShift);
            });

            it('should return a reduce resolution if the associativity of the next shift item rule symbol is LEFT', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getAssociativityDefaultResolver();

                itemRuleShift.getCurrentSymbol().assoc = k.data.associativity.LEFT;

                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);

                expect(result.action).toEqual(k.parser.tableAction.REDUCE);
                expect(result.itemRule).toBe(itemRuleReduce);
            });
        });
    });
});
/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true, k: true, sampleGrammars: true */
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

	        expect(result.error).toBeTruthy();
		});

		it('should reject the string "" for the grammar a+b', function()
		{
			var p = k.parser.parserCreator.create(
			    {
					grammar: sampleGrammars.aPlusb.g,
					strInput: ''
				});

	        var result = p.parser.parse(p.lexer);

	        expect(result.error).toBeTruthy();
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

		function getResult (lexer, parser, input)
		{
			lexer.setStream(input);
	        var result = parser.parse(lexer);
	        return result ? result.currentValue : result;
		}

		it('should resturn the expected arithmetic result for an arithmetic grammar', function()
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
	        var result = parser.parse(lexer);
	        expect(result.currentValue).toBe(2);


	        expect(getResult(lexer, parser, '1+1')).toBe(2);
	        expect(getResult(lexer, parser, '1+2*2')).toBe(5);
	        expect(getResult(lexer, parser, '(1+2)*2')).toBe(6);
	        expect(getResult(lexer, parser, '(1+2)*2/2')).toBe(3);
	        expect(getResult(lexer, parser, '(1+2)*(2/2)')).toBe(3);
	        expect(getResult(lexer, parser, '(((((((((((((((((((((((((((((((((1235)))))))))))))))))))))))))))))))))')).toBe(1235);
	        expect(getResult(lexer, parser, '(((((((((((((((((((((((((((((((((1235)))))))))))))))))))))))))))))))))+1')).toBe(1236);
	        expect(getResult(lexer, parser, '2*3*4*6')).toBe(144);
	        expect(getResult(lexer, parser, '1+(110/110)')).toBe(2);
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
			expect(token.terminal.name).toEqual('A_LET');

			expect(r.lexer.getNext).toThrow();
		});
	});
});
/* global expect: true, describe: true, it:  true, beforeEach: true, jasmine: true, spyOn:true */
'use strict';

describe('Object Utils', function()
{
		describe('inherit', function()
		{
			var Human,
				Ejecutive,
				h,
				e;

			beforeEach(function()
			{
				Human = (function()
				{
					var base = function() {
						this.age = 12;
						this.name = 'Human';
					};

					base.prototype.getAge = function() {
						return this.age;
					};

					base.prototype.sumAge = function() {
						++this.age;
					};

					return base;
				})();

				Ejecutive = (function(_super)
				{
					/* jshint latedef:false */
					k.utils.obj.inherit(son, _super);

					function son()
					{
						_super.apply(this, arguments);
						this.name = 'Ejecutive';
					}

					son.prototype.getAge = function() {
						return 'My age is: ' + this.age;
					};

					return son;
				})(Human);

				h = new Human();
				e = new Ejecutive();
			});

			it('shoud copy properties form base class to son class', function()
			{
				expect(e.age).toBe(12);
			});

			it('shoud have the same methods', function()
			{
				expect(e.getAge).toBeDefined();
				expect(e.sumAge).toBeDefined();
			});

			it('shoud support overide methods', function()
			{
				expect(h.getAge()).toBe(12);
				expect(e.getAge()).toBe('My age is: 12');
			});

			it('shoud support overide properties', function()
			{
				expect(h.name).toBe('Human');
				expect(e.name).toBe('Ejecutive');
			});
		});

		describe('defineProperty', function()
		{
			it('should at least specify context and property name', function()
			{
				var Ctx =  function() {
					this.options = {};

					k.utils.obj.defineProperty();
				};

				expect(function(){return new Ctx();}).toThrow();

				Ctx =  function() {
					this.options = {};

					k.utils.obj.defineProperty(this);
				};

				expect(function(){return new Ctx();}).toThrow();

				Ctx =  function() {
					this.options = {};

					k.utils.obj.defineProperty(null, 'test');
				};

				expect(function(){return new Ctx();}).toThrow();
			});

			it('should throw an error trying to SET a property if the base object (context) does not have an options property', function()
			{
				var Ctx =  function() {

					k.utils.obj.defineProperty(this, 'test');
				};
				var ins = new Ctx();

				expect(function() {ins.test = 12; } ).toThrow();
			});

			it('should throw an error trying to GET a property if the base object (context) does not have an options property', function()
			{
				var Ctx =  function() {

					k.utils.obj.defineProperty(this, 'test');
				};
				var ins = new Ctx();

				expect(function() {var test = ins.test; } ).toThrow();
			});

			it('should add properties listed in a for-in', function()
			{
				var Ctx =  function() {
					this.options = {
						test: 12
					};

					k.utils.obj.defineProperty(this, 'test');
				},
					ins = new Ctx(),
					isPropertyPresent = false;

				for(var prop in ins)
				{
					isPropertyPresent = isPropertyPresent || prop === 'test';
				}

				expect(isPropertyPresent).toBe(true);
			});

			it('should be possible to specify a particular getter', function()
			{
				var Ctx =  function() {
					this.options = {
						test: 12
					};

					k.utils.obj.defineProperty(this, 'test', {
						get: function() {
							return 'result';
						}
					});
				},
					ins = new Ctx();

				expect(ins.options.test).toBe(12);
				expect(ins.test).toBe('result');
			});

			it('should be possibel to specify a particular setter', function()
			{
				var Ctx =  function() {
					this.options = {
						test: 12
					};

					k.utils.obj.defineProperty(this, 'test', {
						set: function (val) {
							this.options.result = val;
						}
					});
				},
					ins = new Ctx();

				ins.test = 'result';
				expect(ins.options.test).toBe(12);
				expect(ins.options.result).toBe('result');
			});

			it('should throw an error if the GETTER specified is not a function', function()
			{
				var Ctx =  function() {
					this.options = {
						test: 12
					};

					k.utils.obj.defineProperty(this, 'test', {
						get: 'fakeValue'
					});
				};

				expect(function() {return new Ctx();}).toThrow();
			});

			it('should throw an error if the SETTER specified is not a function', function()
			{
				var Ctx =  function() {
					this.options = {
						test: 12
					};

					k.utils.obj.defineProperty(this, 'test', {
						set: 'fakeValue'
					});
				};

				expect(function() {return new Ctx();}).toThrow();
			});

		});

		describe('extend', function()
		{
			it('should extend the first paramter only', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extend(b,e);

				expect(e).toEqual({
					age:32
				});

				expect(b).toBe(result);
				expect(result).toEqual({
					name:'Who',
					age:32
				});

			});

			it('should return the first parameter', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extend(b,e);

				expect(b).toBe(result);
			});

			it('should accept any number of parameters', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extend(b,{},{},{},{},{},{},{},{},{},e);

				expect(b).toBe(result);
				expect(result).toEqual({
					name:'Who',
					age:32
				});
			});

			it('should override base properties from other passed in parameters', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extend(b,{},{},{},{},{},{},{},{},e,{},{
					anotherParam: true
				});

				expect(b).toBe(result);
				expect(result).toEqual({
					name:'Who',
					age:32,
					anotherParam:true
				});
			});
		});

		describe('clone', function()
		{
			it('shoud deep clone object', function()
			{
				var origin = {
					name: 'Tom',
					address : {
						street: '1522 woodlane dr',
						city: 'yakima',
						geo : {
							lat: '123',
							log: '321'
						}
					},
					active: true
				};

				var clone = k.utils.obj.clone(origin);

				expect(clone).toEqual(origin);
				origin.address.geo.lat = '12 3';

				expect(clone).not.toEqual(origin);
			});

			it('does not support functions', function()
			{
				var origin = {
					name: 'John',
					getName: function() {
						return this.name;
					}
				};

				var clone = k.utils.obj.clone(origin);

				expect(clone.getName).not.toBeDefined();
				expect(clone.name).toBe('John');
			});
		});

		describe('extendInNew', function()
		{
				it('should extend the first paramter only', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extendInNew(b,e);

				expect(e).toEqual({
					age:32
				});

				expect(b).not.toBe(result);
				expect(result).toEqual({
					name:'Who',
					age:32
				});

			});

			it('should returna new object', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extendInNew(b,e);

				expect(b).not.toBe(result);
			});

			it('should accept any number of parameters', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extendInNew(b,{},{},{},{},{},{},{},{},{},e);

				expect(result).toEqual({
					name:'Who',
					age:32
				});
			});

			it('should override base properties from other passed in parameters', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extendInNew(b,{},{},{},{},{},{},{},{},e,{},{
					anotherParam: true
				});

				expect(result).toEqual({
					name:'Who',
					age:32,
					anotherParam:true
				});
			});
		});

		describe('isArray', function()
		{
			it('should return true if the passed in parameter is an array', function()
			{
				expect(k.utils.obj.isArray([])).toBe(true);
				expect(k.utils.obj.isArray([[],[]])).toBe(true);
				expect(k.utils.obj.isArray([{},{}])).toBe(true);
				expect(k.utils.obj.isArray([true, false])).toBe(true);
				expect(k.utils.obj.isArray(['',''])).toBe(true);

			});

			it ('should return false if the passed in parameter is not an array', function()
			{
				expect(k.utils.obj.isArray()).toBe(false);
				expect(k.utils.obj.isArray(null)).toBe(false);
				expect(k.utils.obj.isArray(undefined)).toBe(false);
				expect(k.utils.obj.isArray({})).toBe(false);
				expect(k.utils.obj.isArray(12)).toBe(false);
				expect(k.utils.obj.isArray(false)).toBe(false);
				expect(k.utils.obj.isArray(true)).toBe(false);
			});
		});

		describe('isString', function()
		{
			it('should return true if the passed in paramters is a string', function()
			{
				expect(k.utils.obj.isString('')).toBe(true);
				expect(k.utils.obj.isString('text')).toBe(true);
				expect(k.utils.obj.isString('a')).toBe(true);
			});

			it ('should return false if the passed in parameter is not a string', function()
			{
				expect(k.utils.obj.isString()).toBe(false);
				expect(k.utils.obj.isString(null)).toBe(false);
				expect(k.utils.obj.isString(undefined)).toBe(false);
				expect(k.utils.obj.isString({})).toBe(false);
				expect(k.utils.obj.isString(12)).toBe(false);
				expect(k.utils.obj.isString(false)).toBe(false);
				expect(k.utils.obj.isString(true)).toBe(false);
			});
		});

		describe('isRegExp', function()
		{
			it('should return true if the passed in parameter is a reg exp', function()
			{
				expect(k.utils.obj.isRegExp(/a/)).toBe(true);
				expect(k.utils.obj.isRegExp(/\.a/)).toBe(true);
				var r = new RegExp('.a');
				expect(k.utils.obj.isRegExp(r)).toBe(true);
			});

			it('should return false if the passed in parameter is not a reg exp', function()
			{
				expect(k.utils.obj.isRegExp()).toBe(false);
				expect(k.utils.obj.isRegExp(null)).toBe(false);
				expect(k.utils.obj.isRegExp(undefined)).toBe(false);
				expect(k.utils.obj.isRegExp({})).toBe(false);
				expect(k.utils.obj.isRegExp(12)).toBe(false);
				expect(k.utils.obj.isRegExp(false)).toBe(false);
				expect(k.utils.obj.isRegExp(true)).toBe(false);
			});
		});

		describe('isNumber', function()
		{
			it('should return true if the passed in parameter is a Number', function()
			{
				expect(k.utils.obj.isNumber(12)).toBe(true);
				expect(k.utils.obj.isNumber(-123)).toBe(true);
				expect(k.utils.obj.isNumber(0.12)).toBe(true);
				expect(k.utils.obj.isNumber(-0.12)).toBe(true);
			});

			it('should return false if the passed in parameter is not a reg exp', function()
			{
				expect(k.utils.obj.isNumber()).toBe(false);
				expect(k.utils.obj.isNumber(null)).toBe(false);
				expect(k.utils.obj.isNumber(undefined)).toBe(false);
				expect(k.utils.obj.isNumber({})).toBe(false);
				expect(k.utils.obj.isNumber(/a/)).toBe(false);
				expect(k.utils.obj.isNumber(false)).toBe(false);
				expect(k.utils.obj.isNumber(true)).toBe(false);
			});
		});

		describe('isFunction', function()
		{
			it('should return true if the passed in parameter is a Function', function()
			{
				expect(k.utils.obj.isFunction(function () {})).toBe(true);
				var a = function(){};
				var o = {
					f : function () {}
				};
				expect(k.utils.obj.isFunction(a)).toBe(true);
				expect(k.utils.obj.isFunction(o.f)).toBe(true);
			});

			it('should return false if the passed in parameter is not a Function', function()
			{
				expect(k.utils.obj.isFunction()).toBe(false);
				expect(k.utils.obj.isFunction(null)).toBe(false);
				expect(k.utils.obj.isFunction(undefined)).toBe(false);
				expect(k.utils.obj.isFunction({})).toBe(false);
				expect(k.utils.obj.isFunction(/a/)).toBe(false);
				expect(k.utils.obj.isFunction(false)).toBe(false);
				expect(k.utils.obj.isFunction(12)).toBe(false);
				expect(k.utils.obj.isFunction(0.7)).toBe(false);
				expect(k.utils.obj.isFunction(true)).toBe(false);
			});
		});

		describe('isBoolean', function()
		{
			it('should return true if the passed in parameter is a Boolean', function()
			{
				expect(k.utils.obj.isBoolean(true)).toBe(true);
				expect(k.utils.obj.isBoolean(false)).toBe(true);
				expect(k.utils.obj.isBoolean(1 === 1)).toBe(true);
			});

			it('should return false if the passed in parameter is not a Boolean', function()
			{
				expect(k.utils.obj.isBoolean()).toBe(false);
				expect(k.utils.obj.isBoolean(null)).toBe(false);
				expect(k.utils.obj.isBoolean(undefined)).toBe(false);
				expect(k.utils.obj.isBoolean({})).toBe(false);
				expect(k.utils.obj.isBoolean(/a/)).toBe(false);
				expect(k.utils.obj.isBoolean(function(){})).toBe(false);
				expect(k.utils.obj.isBoolean(12)).toBe(false);
				expect(k.utils.obj.isBoolean(0.7)).toBe(false);
				expect(k.utils.obj.isBoolean('a')).toBe(false);
			});
		});

		describe('isArguments', function()
		{
			it('should return true if the passed in parameter is an Arguments Array', function()
			{
				expect(k.utils.obj.isArguments(arguments)).toBe(true);
			});

			it('should return false if the passed in parameter is not an Arguments Array', function()
			{
				expect(k.utils.obj.isArguments()).toBe(false);
				expect(k.utils.obj.isArguments(null)).toBe(false);
				expect(k.utils.obj.isArguments(undefined)).toBe(false);
				expect(k.utils.obj.isArguments({})).toBe(false);
				expect(k.utils.obj.isArguments(/a/)).toBe(false);
				expect(k.utils.obj.isArguments(function(){})).toBe(false);
				expect(k.utils.obj.isArguments(12)).toBe(false);
				expect(k.utils.obj.isArguments(0.7)).toBe(false);
				expect(k.utils.obj.isArguments(false)).toBe(false);
				expect(k.utils.obj.isArguments(true)).toBe(false);
				expect(k.utils.obj.isArguments('a')).toBe(false);
			});
		});

		describe('isObject', function ()
		{
			it('should return true if the passed in parameter is an Object', function()
			{
				expect(k.utils.obj.isObject({})).toBe(true);
				//Warning remove to support Object cretion without using object literal notation
				/*jshint -W010 */
				expect(k.utils.obj.isObject(new Object())).toBe(true);
				expect(k.utils.obj.isObject(Object.create({}))).toBe(true);
				expect(k.utils.obj.isObject(/a/)).toBe(true);
				expect(k.utils.obj.isObject({
					test: true,
					fake: 'YES'
				})).toBe(true);

			});

			it('should return false if the passed in parameter is not a Object', function()
			{
				expect(k.utils.obj.isObject(12)).toBe(false);
				expect(k.utils.obj.isObject()).toBe(false);
				expect(k.utils.obj.isObject(null)).toBe(false);
				expect(k.utils.obj.isObject(undefined)).toBe(false);
				expect(k.utils.obj.isObject(false)).toBe(false);
				expect(k.utils.obj.isObject(true)).toBe(false);
				expect(k.utils.obj.isObject(function(){})).toBe(false);
			});
		});

		describe('isUndefined', function ()
		{
			it('should return true if the passed in parameter is Undefined', function()
			{
				expect(k.utils.obj.isUndefined()).toBe(true);
				//Warning remove to support Object cretion without using object literal notation
				/*jshint -W010 */
				expect(k.utils.obj.isUndefined(undefined)).toBe(true);
			});

			it('should return false if the passed in parameter is not Undefined', function()
			{
				expect(k.utils.obj.isUndefined(12)).toBe(false);
				expect(k.utils.obj.isUndefined(null)).toBe(false);
				expect(k.utils.obj.isUndefined(false)).toBe(false);
				expect(k.utils.obj.isUndefined(true)).toBe(false);
				expect(k.utils.obj.isUndefined({})).toBe(false);
				expect(k.utils.obj.isUndefined(function(){})).toBe(false);
			});
		});

		describe('has', function ()
		{
			it('should return true if the specified object has the passed in property', function ()
			{
				var t = {
					'propertyName': true
				};

				expect(k.utils.obj.has(t, 'propertyName')).toBe(true);
			});

			it ('shoud return false if the specified object does not has the passed int property', function ()
			{
				var t = {
					'propertyName': true
				};

				expect(k.utils.obj.has(t, 'fakeName')).toBe(false);
			});

		});

		describe('keys', function ()
		{
			it('should return empty array if the passed in parameter is not an object', function ()
			{
				expect(k.utils.obj.keys(null)).toEqual([]);
				expect(k.utils.obj.keys(12)).toEqual([]);
				expect(k.utils.obj.keys(true)).toEqual([]);
				expect(k.utils.obj.keys(false)).toEqual([]);
				expect(k.utils.obj.keys('')).toEqual([]);
				expect(k.utils.obj.keys(function() {})).toEqual([]);
			});

			it('should return common properties and functions', function()
			{
				var ctx = {
					name: 'John',
					lastName: 'Smith',
					getName: function() {
						return this.name;
					}
				};

				var result = k.utils.obj.keys(ctx);

				expect(result.length).toBe(3);
				expect(result).toEqual(['name', 'lastName', 'getName']);
			});

			it('should return only properties owned by the curent object', function()
			{
				var Ctx = function () {
					this.name = 'John';
					this.lastName= 'Smith';
					this.getName= function() {
						return this.name;
					};
				};

				Ctx.prototype = {
					hide: 'yes'
				};

				var result = k.utils.obj.keys(new Ctx());

				expect(result.length).toBe(3);
				expect(result).toEqual(['name', 'lastName', 'getName']);
			});
		});

		describe('each', function()
		{
			it('should return null of the passed in parameter is null', function ()
			{
				expect(k.utils.obj.each(null, function(){})).toBe(null);
			});

			it('should iterate over each object key if the passed in parameter is an object', function ()
			{
				var count = 0,
					iterator =  function() {
						++count;
					};

				k.utils.obj.each({
						'one':true,
						'two':true,
						'three': true
					}, iterator);

				expect(count).toBe(3);
			});

			it('should call the iteration function with the item, index and object if it is an array', function ()
			{
				var count = 0,
					firstValue,
					secondValue,
					lastValue,
					iterator =  function(item, counter, items) {
						++count;
						if (count === 1) {firstValue = item;}
						if (count === 2) {secondValue = item;}
						if (count === 3) {lastValue = item;}
					};

				k.utils.obj.each([1, 2, 3], iterator);

				expect(count).toBe(3);
				expect(lastValue).toBe(3);
				expect(secondValue).toBe(2);
				expect(firstValue).toBe(1);
			});

			it('should call the iteration function with the item index and object if it is an object', function ()
			{
				var count = 0,
					firstValue,
					secondValue,
					lastValue,
					iterator =  function(item, counter, items) {
						++count;
						if (count === 1) {firstValue = item;}
						if (count === 2) {secondValue = item;}
						if (count === 3) {lastValue = item;}
					};

				k.utils.obj.each({
					first: 1,
					second: 2,
					thrird: 3
				}, iterator);

				expect(count).toBe(3);
				expect(lastValue).toBe(3);
				expect(secondValue).toBe(2);
				expect(firstValue).toBe(1);
			});
		});

		describe('map', function ()
		{
			it('shoud return [] if the first value is null', function ()
			{
				expect(k.utils.obj.map(null)).toEqual([]);
			});

			it('should iterate over each item colleciton the result of calling the iteration function', function ()
			{
				var result = k.utils.obj.map([1,2,3] , function(item) {
					return item*2;
				});

				expect(result).toEqual([2,4,6]);
			});
		});

		describe('reduce', function ()
		{
			it('should assume [] is passed null as object to iterate', function ()
			{
				var iterator = jasmine.createSpy('fake iterator');
				k.utils.obj.reduce(null, iterator, '');

				expect(iterator).not.toHaveBeenCalled();
			});

			it('should execute iteration function in the specifed context', function ()
			{
				var context = {
						custom: true
					},
					specifedContext = false;

				k.utils.obj.reduce([1], function()
				{
					specifedContext = this.custom === true;
				}, '', context);

				expect(specifedContext).toBe(true);
			});

			it('should throw an error in the number of arguments is less or equal than 2', function ()
			{
				expect(function () {
					k.utils.obj.reduce();
				}).toThrow();

				expect(function () {
					k.utils.obj.reduce([1]);
				}).toThrow();

				expect(function () {
					k.utils.obj.reduce([1], {});
				}).toThrow();
			});

			it('should execute our code calling the iteration function passing accumulated value, current value, index and the entier list when there are not native support for reduce', function ()
			{
				var fakeIterator = jasmine.createSpy('fake spy').and.returnValue('');
				k.utils.obj.reduce([1,2], fakeIterator, '');

				expect(fakeIterator).toHaveBeenCalled();
				expect(fakeIterator.calls.count()).toBe(2);
				expect(fakeIterator.calls.argsFor(0)).toEqual(['', 1, 0, [1,2]]);
				expect(fakeIterator.calls.argsFor(1)).toEqual(['', 2, 1, [1,2]]);
			});

			it('should use the first value as inital value, if the initial value is not specified', function ()
			{
				var initialValue;

				k.utils.obj.reduce([1,2], function(acc, val, ind, list)
				{
					initialValue = acc;
				});

				expect(initialValue).toEqual(1);
			});

			it('should reduce the list passed based on the speicified iterator function', function ()
			{
				var result = k.utils.obj.reduce([1,2,3], function (acc, val)
				{
					return acc + val;
				}, '');

				expect(result).toBe('123');
			});

		});

		describe('bind', function ()
		{
			it('should call the specified function in the specified context', function ()
			{
				var ctxPasssed = { iAmCutom: 'yeap'},
					ctx,
					fn = function() {
						ctx = this;
					};

				k.utils.obj.bind(fn, ctxPasssed)();

				expect(ctx).toEqual(ctxPasssed);
			});

			it('should throw if not passed in a valid function', function ()
			{
				expect(function ()
				{
					k.utils.obj.bind(null, {});
				}).toThrow();
			});
		});

		describe('filter', function ()
		{
			it('should returns only the values that retun thruly in the predicate', function ()
			{
				var result = k.utils.obj.filter([1,2,3,4,5,6,7,8,9,0], function (value){
					return value % 2 === 0;
				});

				expect(result).toEqual([2,4,6,8,0]);
			});

			it('should execute in the specifed context', function ()
			{
				var expectedCtx,
					ctx = {custom:'yes'};

				k.utils.obj.filter([1,2], function (){
					expectedCtx = this;
				}, ctx);

				expect(expectedCtx).toBe(ctx);
			});

			it('should resultl [] is passed in null', function ()
			{
				expect(k.utils.obj.filter(null)).toEqual([]);
			});
		});

		describe('any', function()
		{
			it('should return true if at least one elemnt pass the predicator function', function ()
			{
				var counter = 0,
					result = k.utils.obj.any([1,2,3,4,5], function (value)
					{
						counter++;
						return value === 2;
					});

				expect(result).toBe(true);
				expect(counter).toBe(2);
			});

			it('should return false if obj is null', function ()
			{
				expect(k.utils.obj.any(null)).toBe(false);
			});

			it('should return false if no element pass the predicate', function ()
			{
				var counter = 0,
					result = k.utils.obj.any([1,2,3,4,5], function (value)
					{
						counter++;
						return value === 0;
					});

				expect(result).toBe(false);
				expect(counter).toBe(5);
			});
		});

		describe('pluck', function()
		{
			it('shoould return an array with values of the property specifed', function ()
			{
				var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
				var result = k.utils.obj.pluck(stooges, 'name');

				expect(result).toEqual(['moe', 'larry', 'curly']);
			});

			it('should return [] if passed null', function()
			{
				expect(k.utils.obj.pluck(null)).toEqual([]);
			});

			it('should return [undefined, undefined, undefined] if ', function()
			{
				var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
				expect(k.utils.obj.pluck(stooges, 'fake')).toEqual([undefined, undefined, undefined]);
			});
		});

		describe('property', function ()
		{
			it('should return a function that accept an obect and return the value of the set property', function ()
			{
				var fn = k.utils.obj.property('name');
				var obj = {
					name: 'result'
				};

				expect(fn(obj)).toEqual('result');
			});

			it('should undefined if the the property is not present in the obj', function ()
			{
				var fn = k.utils.obj.property('fakeProp');
				var obj = {
					name: 'result'
				};

				expect(fn(obj)).toEqual(undefined);
			});
		});

		describe('sortBy', function ()
		{
			it('should return [] if pass null', function ()
			{
				expect(k.utils.obj.sortBy(null)).toEqual([]);
			});

			it('should execute the iterator function in the specified context', function ()
			{
				var expectedCtx = {cusotm: 'yes'},
					ctx;

				k.utils.obj.sortBy([1,2], function()
				{
					ctx = this;
				}, expectedCtx);

				expect(ctx).toBe(expectedCtx);
			});

			it('should sort a list of object based on the property specifed by the itarion function', function ()
			{
				var result = k.utils.obj.sortBy([
						{
							name: 'THREE',
							index: 3
						},
						{
							name: 'FOUR',
							index: 4
						},
						{
							name: 'ONE',
							index: 1
						},
						{
							name: 'TWO',
							index: 2
						}
					], function (obj) {
						return obj.index;
					});

				expect(result).toEqual([
						{
							name: 'ONE',
							index: 1
						},
						{
							name: 'TWO',
							index: 2
						},
						{
							name: 'THREE',
							index: 3
						},
						{
							name: 'FOUR',
							index: 4
						}
					]);
			});

			it('should return the list of number sorted as specified', function ()
			{
				var result = k.utils.obj.sortBy([1, 2, 3, 4, 5, 6], function(num){ return Math.sin(num); });
				expect(result).toEqual([5, 4, 6, 3, 1, 2]);
			});

			it('should return the same passed list if no sort function is specifed', function ()
			{
				var expectedList = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
				expect(k.utils.obj.sortBy(expectedList)).toEqual([1,2,3,4,5,6,7,8,9,10]);
			});

		});

		describe('find', function ()
		{
			it('should find the first object that fulfill the specified requirements', function ()
			{
				expect(k.utils.obj.find([1,2,3,4,5], function(i){return i === 2; })).toBe(2);
			});

			it('should iterate the list just until the first element if found', function ()
			{
				var spyIterator = jasmine.createSpy('fake Iterator').and.callFake(function(i) {
			      return i === 4;
			    });

				var result = k.utils.obj.find([1,2,3,4,5], spyIterator);

				expect(result).toBe(4);
				expect(spyIterator).toHaveBeenCalled();
				expect(spyIterator.calls.count()).toBe(4);
			});

			it('should return undefiend if no item is found', function ()
			{
				expect(k.utils.obj.find([1,2,3,4,], function (){return false;})).toBeUndefined();
			});

			it('should return undefined is passed in null', function ()
			{
				expect(k.utils.obj.find(null, function(){return true;})).toBeUndefined();
			});
		});

		describe('every', function()
		{
			it('should return true if all elemtns in the list return true in the predicate', function ()
			{
				expect(k.utils.obj.every([2,4,6,8,10], function(i) {return i % 2 === 0;})).toBe(true);
			});

			it('should return false if at least one item do not pass the predicate', function ()
			{
				expect(k.utils.obj.every([2,4,6,8,10,11], function(i) {return i % 2 === 0;})).toBe(false);
			});

			it('should true if pass null', function ()
			{
				expect(k.utils.obj.every(null)).toBe(true);
				expect(k.utils.obj.every([1,2,3])).toBe(true);
			});
		});

		describe('flatten', function ()
		{
			it('should flatten recursively all array that are passed in', function ()
			{
				var input = [1,2, [3, 4, [5, 6], 7, [8, [9, 10] ] ] ],
					expectedOutput = [1,2,3,4,5,6,7,8,9, 10];

				expect(k.utils.obj.flatten(input)).toEqual(expectedOutput);
			});

			it('should only flat the first level is shallow is true', function ()
			{
				var input = [ [ [1],[2]], [[3],[4]], [[5],[6]], [[7],[8]], [[9], [10]] ],
					expectedOutput = [[1],[2],[3],[4],[5],[6],[7],[8],[9],[10]];

				expect(k.utils.obj.flatten(input, true)).toEqual(expectedOutput);
			});

			it('should return [] is passed null', function ()
			{
				expect(k.utils.obj.flatten(null)).toEqual([]);
			});
		});

		describe('contains', function()
		{
			it('should return false if the passed in obj is null', function ()
			{
				expect(k.utils.obj.contains(null)).toBe(false);
			});

			it('should return true if the list contains the specified element', function ()
			{
				expect(k.utils.obj.contains([1,2,3,4,5,6],6)).toBe(true);
			});

			it('should return false if the item specified is not in the list', function ()
			{
				expect(k.utils.obj.contains([1,2,3,4,5,6],7)).toBe(false);
			});

			it('should return false if looking for simple objects', function ()
			{
				expect(k.utils.obj.contains([
					{
						index:1
					},
					{
						index: 2
					},
					{
						index: 3
					}],
					{
						index:2
					})).toBe(false);
			});
		});

		describe('uniq', function ()
		{
			it('should return the original list without duplicated values numbers', function ()
			{
				expect(k.utils.obj.uniq([1, 2, 1, 3, 1, 4])).toEqual([1, 2, 3, 4]);
			});

			it('should detect duplicated objects based on the function specified', function ()
			{
				var result = k.utils.obj.uniq([
					{
						name: 'A'
					},
					{
						name: 'Z'
					},
					{
						name: 'A'
					},
					{
						name: 'B'
					},
					{
						name: 'A'
					}],false, function (item){
						return item.name;
					});

				expect(result).toEqual([{name:'A'},{name:'Z'},{name:'B'}]);
			});

			it('should execute the function in the specified context', function ()
			{
				var expectedCtx = {custom:'yeap'},
					ctx;

				k.utils.obj.uniq([1,2,1,3,1,4],false, function (i) {
					ctx = this;
					return i;
				}, expectedCtx);

				expect(ctx).toBe(expectedCtx);
			});

			it('should use as iterator function the second parameter if it is a function', function ()
			{
				var result = k.utils.obj.uniq([
					{
						name: 'A'
					},
					{
						name: 'Z'
					},
					{
						name: 'A'
					},
					{
						name: 'B'
					},
					{
						name: 'A'
					}], function (item){
						return item.name;
					});

				expect(result).toEqual([{name:'A'},{name:'Z'},{name:'B'}]);
			});

			it('shoudl return [] if passed null', function ()
			{
				expect(k.utils.obj.uniq(null)).toEqual([]);
			});
		});

		describe('groupBy', function ()
		{
			it('should group the list based on the key retuned by the function', function ()
			{
				var result = k.utils.obj.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
				expect(result).toEqual({1: [1.3], 2: [2.1, 2.4]});
			});

			it('should return {} if passed null', function ()
			{
				expect(k.utils.obj.groupBy(null)).toEqual({});
			});

			it('shoudl return an object where each key is equal as its array value', function ()
			{
				var result = k.utils.obj.groupBy([1,2,3,4], function(i)
				{
					return i;
				});

				expect(result).toEqual({
					'1': [1],
					'2': [2],
					'3': [3],
					'4': [4]
				});
			});

			it('should execute the function in the specified context', function ()
			{
				var expectedCtx = {custom:'yeap'},
					ctx;

				k.utils.obj.groupBy([1,2,3,4], function(i)
				{
					ctx = this;
					return i;
				}, expectedCtx);

				expect(ctx).toBe(expectedCtx);
			});

			it('should group by the property passed if instead of a function a string is passed', function ()
			{
				var result = k.utils.obj.groupBy(['one', 'two', 'three'], 'length');
				expect(result).toEqual({3: ['one', 'two'], 5: ['three']});
			});
		});

		describe('sortedIndex', function ()
		{
			it('should return the correct index when the items are integers', function ()
			{
				var result = k.utils.obj.sortedIndex([10, 20, 30, 40, 50], 35);
				expect(result).toBe(3);
			});

			it('should accept a string as an iterator that should be used as the property name when using objects', function ()
			{
				var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}];
				var result = k.utils.obj.sortedIndex(stooges, {name: 'larry', age: 50}, 'age');

				expect(result).toBe(1);
			});

			it('should return the correct index when using a function iterator', function ()
			{
				var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}];
				var result = k.utils.obj.sortedIndex(stooges, {name: 'larry', age: 50}, function (item) {return item.age;});

				expect(result).toBe(1);
			});

			it('should trow an exception when passing null', function ()
			{
				expect(function () {return k.utils.obj.sortedIndex(null, 1);} ).toThrow();
			});
		});

		describe('indexOf', function ()
		{
			it('should return the valid index when present in a number array', function ()
			{
				expect(k.utils.obj.indexOf([1,2,3],2)).toBe(1);
			});

			it('should return -1 when the parameter is not present in a number array', function ()
			{
				expect(k.utils.obj.indexOf([1,2,3],5)).toBe(-1);
			});

			it('should return the correct index in an object array', function ()
			{
				var p = {
					name: 'A',
					lastName: 'B'
				};

				expect(k.utils.obj.indexOf([{
					name: '1',
					lastName: '2'
				},{
					name:'3',
					lastName:'4'
				},
				p
				],p)).toBe(2);
			});

			it('should return -1 if not passing the same (identity) object when in an object array', function ()
			{
				var p = {
					name: 'A',
					lastName: 'B'
				};

				expect(k.utils.obj.indexOf([{
					name: '1',
					lastName: '2'
				},{
					name:'3',
					lastName:'4'
				},
				{nane:'A', lastName:'B'}
				],p)).toBe(-1);
			});
		});

		describe('uniqueId', function ()
		{
			it('should return a value with the specified prefix', function ()
			{
				var result = k.utils.obj.uniqueId('test');
				expect(result.lastIndexOf('test', 0)).toBe(0);
			});

			it ('return when getting twice, 2 differente values', function ()
			{
				var res1 = k.utils.obj.uniqueId(),
					res2 = k.utils.obj.uniqueId();

				expect(res1).not.toBe(res2);
				expect(res1).not.toEqual(res2);
			});
		});

		describe('last', function ()
		{
			it('should return false fo not array is specified', function ()
			{
				expect(k.utils.obj.last()).toBeFalsy();
			});

			it('should return the last item in the array if no n is specifeid', function ()
			{
				expect(k.utils.obj.last([1,2,3,4])).toEqual(4);
				expect(k.utils.obj.last([1,2,3,4, true])).toEqual(true);

				var obj = {test:'yes'};
				expect(k.utils.obj.last([1,2,3,4, obj])).toBe(obj);
			});

			it('should return an array with the n last values if n is specified', function ()
			{
				expect(k.utils.obj.last([1,2,3,4],3)).toEqual([2,3,4]);
				expect(k.utils.obj.last([1,2,3,4],75)).toEqual([1,2,3,4]);
				expect(k.utils.obj.last([1,2,3,4, true],2)).toEqual([4, true]);

				var obj = {test:'yes'};
				expect(k.utils.obj.last([1,2,3,4, obj],1)).toEqual([obj]);
			});
		});

		describe('shallowClone', function ()
		{
			it('should return the same param if the passed in parameter is NOT an object', function ()
			{
				expect(k.utils.obj.shallowClone(false)).toBe(false);
				expect(k.utils.obj.shallowClone('')).toEqual('');
				expect(k.utils.obj.shallowClone()).toBeUndefined();
				expect(k.utils.obj.shallowClone(function(){})).toEqual(jasmine.any(Function));
			});

			it('should clone an array but not its items', function ()
			{
				var item1 = {},
					item2 = 2,
					item3 = {name:'tester'},
					array = [item1, item2, item3];

				var result = k.utils.obj.shallowClone(array);

				expect(result).toEqual(jasmine.any(Array));
				expect(result.length).toBe(3);
				expect(result).not.toBe(array);
				expect(result[0]).toBe(item1);
				expect(result[1]).toBe(item2);
				expect(result[2]).toBe(item3);
			});

			it('should made a shallow copy of object', function ()
			{
				var propObj = {name: 'tester', lastName: 'doe'},
					input = {
						name: 'string',
						obj: propObj
					},
					result = k.utils.obj.shallowClone(input);

				expect(result).not.toBe(input);
				expect(result).toEqual(input);
				expect(result.obj).toBe(propObj);
			});

		});

		describe('max', function ()
		{
			it('should return the maximun integer value in an array of numbers', function ()
			{
				expect(k.utils.obj.max([1,55,7,3,9])).toBe(55);
			});

			it('should project the property to filter the maximun value from the passed in string parameter', function ()
			{
				expect(k.utils.obj.max([{age:0}, {age:-1},{age:33},{age:11}],'age')).toEqual({age:33});
			});

			it('should accepts a function that returns the value of each object used to find the maximun final result', function ()
			{
				expect(k.utils.obj.max([{age:0}, {age:-1},{age:33},{age:11}],function (item)
				{
					return 10 - item.age;
				})).toEqual({age:-1});
			});

			it('should accepts a context object', function ()
			{
				var context = {
					searchValue: 11
				};

				expect(k.utils.obj.max([{age:0}, {age:-1},{age:33},{age:11}],function (item)
				{
					return this.searchValue === item.age ? 1 : 0;
				}, context)).toEqual({age:11});

			});

			it('should throw and excpetion if called with no parameters', function ()
			{
				expect(k.utils.obj.max).toThrow();
			});

			it('should return -infinity when the obj to iterate over is empty', function ()
			{
				expect(k.utils.obj.max({})).toBe(-Infinity);
				expect(k.utils.obj.max([])).toBe(-Infinity);
				expect(k.utils.obj.max(false)).toBe(-Infinity);
				expect(k.utils.obj.max(true)).toBe(-Infinity);
			});

			it('should return -infinity when the obj to iterate over is the only specifed parameter and it is an array of objects', function ()
			{
				expect(k.utils.obj.max([{name:'John'}, {name: 'Mictian'}])).toBe(-Infinity);
			});

			it('should return the last letter in the alfaber if a string is passed', function ()
			{
				expect(k.utils.obj.max('hi therez this is a test')).toEqual('z');
			});
		});

		describe('pairs', function ()
		{
			it('should return an array with the values of the assed in object', function ()
			{
				var result = k.utils.obj.pairs({one: 1, two: 2, three: 3});
				expect(result).toEqual([["one", 1], ["two", 2], ["three", 3]]);
			});

			it('should an empty array when no pairs can be extracted', function ()
			{
				expect(k.utils.obj.pairs()).toEqual([]);
				expect(k.utils.obj.pairs({})).toEqual([]);
				expect(k.utils.obj.pairs([])).toEqual([]);
				expect(k.utils.obj.pairs(false)).toEqual([]);
				expect(k.utils.obj.pairs(true)).toEqual([]);
				expect(k.utils.obj.pairs(22)).toEqual([]);
			});
		});

		describe('matches', function ()
		{
			it('should return a function that mathc object like the passed one', function ()
			{
				var objMatching = {
						name: 'John',
						age: 27
					},
					resultFunction = k.utils.obj.matches(objMatching);

				expect(resultFunction).toEqual(jasmine.any(Function));
				expect(resultFunction(objMatching)).toEqual(true);
				expect(resultFunction(false)).toEqual(false);
				expect(resultFunction(123)).toEqual(false);
				expect(resultFunction({name: 'John', age: 28})).toEqual(false);
				expect(resultFunction({name: 'John2', age: 27})).toEqual(false);

			});

			it ('should return true if the function is generated with anything else rather than an object or an empty one', function ()
			{
				expect(k.utils.obj.matches(function (){})(false)).toEqual(true);
				expect(k.utils.obj.matches(function (){})(true)).toEqual(true);
				expect(k.utils.obj.matches(function (){})(function (){})).toEqual(true);
				expect(k.utils.obj.matches(function (){})({})).toEqual(true);

				expect(k.utils.obj.matches(false)({})).toEqual(true);
				expect(k.utils.obj.matches(false)(false)).toEqual(true);
				expect(k.utils.obj.matches(false)(true)).toEqual(true);
				expect(k.utils.obj.matches(false)(12)).toEqual(true);
			});
		});

		describe('values', function ()
		{
			it ('should return the values for each of the properties of the passed in object', function ()
			{
				expect(k.utils.obj.values({
					prop1: 'rojo',
					prop2: true,
					prop3: 12,
					prop5: {}
				})).toEqual(['rojo', true, 12, {}]);


				var result = k.utils.obj.values(
					{
						prop1:function (){}
					}
					)[0];

				expect(result).toEqual(jasmine.any(Function));
			});
		});
	});

/* global expect: true, describe: true, it:  true, beforeEach: true, k:true */

'use strict';

describe('String Utils', function()
{
	describe('startsWith', function()
	{
		it('should return true if the string start with the specified prefix in the same case', function()
		{
			expect(k.utils.str.startsWith('This is a test', 'This')).toBe(true);
			expect(k.utils.str.startsWith('hello word', 'hello')).toBe(true);
		});

		it('should return false if the string start with the specified prefix with different case', function()
		{
			expect(k.utils.str.startsWith('THIS is a test', 'This')).toBe(false);
			expect(k.utils.str.startsWith(' green', 'GREEN')).toBe(false);
			expect(k.utils.str.startsWith(' green', ' GREEN')).toBe(false);
		});

		it('should return false if the string does not start with the specified prefix', function()
		{
			expect(k.utils.str.startsWith('THIS is a test', 'FAKE')).toBe(false);
		});
	});

	describe('trim', function()
	{
		it('should remove all start spaces if any', function()
		{
			expect(k.utils.str.trim(' hi')).toBe('hi');
		});

		it('should remove all ending spaces if any', function()
		{
			expect(k.utils.str.trim('hi ')).toBe('hi');
		});

		it('should remove all ending and starting spaces if any', function()
		{
			expect(k.utils.str.trim(' hi     ')).toBe('hi');
		});

		it('shoud throw an exception when passing a non string parameter', function()
		{
			expect(function() { k.utils.str.trim({});}).toThrow();
			expect(function() { k.utils.str.trim(false);}).toThrow();
			expect(function() { k.utils.str.trim(12);}).toThrow();
		});
	});

	describe('ltrim', function()
	{
		it('shoud remove starting spaces', function()
		{
			expect(k.utils.str.ltrim(' test')).toBe('test');
		});

		it('shoud not remove ending spaces', function()
		{
			expect(k.utils.str.ltrim(' test')).toBe('test');
			expect(k.utils.str.ltrim(' test  ')).toBe('test  ');
			expect(k.utils.str.ltrim('test  ')).toBe('test  ');
		});

		it('shoud not remove breaking lines', function()
		{
			expect(k.utils.str.ltrim('  \ntest')).toBe('\ntest');
			expect(k.utils.str.ltrim('\n test  ')).toBe('\n test  ');
		});

		it('shoud throw an exception when passing a non string parameter', function()
		{
			expect(function() { k.utils.str.ltrim({});}).toThrow();
			expect(function() { k.utils.str.ltrim(false);}).toThrow();
			expect(function() { k.utils.str.ltrim(12);}).toThrow();
		});
	});

	describe('fullLtrim', function()
	{
		it('shoud remove starting spaces', function()
		{
			expect(k.utils.str.fullLtrim(' test')).toBe('test');
		});

		it('shoud not remove ending spaces', function()
		{
			expect(k.utils.str.fullLtrim(' test')).toBe('test');
			expect(k.utils.str.fullLtrim(' test  ')).toBe('test  ');
			expect(k.utils.str.fullLtrim('test  ')).toBe('test  ');
		});

		it('shoud DO remove breaking lines', function()
		{
			expect(k.utils.str.fullLtrim('  \ntest')).toBe('test');
			expect(k.utils.str.fullLtrim('\n test  ')).toBe('test  ');
		});

		it('shoud throw an exception when passing a non string parameter', function()
		{
			expect(function() { k.utils.str.fullLtrim({});}).toThrow();
			expect(function() { k.utils.str.fullLtrim(false);}).toThrow();
			expect(function() { k.utils.str.fullLtrim(12);}).toThrow();
		});
	});

	describe('ltrimBreaks', function()
	{
		it('shoud not remove starting spaces', function()
		{
			expect(k.utils.str.ltrimBreaks(' test')).toBe(' test');
		});

		it('shoud not remove ending spaces', function()
		{
			expect(k.utils.str.ltrimBreaks(' test')).toBe(' test');
			expect(k.utils.str.ltrimBreaks(' test  ')).toBe(' test  ');
			expect(k.utils.str.ltrimBreaks('test  ')).toBe('test  ');
		});

		it('shoud DO remove starting breaking lines', function()
		{
			expect(k.utils.str.ltrimBreaks('\ntest\n\n')).toBe('test\n\n');
			expect(k.utils.str.ltrimBreaks('\ntest\n\nfinal')).toBe('test\n\nfinal');
			expect(k.utils.str.ltrimBreaks('\n test  ')).toBe(' test  ');
		});

		it('shoud throw an exception when passing a non string parameter', function()
		{
			expect(function() { k.utils.str.ltrimBreaks({});}).toThrow();
			expect(function() { k.utils.str.ltrimBreaks(false);}).toThrow();
			expect(function() { k.utils.str.ltrimBreaks(12);}).toThrow();
		});
	});

	describe('rtrim', function()
	{
		it('shoud not remove starting spaces', function()
		{
			expect(k.utils.str.rtrim(' test')).toBe(' test');
		});

		it('shoud remove ending spaces', function()
		{
			expect(k.utils.str.rtrim(' test')).toBe(' test');
			expect(k.utils.str.rtrim(' test  ')).toBe(' test');
			expect(k.utils.str.rtrim('test')).toBe('test');
		});

		it('shoud throw an exception when passing a non string parameter', function()
		{
			expect(function() { k.utils.str.rtrim({});}).toThrow();
			expect(function() { k.utils.str.rtrim(false);}).toThrow();
			expect(function() { k.utils.str.rtrim(12);}).toThrow();
		});
	});

	describe('tabs', function ()
	{
		it('should return empty string if passed in nothing', function ()
		{
			expect(k.utils.str.tabs()).toEqual('');
		});

		it('should return string with the count of tabs specified', function ()
		{
			expect(k.utils.str.tabs(2)).toEqual('		');
		});

		it('should return empty string if any unexpected value', function ()
		{
			expect(k.utils.str.tabs(null)).toEqual('');
			expect(k.utils.str.tabs({})).toEqual('');
			expect(k.utils.str.tabs('h')).toEqual('');
			expect(k.utils.str.tabs(false)).toEqual('');
		});

		it('should return a string with one tab if pass a true value', function ()
		{
			expect(k.utils.str.tabs(true)).toEqual('	');
		});
	});

	describe('getIndicesOf', function ()
	{
		it('should return an empty array if there is not matches', function ()
		{
			var result = k.utils.str.getIndicesOf('Hi elevator, and elegant elephant, how are you?', 'wrong');

			expect(result).toEqual([]);

			result = k.utils.str.getIndicesOf('', 'wrong');

			expect(result).toEqual([]);
		});

		it('should return the index of all maches', function ()
		{
			var result = k.utils.str.getIndicesOf('el', 'Hi elevator, and elegant elephant, how are you?');

			expect(result).toEqual([3, 17, 25]);
		});

		it('should return all matches ignoring caseSensitive by default', function ()
		{
			var result = k.utils.str.getIndicesOf('el', 'Hi elevator, and eLegant Elephant, how are you?');

			expect(result).toEqual([3, 17, 25]);
		});

		it('should take into accoiunt case sensitive if specified', function ()
		{
			var result = k.utils.str.getIndicesOf('el', 'Hi elevator, and eLegant Elephant, how are you?', true);

			expect(result).toEqual([3]);
		});

		it('should return an empty array if the string to search in if not valid', function ()
		{
			var result = k.utils.str.getIndicesOf(false, 'wrong');

			expect(result).toEqual([]);
		});
	});
});
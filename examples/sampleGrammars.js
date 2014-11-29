/* global expect: true, describe: true, it:  true, beforeEach: true */
var sampleGrammarsFunction = function sampleGrammarsFunction (k)
{
	return {
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
			//IMPORTANT: This grammar is intendely without precendence set!
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
		})()
	};
}
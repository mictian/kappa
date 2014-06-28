/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['./grammar'], function(k)
{
	'use strict';

	/*
	001. Very simple grammar to represent number divisions
	*/
	var numDivs = (function()
	{
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
				rules: [S, E1, E2, Q, F]
			}),
			S: S,
			E1: E1,
			E2: E2,
			Q: Q,
			F: F
		};
	})();

	/*
	002. Very simple list of ids (letters) divides by spaces between '(' and ')'
	*/
	var idsList = (function()
	{
		/*
		LR(1)
		0. S --> OPAREN EXPS CPAREN
		1. EXPS --> EXPS EXP
		2. EXPS --> <EMPTY>
		3. EXP --> 'id'
		4. OPAREN --> '('
		5. CPAREN --> ')'
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
				rules: [S, EXPS1, EXPS2, EXP, OPAREN, CPAREN]
			}),
			S: S,
			EXPS1: EXPS1,
			EXPS2: EXPS2,
			EXP: EXP,
			OPAREN: OPAREN,
			CPAREN: CPAREN
		};
	})();
	
	/*
	003. Very simple grammar to represent number divisions with epsilon rule
	*/
	var numDivsEmpty = (function()
	{
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
				rules: [S, E1, E2, Q1, Q2, F]
			}),
			S: S,
			E1: E1,
			E2: E2,
			Q1: Q1,
			Q2: Q2,
			F: F
		};
	})();
	
	/*
	004. Very simple grammar for difference of numbers
	*/
	var numDiff = (function()
	{
		/*
		LR(1)
		0. S --> E
		1. E --> E R T
		2. E --> T
		3. T --> 'number'
		4. T --> OPAREN E CPAREN
		5. OPAREN --> '('
		6. CPAREN --> ')'
		7. R --> '-'
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
				rules: [S, E1, E2, T1, T2, R, OPAREN, CPAREN]
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
	})();
	
	/*
	005. Very simple grammar for a*b (b, ab, aab, aaaaaaab)
	*/
	var aPlusb = (function()
	{
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
				rules: [A1, A2]
			}),
			A1: A1,
			A2: A2
		};
	})();
	
	return {
		numDivs: numDivs,
		idsList: idsList,
		numDivsEmpty: numDivsEmpty,
		numDiff: numDiff,
		aPlusb: aPlusb
	};
});
/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/grammar'], function(k)
{
	'use strict';

	/*
	001. Very simple grammar to represent number divisions
	*/
	var numDivs = (function()
	{
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
			tail: [new k.data.Terminal({name:'ID', body: /[a-zA-Z]+/})],
			name: 'EXPRULE'
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

	return {
		numDivs: numDivs,
		idsList: idsList,
		numDivsEmpty: numDivsEmpty,
		numDiff: numDiff
	};
});
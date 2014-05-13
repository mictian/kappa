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
			g: new k.data.Grammar(S.head, [S, E1, E2, Q, F]),
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
			tail: [new k.data.Terminal({name:'id', body: /[a-zA-Z]+/})],
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
			g: new k.data.Grammar(S.head, [S, EXPS1, EXPS2, EXP, OPAREN, CPAREN]),
			S: S,
			EXPS1: EXPS1,
			EXPS2: EXPS2,
			EXP: EXP,
			OPAREN: OPAREN,
			CPAREN: CPAREN
		};
	})();

	return {
		numDivs: numDivs,
		idsList: idsList
	};
});
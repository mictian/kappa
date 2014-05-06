require.config({
    baseUrl: './src'
 });

require(['./parser/automataLR0Generator', './data/state', , './lexer/lexer'], function (k)
{
    'use strict';

	//TESTS
	var S = new k.data.Rule({
		head: 'S',
		tail: k.data.NonTerminal.fromArray(['E'])
	}),

	E1 = new k.data.Rule({
		head: 'E',
		tail: k.data.NonTerminal.fromArray(['E','Q', 'F'])
	}),

	E2 = new k.data.Rule({
		head: 'E',
		tail: k.data.NonTerminal.fromArray(['F'])
	}),

	Q = new k.data.Rule({
		head: 'Q',
		tail: [new k.data.Terminal({name:'DIV', body: /\//})]
	}),

	F = new k.data.Rule({
		head: 'F',
		tail: [new k.data.Terminal({name:'NUMBER', body: /\d/})]
	});

	var g = new k.data.Grammar(S.head, [S, E1, E2, Q, F]);
	var l = new k.Lexer(g, '1/2');

	var sItem = new k.data.ItemRule({rule:S});

	var s = new k.data.State({
        items: [sItem]
	});

    //debugger;
    var automataGenerator = new k.AutomataLR0Generator({
        grammar: g
    });

    var a = automataGenerator.generateAutomata();

    var newState = automataGenerator.expandItem(s);

});

require.config({
    baseUrl: "./src"
 });

require(['./data/grammar', './lexer/lexer'], function (k)
{
	//TESTS

    var S = new k.data.rule({
			head: 'S',
			tail: k.data.nonTerminal.fromArray(['OPAREN','EXPS','CPAREN'])
		}),

		EXPS1 = new k.data.rule({
			head: 'EXPS',
			tail: k.data.nonTerminal.fromArray(['EXPS','EXP'])
		}),

		EXPS2 = new k.data.rule({
			head: 'EXPS',
		}),

		EXP = new k.data.rule({
			head: 'EXP',
			tail: [new k.data.terminal({name:'id', body: /[a-zA-Z]+/})]
		}),

		OPAREN = new k.data.rule({
			head: 'OPAREN',
			tail: [new k.data.terminal({name:'OPAREN', body: /\(/})]
		}),

		CPAREN = new k.data.rule({
			head: 'CPAREN',
			tail: [new k.data.terminal({name:'CPAREN', body: /\)/})]
		});

    var g = new k.data.grammar('S', [S,EXPS1,EXPS2, EXP, OPAREN, CPAREN]);

debugger;
	var l = new k.lexer(g, "( THIS IS A TEST )");

	var n = l.getNext();
	n = l.getNext();

});

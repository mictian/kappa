/*global describe:true it:true expect:true */
define(['../../src/lexer/lexer'], function(k)
{
	'use strict';

	describe('Lexer', function ()
	{
		it('should return ( and ID for a simple gramar (ID, ID, ...)', function()
		{
			var S = new k.data.Rule({
				head: 'S',
				tail: k.data.NonTerminal.fromArray(['OPAREN','EXPS','CPAREN'])
			}),

			EXPS1 = new k.data.Rule({
				head: 'EXPS',
				tail: k.data.NonTerminal.fromArray(['EXPS','EXP'])
			}),

			EXPS2 = new k.data.Rule({
				head: 'EXPS'
			}),

			EXP = new k.data.Rule({
				head: 'EXP',
				tail: [new k.data.Terminal({name:'id', body: /[a-zA-Z]+/})]
			}),

			OPAREN = new k.data.Rule({
				head: 'OPAREN',
				tail: [new k.data.Terminal({name:'OPAREN', body: /\(/})]
			}),

			CPAREN = new k.data.Rule({
				head: 'CPAREN',
				tail: [new k.data.Terminal({name:'CPAREN', body: /\)/})]
			});

			var g = new k.data.Grammar('S', [S,EXPS1,EXPS2, EXP, OPAREN, CPAREN]);
			var l = new k.Lexer(g, "( THIS IS A TEST )");

			var n = l.getNext();
			expect(n.string).toBe("(");
			expect(n.terminal.name).toBe("OPAREN");

			n = l.getNext();
			expect(n.string).toBe("THIS");
			expect(n.terminal.name).toBe("id");
		});
	});
});
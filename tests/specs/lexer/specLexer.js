/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/lexer/lexer'], function(k)
{
	'use strict';

	describe('Lexer', function ()
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

        it ('should ignore spaces by default', function(){
             var lexer = new k.lexer.Lexer({
				grammar: g,
				stream: ''
             });
             expect(lexer.options.notIgnoreSpaces).toBe(false);
        });

        it ('should manage spaces as specified', function(){
            var lexer = new k.lexer.Lexer({
				grammar: g,
				stream: '',
                notIgnoreSpaces: true
            });
            expect(lexer.options.notIgnoreSpaces).toBe(true);
        });

        describe('getNext', function()
        {
            it ('shoud left trim the input after reading a valid input if ignore spaced is specified', function(){
                var lexer = new k.lexer.Lexer({
					grammar: g,
					stream: '(  THIS IS A TEST) '
                });

                lexer.getNext();
                expect(lexer.inputStream).toBe('THIS IS A TEST) ');

                lexer.getNext();
                expect(lexer.inputStream).toBe('IS A TEST) ');
            });

            it ('shoud return EOF if there is no more input to process', function() {
                var lexer = new k.lexer.Lexer({
					grammar: g,
					stream: ''
                });

                var result = lexer.getNext();

				expect(result.length).toBe(-1);
                expect(result.terminal).toBeInstanceOf(k.data.Symbol);
                expect(result.terminal.isSpecial).toBe(true);
                expect(result.terminal.name).toBe(k.data.specialSymbol.EOF);
            });

            it ('shoud return the larget possible match when regexp', function() {
                var sort = new k.data.Rule({
                    head: 'sort',
                    tail: [new k.data.Terminal({name:'hel', body: /hel/})]
				});

				var large = new k.data.Rule({
					head: 'large',
					tail: [new k.data.Terminal({name:'LARGE', body: /hello/})]
				});

				var gramar = new k.data.Grammar({
					startSymbol: sort.head,
					rules:[sort, large]
				});

				var lexer = new k.lexer.Lexer({
					grammar: gramar,
					stream: 'hello world'
				});

				var result = lexer.getNext();

				expect(result.string).toBe('hello');
				expect(result.terminal.name).toBe('LARGE');

            });

            it ('shoud return the larget possible match when string', function() {
				var sort = new k.data.Rule({
                    head: 'sort',
                    tail: [new k.data.Terminal({name:'hel', body: 'he;'})]
				});

				var large = new k.data.Rule({
					head: 'large',
					tail: [new k.data.Terminal({name:'LARGE', body: 'hello'})]
				});

				var gramar = new k.data.Grammar({
					startSymbol: sort.head,
					rules: [sort, large]
				});

				var lexer = new k.lexer.Lexer({
					grammar: gramar,
					stream: 'hello world'
				});

				var result = lexer.getNext();

				expect(result.string).toBe('hello');
				expect(result.terminal.name).toBe('LARGE');
            });

            it('should return OPAREN, ID, ID, ID, ID, CPAREN for a simple gramar with ( THIS IS A TEST )', function()
            {
                var l = new k.lexer.Lexer({
					grammar: g,
					stream: '( THIS IS A TEST )'
                });

                var n = l.getNext();
                expect(n.string).toBe('(');
                expect(n.terminal.name).toBe('OPAREN');

                n = l.getNext();
                expect(n.string).toBe('THIS');
                expect(n.terminal.name).toBe('id');

                n = l.getNext();
                expect(n.string).toBe('IS');
                expect(n.terminal.name).toBe('id');

                n = l.getNext();
                expect(n.string).toBe('A');
                expect(n.terminal.name).toBe('id');

                n = l.getNext();
                expect(n.string).toBe('TEST');
                expect(n.terminal.name).toBe('id');

                n = l.getNext();
                expect(n.string).toBe(')');
                expect(n.terminal.name).toBe('CPAREN');
            });
        });

	});
});
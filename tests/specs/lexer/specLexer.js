/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/lexer/lexer', '../../../src/data/sampleGrammars'], function(k, sampleGrammar)
{
	'use strict';

	describe('Lexer', function ()
	{
		describe('constructor', function ()
		{
			it ('should ignore spaces by default', function() {
	             var lexer = new k.lexer.Lexer({
					grammar: sampleGrammar.idsList.g,
					stream: ''
	             });
	             expect(lexer.options.notIgnoreSpaces).toBe(false);
	        });
	
	        it ('should manage spaces as specified', function() {
	            var lexer = new k.lexer.Lexer({
					grammar: sampleGrammar.idsList,
					stream: '',
	                notIgnoreSpaces: true
	            });
	            expect(lexer.options.notIgnoreSpaces).toBe(true);
	        });	
		});

        describe('getNext', function()
        {
            it ('shoud left trim the input after reading a valid input if ignore spaced is specified', function(){
                var lexer = new k.lexer.Lexer({
					grammar: sampleGrammar.idsList.g,
					stream: '(  THIS IS A TEST) '
                });

                lexer.getNext();
                expect(lexer.inputStream).toBe('THIS IS A TEST) ');

                lexer.getNext();
                expect(lexer.inputStream).toBe('IS A TEST) ');
            });

            it ('shoud return EOF if there is no more input to process (ignore spaces equals true)', function() {
                var lexer = new k.lexer.Lexer({
					grammar: sampleGrammar.idsList.g,
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
						stream: ''
	                });
                
                var result = lexer.getNext();
                
                expect(result.length).toBe(0);
                expect(result.string).toBe('');
                expect(result.terminal.name).toBe('EMPTY');
                
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
						stream: ''
	                });
                
                var result = lexer.getNext();
                
                expect(result.length).toBe(-1);
                expect(result.string).toBe('');
                expect(result.terminal).toBeUndefined();
                expect(result.ERROR).toBeDefined();
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
                expect(result.ERROR).toBeUndefined();
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
                expect(result.ERROR).toBeDefined();
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
                expect(result.ERROR).toBeDefined();
            });

            it ('shoud return the larget possible match when regexp', function() {
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

            it ('shoud return the larget possible match when string', function() {
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

            it('should return OPAREN, ID, ID, ID, ID, CPAREN for a simple gramar with ( THIS IS A TEST )', function()
            {
                var l = new k.lexer.Lexer({
					grammar: sampleGrammar.idsList.g,
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
            
            
        });

	});
});
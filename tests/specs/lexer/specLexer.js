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
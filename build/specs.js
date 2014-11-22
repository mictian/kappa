
function addMatchers(jasmine)
{
	beforeEach(function() {
        jasmine.addMatchers({

            toBeInstanceOf: function(util, customEqualityTesters)
            {
                return  {
                    compare: function(actual, expected)
                    {
                        return {
                            pass: actual instanceof expected,
                            message: (actual instanceof expected) ? 'OK' : 'Expected ' + actual.constructor.name + ' is instance of ' + expected.name
                        };
                    }
                };
            }
        });
    });
}

addMatchers(jasmine);


var k = kappa
,   sampleGrammars = k.data.sampleGrammars;


/* global expect: true, describe: true, it: true, beforeEach: true, k: true */
'use strict';

describe('AST Node', function()
{
	it('should override toString', function()
	{
		var a = new k.data.ASTNode({});
		expect(Object.getPrototypeOf(a).hasOwnProperty('toString')).toBe(true);
	});

	describe('constructor', function()
	{
		it('should define a rule, stringValue and a symbol properties', function()
		{
			var symbolTest = {},
				ruleTest = {name:'test'},
				a = new k.data.ASTNode({
					stringValue: 'test',
					symbol: symbolTest,
					rule: ruleTest
				});

			expect(a.stringValue).toBe('test');
			expect(a.symbol).toBe(symbolTest);
			expect(a.rule).toBe(ruleTest);
		});

		it('should be a Node', function()
		{
			var a = new k.data.ASTNode({
				states: [{
					getIdentity: function() {return 1; }
				}, {
					getIdentity: function() {return 2; }
				}, {
					getIdentity: function() {return 3; }
				}]
			});

			expect(a).toBeInstanceOf(k.data.Node);
		});
	});
});
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
            expect(result.ERROR).toBeDefined();
        });

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

        it ('shoud left trim the input after reading a valid input if ignore spaced is specified', function()
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

        it ('shoud return EOF if there is no more input to process (ignore spaces equals true)', function()
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
            expect(result.ERROR).toBeUndefined();
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
            expect(result.ERROR).toBeDefined();
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

        it ('shoud return the larget possible match when regexp', function()
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

        it ('shoud return the larget possible match when string', function()
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

    });
});
/* global expect: true, describe: true, it:  true, beforeEach: true, k:true */

'use strict';

describe('String Utils', function()
{
	describe('startsWith', function()
	{
		it('should return true if the string start with the specified prefix in the same case', function()
		{
			expect(k.utils.str.startsWith('This is a test', 'This')).toBe(true);
			expect(k.utils.str.startsWith('hello word', 'hello')).toBe(true);
		});

		it('should return false if the string start with the specified prefix with different case', function()
		{
			expect(k.utils.str.startsWith('THIS is a test', 'This')).toBe(false);
			expect(k.utils.str.startsWith(' green', 'GREEN')).toBe(false);
			expect(k.utils.str.startsWith(' green', ' GREEN')).toBe(false);
		});

		it('should return false if the string does not start with the specified prefix', function()
		{
			expect(k.utils.str.startsWith('THIS is a test', 'FAKE')).toBe(false);
		});
	});

	describe('trim', function()
	{
		it('should remove all start spaces if any', function()
		{
			expect(k.utils.str.trim(' hi')).toBe('hi');
		});

		it('should remove all ending spaces if any', function()
		{
			expect(k.utils.str.trim('hi ')).toBe('hi');
		});

		it('should remove all ending and starting spaces if any', function()
		{
			expect(k.utils.str.trim(' hi     ')).toBe('hi');
		});

		it('shoud throw an exception when passing a non string parameter', function()
		{
			expect(function() { k.utils.str.trim({});}).toThrow();
			expect(function() { k.utils.str.trim(false);}).toThrow();
			expect(function() { k.utils.str.trim(12);}).toThrow();
		});
	});

	describe('ltrim', function()
	{
		it('shoud remove starting spaces', function()
		{
			expect(k.utils.str.ltrim(' test')).toBe('test');
		});

		it('shoud not remove ending spaces', function()
		{
			expect(k.utils.str.ltrim(' test')).toBe('test');
			expect(k.utils.str.ltrim(' test  ')).toBe('test  ');
			expect(k.utils.str.ltrim('test  ')).toBe('test  ');
		});

		it('shoud not remove breaking lines', function()
		{
			expect(k.utils.str.ltrim('  \ntest')).toBe('\ntest');
			expect(k.utils.str.ltrim('\n test  ')).toBe('\n test  ');
		});

		it('shoud throw an exception when passing a non string parameter', function()
		{
			expect(function() { k.utils.str.ltrim({});}).toThrow();
			expect(function() { k.utils.str.ltrim(false);}).toThrow();
			expect(function() { k.utils.str.ltrim(12);}).toThrow();
		});
	});

	describe('fullLtrim', function()
	{
		it('shoud remove starting spaces', function()
		{
			expect(k.utils.str.fullLtrim(' test')).toBe('test');
		});

		it('shoud not remove ending spaces', function()
		{
			expect(k.utils.str.fullLtrim(' test')).toBe('test');
			expect(k.utils.str.fullLtrim(' test  ')).toBe('test  ');
			expect(k.utils.str.fullLtrim('test  ')).toBe('test  ');
		});

		it('shoud DO remove breaking lines', function()
		{
			expect(k.utils.str.fullLtrim('  \ntest')).toBe('test');
			expect(k.utils.str.fullLtrim('\n test  ')).toBe('test  ');
		});

		it('shoud throw an exception when passing a non string parameter', function()
		{
			expect(function() { k.utils.str.fullLtrim({});}).toThrow();
			expect(function() { k.utils.str.fullLtrim(false);}).toThrow();
			expect(function() { k.utils.str.fullLtrim(12);}).toThrow();
		});
	});

	describe('ltrimBreaks', function()
	{
		it('shoud not remove starting spaces', function()
		{
			expect(k.utils.str.ltrimBreaks(' test')).toBe(' test');
		});

		it('shoud not remove ending spaces', function()
		{
			expect(k.utils.str.ltrimBreaks(' test')).toBe(' test');
			expect(k.utils.str.ltrimBreaks(' test  ')).toBe(' test  ');
			expect(k.utils.str.ltrimBreaks('test  ')).toBe('test  ');
		});

		it('shoud DO remove starting breaking lines', function()
		{
			expect(k.utils.str.ltrimBreaks('\ntest\n\n')).toBe('test\n\n');
			expect(k.utils.str.ltrimBreaks('\ntest\n\nfinal')).toBe('test\n\nfinal');
			expect(k.utils.str.ltrimBreaks('\n test  ')).toBe(' test  ');
		});

		it('shoud throw an exception when passing a non string parameter', function()
		{
			expect(function() { k.utils.str.ltrimBreaks({});}).toThrow();
			expect(function() { k.utils.str.ltrimBreaks(false);}).toThrow();
			expect(function() { k.utils.str.ltrimBreaks(12);}).toThrow();
		});
	});

	describe('rtrim', function()
	{
		it('shoud not remove starting spaces', function()
		{
			expect(k.utils.str.rtrim(' test')).toBe(' test');
		});

		it('shoud remove ending spaces', function()
		{
			expect(k.utils.str.rtrim(' test')).toBe(' test');
			expect(k.utils.str.rtrim(' test  ')).toBe(' test');
			expect(k.utils.str.rtrim('test')).toBe('test');
		});

		it('shoud throw an exception when passing a non string parameter', function()
		{
			expect(function() { k.utils.str.rtrim({});}).toThrow();
			expect(function() { k.utils.str.rtrim(false);}).toThrow();
			expect(function() { k.utils.str.rtrim(12);}).toThrow();
		});
	});

	describe('tabs', function ()
	{
		it('should return empty string if passed in nothing', function ()
		{
			expect(k.utils.str.tabs()).toEqual('');
		});

		it('should return string with the count of tabs specified', function ()
		{
			expect(k.utils.str.tabs(2)).toEqual('		');
		});

		it('should return empty string if any unexpected value', function ()
		{
			expect(k.utils.str.tabs(null)).toEqual('');
			expect(k.utils.str.tabs({})).toEqual('');
			expect(k.utils.str.tabs('h')).toEqual('');
			expect(k.utils.str.tabs(false)).toEqual('');
		});

		it('should return a string with one tab if pass a true value', function ()
		{
			expect(k.utils.str.tabs(true)).toEqual('	');
		});
	});
});
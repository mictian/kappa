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

	describe('getIndicesOf', function ()
	{
		it('should return an empty array if there is not matches', function ()
		{
			var result = k.utils.str.getIndicesOf('Hi elevator, and elegant elephant, how are you?', 'wrong');

			expect(result).toEqual([]);

			result = k.utils.str.getIndicesOf('', 'wrong');

			expect(result).toEqual([]);
		});

		it('should return the index of all maches', function ()
		{
			var result = k.utils.str.getIndicesOf('el', 'Hi elevator, and elegant elephant, how are you?');

			expect(result).toEqual([3, 17, 25]);
		});

		it('should return all matches ignoring caseSensitive by default', function ()
		{
			var result = k.utils.str.getIndicesOf('el', 'Hi elevator, and eLegant Elephant, how are you?');

			expect(result).toEqual([3, 17, 25]);
		});

		it('should take into accoiunt case sensitive if specified', function ()
		{
			var result = k.utils.str.getIndicesOf('el', 'Hi elevator, and eLegant Elephant, how are you?', true);

			expect(result).toEqual([3]);
		});

		it('should return an empty array if the string to search in if not valid', function ()
		{
			var result = k.utils.str.getIndicesOf(false, 'wrong');

			expect(result).toEqual([]);
		});
	});
});
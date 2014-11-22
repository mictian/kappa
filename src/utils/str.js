k.utils.str = (function()
{
	'use strict';

	/*
	* @func Util function used to determine if a string starts with anotherone
	*
	* @param {String} source Original string
	* @param {String} input String to check for
	* @returns {Boolean} True if the source starts with input, false otherwise
	*/
	var __startsWith = function(source, input) {
		return source ? String.prototype.slice.call(source, 0, input.length) === input : false;
	};

	/*
	* @func Util function used to remove starting and ending spaces
	*
	* @param {String} str Original string
	* @returns {String} string without initial and final spaces
	*/
	var __trim = function(str) {
		return	str.replace(/^\s+|\s+$/g, '');
	};

	/*
	* @func Util function used to remove starting spaces NOT breaking lines
	*
	* @param {String} str Original string
	* @returns {String} string without initial spaces
	*/
	var __ltrim = function(str) {
		var space = /^[ \f\t\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+/;
		return str.replace(space,'');
	};

	/*
	* @func Util function used to remove starting breaking lines
	*
	* @param {String} str Original string
	* @returns {String} string without initial enters
	*/
	var __ltrimBreaks = function (str)	{
		return str.replace(/^[\n\r]+/,'');
	};

	/*
	* @func Util function used to remove starting spaces. This method DO remove left breaking lines
	*
	* @param {String} str Original string
	* @returns {String} string without initial spaces
	*/
	var __fullLtrim = function (str)
	{
		return str.replace(/^\s+/,'');
	};

	/*
	* @func Util function used to remove ending spaces
	*
	* @param {String} str Original string
	* @returns {String} string without final spaces
	*/
	var __rtrim = function(str) {
		return str.replace(/\s+$/,'');
	};

	/*
	* @func Util function used to remove starting and ending spaces
	*
	* @param {String} str Original string
	* @returns {String} string without initial and final spaces
	*/
	var __fulltrim = function(str){
		return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
	};

	/*
	* @func Generates a stirng that is composed by various tabs
	*
	* @param {String} counter Number of tabs to add
	* @returns {String} string composed by counter tabs
	*/
	var __tabs = function (counter)
	{
		var result = '';
		for (var i = counter; i--; ) {
			result += '\t';
		}
		return result;
	};

	return {
		startsWith: __startsWith,
		trim: __trim,
		ltrim: __ltrim,
		ltrimBreaks:__ltrimBreaks,
		fullLtrim: __fullLtrim,
		rtrim: __rtrim,
		fulltrim: __fulltrim,
		tabs: __tabs
	};

})();

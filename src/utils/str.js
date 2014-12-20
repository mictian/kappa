k.utils.str = (function()
{
	'use strict';

	/*
	* @function Util function to determine if an object is or not a String
	* @param {Object} s object to check its type
	* @returns {Boolean} True if the object passed in is a String or false otherwise
	*/
	var __isString = function (s)
	{
		return Object.prototype.toString.call(s) === '[object String]';
	};

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
	* @func Generates a string that is composed by various tabs
	*
	* @param {String} counter Number of tabs to add
	* @returns {String} string composed by counter tabs
	*/
	var __tabs = function (counter) {
		var result = '';
		for (var i = counter; i--; ) {
			result += '\t';
		}
		return result;
	};

	/*
	* @func Returns an array with all the location of the string searchStr found into str.
	* IMPORTANT: This code is extracted from: http://stackoverflow.com/a/3410557/1000146
	*
	* @param {String} searchStr Pattern to look for
	* @param {String} str String where to search
	* @param {Boolean} caseSensitive Indicate if the search should take into account the characters case or not
	* @returns {[Number]} Array of numbers containng each of the found locations
	*/
	var __getIndicesOf = function (searchStr, str, caseSensitive) {
		var startIndex = 0,
			searchStrLen = searchStr.length,
			index,
			indices = [];

		if (searchStr === '' || !__isString(searchStr) || !__isString(str))
		{
			return [];
		}

		if (!caseSensitive)
		{
			str = str.toLowerCase();
			searchStr = searchStr.toLowerCase();
		}

		while ((index = str.indexOf(searchStr, startIndex)) > -1) {
			indices.push(index);
			startIndex = index + searchStrLen;
		}

		return indices;
	};

	return {
		startsWith: __startsWith,
		trim: __trim,
		ltrim: __ltrim,
		ltrimBreaks:__ltrimBreaks,
		fullLtrim: __fullLtrim,
		rtrim: __rtrim,
		fulltrim: __fulltrim,
		tabs: __tabs,
		getIndicesOf: __getIndicesOf
	};

})();

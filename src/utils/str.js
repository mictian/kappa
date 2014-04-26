define(['../core'], function(k)
{
	'use strict';

	if (!k.utils)
	{
		k.utils = {};
	}

	k.utils.str = (function()
	{

		/*
        * @func Util function used to determine if a string starts with anotherone
        *
        * @param {String} source Original string
        * @param {String} input String to check for
        * @returns {Boolean} True if the source starts with input, false otherwise
        */
		var __startsWith = function(source, input) {
			return String.prototype.slice.call(source, 0, input.length) == input;
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
        * @func Util function used to remove starting spaces
        *
        * @param {String} str Original string
        * @returns {String} string without initial spaces
        */
		var __ltrim = function(str) {
			return str.replace(/^\s+/,'');
		}

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

        return {
            startsWith: __startsWith,
            trim: __trim,
            ltrim: __ltrim,
            rtrim: __rtrim,
            fulltrim: __fulltrim
        };

    })();

    return k;
});
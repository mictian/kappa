define(['../core'], function(k)
{
	'use strict';

	if (!k.utils)
	{
		k.utils = {};
	}

	k.utils.obj = (function(){

        /*
        * @func Util function used to apply "Inheritance"
        *
        * @param {Object} superType Object to inherit from
        * @param {Object} subType Enhanced Object
        */
        var __inherit = function (subType, superType) {
            for (var p in superType)
                if (superType.hasOwnProperty(p))
                    subType[p] = superType[p];

            function __() {
                this.constructor = subType;
            }
            __.prototype = superType.prototype;
            /* jshint newcap:false */
            subType.prototype = new __();
        };

		/*
        * @func Util function to extend an object. This function accepts n arguments and the first one will be the same as the retuned one (the extended)
        * @param {Object} obj object to extend form
        * @returns {Object} The initial object with the added properties form next arguments
        */
		var __extend = function(obj) {
			var args = Array.prototype.slice.call(arguments, 1);
			for (var i = 0; i < args.length; i++) {
				if (args[i]) {
					for (var prop in args[i]) {
						obj[prop] = args[i][prop];
					}
				}
			}
			return obj;
		};

		/*
        * @func Util function to clone objects
        * @param {Object} obj object to clone
        * @returns {Object} A copy of the passed in object
        */
		var __clone = function(obj) {
            return JSON.parse(JSON.stringify(obj));
		};

		/*
        * @func Util function to extend an object. This function accepts n arguments and the first one will be the same as the retuned one (the extended)
        * @param {Object} obj object to extend form
        * @returns {Object} A new object with the added properties form next arguments
        */
		var __extendInNew = function(obj) {
			var args = Array.prototype.slice.call(arguments, 1),
                resOjb = __clone(obj);
			for (var i = 0; i < args.length; i++) {
				if (args[i]) {
					for (var prop in args[i]) {
						resOjb[prop] = args[i][prop];
					}
				}
			}
			return resOjb;
		};

        return {
            inherit: __inherit,
            extend: __extend,
            extendInNew: __extendInNew,
            clone: __clone
        };

    })();

    return k;
});
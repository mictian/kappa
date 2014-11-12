/** Package wrapper and layout.
*/
"use strict";
(function (global, init) { // Universal Module Definition.
	if (typeof define === 'function' && define.amd) {
		define([/* Put dependencies here. */], init); // AMD module.
	} else if (typeof module === 'object' && module.exports) {
		module.exports = init(/* require("dep'), ... */ ); // CommonJS module.
	} else { // Browser or web worker (probably).
		global.kappa = init(/* global.dep, ... */); // Assumes base is loaded.
	}
})(this, function __init__() {

	var k = { // Library layout. ///////////////////////////////////////////////
		__name__: 'kappa',
		__init__: __init__,
		__dependencies__: { /* 'dep': dep, ... */ },
		__version__: '0.0.1',
	// Namespaces.
		utils: {}, 
		data: {}, 
		lexer: {}, 
		parser: {},
	};

// Continued by all sources concatenated and __epilogue__.js at the end.

k.utils.obj = (function ()
{
	'use strict';
	/*
	* @func Util function used to apply "Inheritance"
	*
	* @param {Object} superType Object to inherit from
	* @param {Object} subType Enhanced Object
	* @returns void
	*/
	var __inherit = function (subType, superType)
	{
		for (var p in superType) {
			if (superType.hasOwnProperty(p)) {
				subType[p] = superType[p];
			}
		}

		function __() {
			this.constructor = subType;
		}
		__.prototype = superType.prototype;
		/* jshint newcap:false */
		subType.prototype = new __();
	};

	/*
	* @func Util function used to define properties in objects, Common to define alias, insteas od using instance.options.property, used instance.property
	* It is VERY IMPORTANT to notice that all propoerties are set and get from a property called options in the context object, unless getter and setter functions are specified
	*
	* @param {Object} ctx Object containing the options. Father object
	* @param {String} propName Name of the property to add/alias
	* @param {Function} options.set Optional function used ot override the default getter
	* @param {Function} options.get Optional function used ot override the default setter
	* @returns void
	*/
	var __defineProperty = function(ctx, propName, options)
	{
		if (!ctx || !propName)
		{
			throw new Error('Invalid property specification. In order to create a property please specify a context and a property name.');
		}

		var propertyOptions = __extend({
			enumerable: true,
			configurable: false,
			'set': function (val) {
				ctx.options[propName] = val;
			},
			'get': function () {
				return ctx.options[propName];
			}
		}, options || {});

		Object.defineProperty(ctx, propName, propertyOptions);
	};

	/*
	* @func Util function to extend an object. This function accepts n arguments and the first one will be the same as the retuned one (the extended)
	* @param {Object} obj object to extend form
	* @returns {Object} The initial object with the added properties form next arguments
	*/
	var __extend = function(obj)
	{
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
	var __clone = function(obj)
	{
		return JSON.parse(JSON.stringify(obj));
	};

	/*
	* @func Util function to extend an object. This function accepts n arguments and the first one will be the same as the retuned one (the extended)
	* @param {Object} obj object to extend form
	* @returns {Object} A new object with the added properties form next arguments
	*/
	var __extendInNew = function(obj)
	{
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

	/*
	* @func Util function to determine if an object is or not an array
	* @param {Object} o object to check its type
	* @returns {Boolean} True if the object passed in is an Array or false otherwise
	*/
	var __isArray = function(o)
	{
		return Object.prototype.toString.call(o) === '[object Array]';
	};

	/*
	* @func Util function to determine if an object is or not a String
	* @param {Object} s object to check its type
	* @returns {Boolean} True if the object passed in is a String or false otherwise
	*/
	var __isString = function(s)
	{
		return Object.prototype.toString.call(s) === '[object String]';
	};

	/*
	* @func Util function to determine if an object is or not a Regular Expression
	* @param {Object} s object to check its type
	* @returns {Boolean} True if the object passed in is a Regular Expresion, false otherwise
	*/
	var __isRegExp = function(r)
	{
		return Object.prototype.toString.call(r) === '[object RegExp]';
	};

	/*
	* @func Util function to determine if an object is or not a Number
	* @param {Object} n object to check its type
	* @returns {Boolean} True if the object passed in is a Number, false otherwise
	*/
	var __isNumber = function(n)
	{
		return Object.prototype.toString.call(n) === '[object Number]';
	};
	
	/*
	* @func Util function to determine if an object is or not a Function
	* @param {Object} f object to check its type
	* @returns {Boolean} True if the object passed in is a Function, false otherwise
	*/
	var __isFunction = function(f)
	{
		return Object.prototype.toString.call(f) === '[object Function]';
	};
	
	/*
	* @func Util function to determine if an object is or not Boolean
	* @param {Object} b object to check its type
	* @returns {Boolean} True if the object passed in is Boolean, false otherwise
	*/
	var __isBoolean = function(b) {
		return b === true || b === false || Object.prototype.toString.call(b) === '[object Boolean]';
	};
	
	/*
	* @func Util function to determine if an object is the JS Arguments array, which is of a particular type
	* @param {Object} a object to check its type
	* @returns {Boolean} True if the object passed in is an Arguments Array, false otherwise
	*/
	var __isArguments = function(a)
	{
		return Object.prototype.toString.call(a) === '[object Arguments]';
	};
	
	if (!__isArguments(arguments)) {
		__isArguments = function(a) {
			return !!(a && __has(a, 'callee'));
		};
	}
	
	/*
	* @func Util function to determine if an thing is or not a Object
	* @param {Thing} n object to check its type
	* @returns {Boolean} True if the thing passed in is a Object, false otherwise
	*/
	var __isObject = function(obj) {
		return obj === Object(obj) && !__isFunction(obj);
	};
	
	/*
	* @func Util function to determine if a thing is or not defined
	* @param {Thing} obj object to check its state
	* @returns {Boolean} True if the thing passed in is Undefined, false otherwise
	*/
	var __isUndefined = function(obj) {
		return obj === void 0;
	};
	
	/*
	====================================================================================================================================
	The next function are copied from underscorejs.org. These function are here because I want to be in control of all the code I manage.
	Besides I like that I my code pass my JSHint rule, which are much more stringer that the onces applied by underscore.js
	*/

	/*General Variables*/
	var breaker = {};
	var ArrayProto	= Array.prototype,
		concat		= ArrayProto.concat,
		push		= ArrayProto.push,
		FuncProto	= Function.prototype;

	var nativeKeys         	= Object.keys,
		nativeForEach      	= ArrayProto.forEach,
		nativeReduce       	= ArrayProto.reduce,
		nativeBind         	= FuncProto.bind,
		nativeFilter    	= ArrayProto.filter,
		nativeSome			= ArrayProto.some,
		nativeEvery			= ArrayProto.every,
		nativeIndexOf		= ArrayProto.indexOf,
		slice				= ArrayProto.slice;

	/* @func Alias of hasOwnProperty just for brevety
	* @param {Object} obj object to check ownership of property
	* @param {String} key Property name to verify
	* @returns {Boolean} True if the object posses that property
	*/
	var __has = function(obj, key) {
		return hasOwnProperty.call(obj, key);
	};

	/* @func Returns the list of own properties of an object
	* @param {Object} obj object from which extract keys
	* @returns {Array} List of string keys of property names of the object passed in
	*/
	var __keys = function(obj) {
		if (!__isObject(obj))
		{
			return [];
		}
		if (nativeKeys)
		{
			return nativeKeys(obj);
		}
		var keys = [];
		for (var key in obj){
			if (__has(obj, key))
			{
				keys.push(key);
			}
		}
		return keys;
	};

	/* @func Iterate over the passed in first parameter calling the iterator with the specified context
	* @param {Object} obj object to traverse
	* @param {Function} iterator function called per each item founded in obj
	* @param {Object} context object from which extract keys
	* @returns {Array} List of string keys of property names of the object passed in
	*/
	var __each = function(obj, iterator, context) {
		if (obj === null)
		{
			return obj;
		}
		var i,
			length;
		if (nativeForEach && obj.forEach === nativeForEach)
		{
			obj.forEach(iterator, context);
		}
		else if (obj.length === +obj.length)
		{
			for (i = 0, length = obj.length; i < length; i++)
			{
				if (iterator.call(context, obj[i], i, obj) === breaker) {
					return;
				}
			}
		}
		else
		{
			var keys = __keys(obj);
			for (i = 0, length = keys.length; i < length; i++)
			{
				if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker){
					return;
				}
			}
		}
		return obj;
	};

	/* @func Iterate over the passed in first parameter and mapping each of its valur according the iteration logic
	* @param {Object} obj object to traverse
	* @param {Function} iterator function called per each item founded in obj
	* @param {Object} context object from which extract keys
	* @returns {Array} List of string keys of property names of the object passed in
	*/
	var __map =  function(obj, iterator, context) {
		var results = [];
		if (obj === null)
		{
			return results;
		}
		__each(obj, function(value, index, list) {
			results.push(iterator.call(context, value, index, list));
		});
		return results;
	};

	var reduceError = 'Reduce of empty array with no initial value';

	/* @func Iterate over the passed in first parameter and group them all into the result by applying the iteralot logic
	* @param {Object} obj object to traverse
	* @param {Function} iterator function called per each item founded in obj
	* @param {Object} memo is the initial state of the reduction
	* @param {Object} context object used to call the iterator
	* @returns {Array} List of string keys of property names of the object passed in
	*/
	var __reduce = function(obj, iterator, memo, context) {
		var initial = arguments.length > 2;
		if (obj === null) {
			obj = [];
		}
		if (nativeReduce && obj.reduce === nativeReduce)
		{
			if (context)
			{
				iterator = __bind(iterator, context);	
			} 
			return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
		}
		__each(obj, function(value, index, list) {
			if (!initial) {
				memo = value;
				initial = true;
			} else {
				memo = iterator.call(context, memo, value, index, list);
			}
		});
		if (!initial) {
			throw new TypeError(reduceError);
		}
		return memo;
	};
	
	var Ctor = function(){};
	
	/* @func Bind a function to an object, meaning that whenever the function is called, the value of this will be the object. 
	* Optionally, pass arguments to the function to pre-fill them, also known as partial application
	* @param {Function} func Function to wrap up
	* @param {Object} context Object used as a context in the execution of func
	* @returns {Function} A new wrap function
	*/
	var __bind = function(func, context) {
		var args, bound;
		if (nativeBind && func.bind === nativeBind) {
			return nativeBind.apply(func, slice.call(arguments, 1));
		}
		if (!__isFunction(func)) {
			throw new TypeError();
		}
		args = slice.call(arguments, 2);
		bound = function() {
			if (!(this instanceof bound)) {
				return func.apply(context, args.concat(slice.call(arguments)));
			}
			Ctor.prototype = func.prototype;
			var self = new Ctor();
			Ctor.prototype = null;
			var result = func.apply(self, args.concat(slice.call(arguments)));
			if (Object(result) === result)
			{
				return result;
			}
			return self;
		};
		return bound;
	};
	
	/* @func Iterate over the passed in first parameter and filter them based on the result of the predicate parameter
	* @param {Object} obj object to traverse
	* @param {Function} predicate function called per each item founded in obj to determine if the item is or no in the final result
	* @param {Object} context object used to call the iterator
	* @returns {Array} List of item in object that return thruly tp the passed in predicate
	*/
	var __filter = function(obj, predicate, context) {
		var results = [];
		if (obj === null) {
			return results;
		}
		if (nativeFilter && obj.filter === nativeFilter) {
			return obj.filter(predicate, context);
		}
		
		__each(obj, function(value, index, list) {
			if (predicate.call(context, value, index, list))
			{
				results.push(value);
			}
		});
		return results;
	};

	/* @func Keep the identity function around for default iterators.
	* @param {Object} value Value that will returned
	* @returns {Object} The same value that passed in
	*/
	var __identity = function(value) {
		return value;
	};
	
	/* @func Determine if at least one element in the object matches a truth test
	* @param {Object} obj object to traverse
	* @param {Function} predicate function called per each item founded in obj to determine if the item fullfil the requirements
	* @param {Object} context object used to call the iterator
	* @returns {Boolean} True if at least one item pass the predicate, false otherwise
	*/
	var __any = function(obj, predicate, context) {
		predicate = predicate || __identity;
		var result = false;
		if (obj === null) { 
			return result;
		}
		if (nativeSome && obj.some === nativeSome) {
			return obj.some(predicate, context);
		}
		
		__each(obj, function(value, index, list) {
			if (result || (result = predicate.call(context, value, index, list))) {
				return breaker;
			}
		});
		return !!result;
	};
	
	/* @func Convenience version of a common use case of map: fetching a property.
	* @param {Object} obj Object to be traverse
	* @param {String} key Name of the property to extract from eacj item in obje
	* @returns {Array} List of each property value from each item in obj
	*/
	var __pluck = function(obj, key) {
		return __map(obj, __property(key));
	};
	
	/* @func Auxiliar and Internal function used to return an object's propert by settings using a closure the property name.
	* Returns a function that will itself return the key property of any passed-in object
	* @param {String} key Name of the property name to 'lock'
	* @returns {Function} A function that accepts an object and returns the value of its property set before
	*/
	var __property = function(key) {
		return function(obj) {
			return obj[key];
		};
	};
	
	/* @func An internal function to generate lookup iterators
	* @param {Object} value Lookup
	* @returns {Object} Object lookup
	*/
	var lookupIterator = function(value) {
		if (value === null || value === undefined) {
			return __identity;
		}
		if (__isFunction(value)) {
			return value;
		}
		return __property(value);
	};
	
	/* @func Sort the object’s values by a criterion produced by an iterator.
	* @param {Object} obj object to traverse
	* @param {Function} iterator function called per each item founded in obj. Called with value, index, list
	* @param {Object} context object from which extract keys
	* @returns {Object} The same obj passed in but sorted as specified by the iterator function
	*/
	var __sortBy = function(obj, iterator, context) {
		iterator = lookupIterator(iterator);
		
		return __pluck(__map(obj, function(value, index, list)
		{
			return {
				value: value,
				index: index,
				criteria: iterator.call(context, value, index, list)
			};
		}).sort(function(left, right) {
			var a = left.criteria;
			var b = right.criteria;
			if (a !== b) {
				if (a > b || a === void 0) { 
					return 1;
				}
				if (a < b || b === void 0) { 
					return -1;
				}
			}
			return left.index - right.index;
		}), 'value');
	};
	
	/* @func Return the first value which passes a truth test
	* @param {Object} obj object to traverse
	* @param {Function} predicate function called per each item founded in obj
	* @param {Object} context object from which extract keys
	* @returns {Object} The first item in obj that returns true
	*/
	var __find = function(obj, predicate, context) {
		var result;
		__any(obj, function(value, index, list) {
			if (predicate.call(context, value, index, list)) {
				result = value;
				return true;
			}
		});
		return result;
	};
	
	/* @func An internal function used for aggregate “group by” operations.
	* @param {Array} obj object to traverse
	* @param {Function} iterator function called per each item founded in obj
	* @param {Object} context object from which extract keys
	* @returns {Object} Object where each property is the key of each group, and where the values of these key are the array of values grouped
	*/
	var group = function(behavior) {
		return function(obj, iterator, context) {
			var result = {};
			iterator = lookupIterator(iterator);
			__each(obj, function(value, index) {
				var key = iterator.call(context, value, index, obj);
				behavior(result, key, value);
			});
			return result;
		};
	};
	
	/* @func Determine whether all of the elements match a truth test.
	* @param {Array} obj object to traverse
	* @param {Function} predicate function called per each item founded in obj to determine if fulfill the requirements
	* @param {Object} context object from which extract keys
	* @returns {Boolean} Returns true if all of the values in the list pass the predicate truth test.
	*/
	var __every = function(obj, predicate, context) {
		predicate = predicate || __identity;
		var result = true;
		if (obj === null) {
			return result;
		}
		if (nativeEvery && obj.every === nativeEvery) {
			return obj.every(predicate, context);
		}
		__each(obj, function(value, index, list) {
			if (!(result = result && predicate.call(context, value, index, list))) 
			{
				return breaker;
			}
		});
		return !!result;
	};
	
	/* @func Internal implementation of a recursive flatten function.
	* @param {Array} input object to traverse
	* @param {Boolean} shallow Indicate if the flattening should NOT be made recusrively (true: DO NOT make it recursively)
	* @param {Array} output Output parameter wheere the final list is saved
	* @returns {Array} Array where each item if flattened
	*/
	var flatten = function(input, shallow, output) {
		if (shallow && __every(input, __isArray)) {
			return concat.apply(output, input);
		}
		__each(input, function(value) {
			if (__isArray(value) || __isArguments(value)) {
				if (shallow) {
					push.apply(output, value);
				} else { 
					flatten(value, shallow, output);
				}
			} else {
				output.push(value);
			}
		});
		return output;
	};
	
	/* @func Flatten out an array, either recursively (by default), or just one level.
	* @param {Array} array object to traverse
	* @param {Boolean} shallow Indicate if the flattening should NOT be made recusrively (true: DO NOT make it recursively)
	* @returns {Array} Array where each item if flattened
	*/
	var __flatten = function(array, shallow) {
		return flatten(array, shallow, []);
	};
	
	/* @func Determine if the array or object contains a given value (using ===).
	* @param {Array} obj object to traverse
	* @param {Object} target Object looked for
	* @returns {Boolean} True if the obj contains the value pass in
	*/
	var __contains = function(obj, target) {
		if (obj === null) {
			return false;
		}
		if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
			return obj.indexOf(target) !== -1;
		}
		return __any(obj, function(value) {
			return value === target;
		});
	};
	
	/* @func Produce a duplicate-free version of the array. If the array has already been sorted, you have the option of using a faster algorithm.
	* @param {Array} array object to traverse
	* @param {Boolean} isSorted indicate if the array is osrted or not
	* @param {Function} iterator If you want to compute unique items based on a transformation, pass an iterator function
	* @param {Object} context object from which extract keys
	* @returns {Array} Original array without duplicates
	*/
	var __uniq = function(array, isSorted, iterator, context) {
		if (__isFunction(isSorted)) {
			context = iterator;
			iterator = isSorted;
			isSorted = false;
		}
		var initial = iterator ? __map(array, iterator, context) : array,
			results = [],
			seen = [];
		
		__each(initial, function(value, index) {
			if (isSorted ? (!index || seen[seen.length - 1] !== value) : !__contains(seen, value))
			{
				seen.push(value);
				results.push(array[index]);
			}
		});
		return results;
	};
	
	/* @func Groups the object’s values by a criterion. Pass either a string attribute to group by, or a function that returns the criterion
	* @param {Array} obj object to traverse
	* @param {Function} iterator function called per each item founded in obj
	* @param {Object} context object from which extract keys
	* @returns {Object} Object where each property is the key of each group, and where the values of these key are the array of values grouped
	*/
	var __groupBy = group(function(result, key, value) {
		if (__has(result, key))
		{
			result[key].push(value);
		} else { 
			result[key] = [value];
		}
	});
	
	/* @func Uses a binary search to determine the index at which the value should be inserted into the list in order to maintain the list's sorted order.
	* @param {Array} array List of items to traverse
	* @param {Object} obj object to traverse
	* @param {Function} iterator Optional function that will be used to compute the sort ranking of each value, including the value (obj param) you pass.
		Iterator may also be the string name of the property to sort by
	* @param {Object} context Used as a context when executing the iterator function
	* @returns {Integer} The location/index at which the pass value should be inserted.
	*/
	var __sortedIndex = function(array, obj, iterator, context) {
		iterator = lookupIterator(iterator);
		var value = iterator.call(context, obj);
		var low = 0,
			high = array.length;
		
		while (low < high) {
			var mid = (low + high) >>> 1;
			if (iterator.call(context, array[mid]) < value)
			{
				low = mid + 1;
			}
			else
			{
				high = mid;	
			}
		}
		return low;
	};
	
	/* @func Returns the index at which value can be found in the array, or -1 if value is not present in the array.
	* @param {Array} array List of items to traverse
	* @param {Object} item Object to find into the array
	* @param {Booelan} isSorted When the array is sorted pass true and the algorithm will perform a faster approach
	* @returns {Integer} The location/index at which the pass value is present, and -1 if the value is not present
	*/
	var __indexOf = function (array, item, isSorted) {
		if (array === null) {
			return -1;
		}
		var i = 0, length = array.length;
		if (isSorted) {
			if (typeof isSorted === 'number') {
				i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
			} else {
				i = __sortedIndex(array, item);
				return array[i] === item ? i : -1;
			}
		}
		
		if (nativeIndexOf && array.indexOf === nativeIndexOf) {
			return array.indexOf(item, isSorted);
		}
		
		for (; i < length; i++) {
			if (array[i] === item) {
				return i;
			}
		}
		return -1;
	};
	
	var idCounter = 0;
	/* @func Generate a unique integer id (unique within the entire client session).
	* @param {String} prefix Optional prefix name
	* @returns {String} Unique identifier
	*/
	var __uniqueId = function (prefix) {
		var id = ++idCounter + '';
		return prefix ? prefix + id : id;
	};
	
	var  __last = function (array, n, guard) {
		//TODO TEST THIS
		if (array === null || array === undefined) 
		{
			return void 0;
		}
		if (n === null || n === undefined || guard) 
		{
			return array[array.length - 1];
		}
		return slice.call(array, Math.max(array.length - n, 0));
	};

	return {
		inherit: __inherit,
		extend: __extend,
		extendInNew: __extendInNew,
		clone: __clone,
		isArray: __isArray,
		isString: __isString,
		isRegExp: __isRegExp,
		isNumber: __isNumber,
		isObject: __isObject,
		isFunction: __isFunction,
		isArguments: __isArguments,
		isBoolean: __isBoolean,
		isUndefined: __isUndefined,
		keys: __keys,
		each: __each,
		map: __map,
		has: __has,
		reduce: __reduce,
		bind: __bind,
		filter: __filter,
		any: __any,
		defineProperty: __defineProperty,
		pluck: __pluck,
		sortBy: __sortBy,
		property: __property,
		find: __find,
		every: __every,
		flatten: __flatten,
		groupBy: __groupBy,
		contains: __contains,
		uniq: __uniq,
		sortedIndex: __sortedIndex,
		indexOf: __indexOf,
		uniqueId: __uniqueId,
		last: __last
	};
})();

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
	* @func Util function used to remove starting spaces
	*
	* @param {String} str Original string
	* @returns {String} string without initial spaces
	*/
	var __ltrim = function(str) {
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
		rtrim: __rtrim,
		fulltrim: __fulltrim,
		tabs: __tabs
	};

})();

/* Node
 * @class
 * @classdesc This class reprensent a generic Node class */
k.data.Node = (function () {
	'use strict';
	
	/*
	 * Constructor Generic Node for any kind of graph
	 *
	 * @constructor
	 * @param {[Object]} options.transitions Array of object that initialy compone this node
	 * @param {String} options.name Optioanl node identifiation
	 * @param {[Node]} options.nodes Array of node instances that are children of this current node
	 */
	var node = function (options)
	{
		this.options = options;
		
		k.utils.obj.defineProperty(this, 'transitions');
		k.utils.obj.defineProperty(this, 'nodes');
		k.utils.obj.defineProperty(this, 'name');
		
		k.utils.obj.defineProperty(this, '_id');
		
		this.transitions = options.transitions || [];
		this.nodes = options.nodes || [];
	};
	
	/* @function Returns the string ID of the current state
	 * @returns {String} ID  */
	node.prototype.getIdentity = function()
	{
		if (!this._id) {
			this._id = this._generateIdentity();
		}
		return this._id;
	};
	
	/* @function Generates an ID that identify this node from any other state
	 * @returns {String} Generated ID  */
	node.prototype._generateIdentity = function()
	{
		return this.name || k.utils.obj.uniqueId('node_');
	};
	
	/* @function Add a new transaction into the list of transactions of the current state
	 * @param {Object} transitionValue Object use to make the transition (i.e. symbol), description of the arista (like the name of the transition)
	 * @param {Node} node Destination node (or state) arrived when moving with the specified tranisiotn
	 * @returns {Void}  */
	node.prototype.addTransition = function (transitionValue, node)
	{
		this.transitions.push(this._generateNewTransition(transitionValue, node));
		this.nodes.push(node);
	};
	
	/* @function Function responsible the creation of new transition objects
	 * @param {Object} transitionValue Object use to make the transition, description of the arista (like the name of the transition)
	 * @param {Node} node Destination node (or state) arrived when moving with the specified tranisiotn
	 * @returns {Object} Transition object  */
	node.prototype._generateNewTransition = function (transitionValue, node)
	{
		return {
			transitionValue: transitionValue,
			node: node
		};
	};
	
	/* @function Gets the node identity
	* @returns {String} A formatted string id of the node */
	node.prototype.toString = function ()
	{
		return this.getIdentity();
	};
	
	return node;
})();

/* Enum for any special Symbol
* @readonly
* @enum {String}
*/
var specialSymbol = k.data.specialSymbol = {
	EMPTY: 'EMPTY',
	EOF : 'EOF'
};

/* Enum Terminals Associativity
* @readonly
* @enum {String}
*/
var associativity = k.data.associativity = {
	LEFT: 'LEFT',
	RIGHT: 'RIGHT'
};

/* Symbol
* @class
* @classdesc This class represent any simbol in the entire system */
var Symbol = k.data.Symbol = (function () {
	'use strict';
	
	/*
	* Creates an instance of a Symbol (This class represent non Terminals, Terminals and Special symbols)
	*
	* @constructor
	* @param {String} options.name The name or denatation of the non terminal
	* @param {Boolean} options.isSpecial Determiens if the current symbol is a secial one, like EOF. Default true
	* @param {Rule} options.rule Rule at which this particular instance of a symbol belongs to
	*/
	var symbol = function (options)
	{
		this.options = options;

		k.utils.obj.defineProperty(this, 'name');
		k.utils.obj.defineProperty(this, 'isSpecial');
		k.utils.obj.defineProperty(this, 'rule');

		this.isSpecial = k.utils.obj.isBoolean(options.isSpecial) ? options.isSpecial : true;

		if (!this.name || !k.utils.obj.isString(this.name))
		{
			throw new Error('Invalid initialization values for a symbol, please provide a string name a symbol');
		}
	};
	
	/* @function Shows the symbol's name
	* @returns {String} this.name */
	symbol.prototype.toString = function() {
		return this.name.toString();
	};

	return symbol;
})();

/* Non Terminal
* @class
* @classdesc Use this class to create new instance of non Termianls */
var NonTerminal = k.data.NonTerminal = (function(_super) {
	'use strict';
	
	/* jshint latedef:false */
	k.utils.obj.inherit(nonTerminal, _super);

	/*
	* Creates an instance of a new Non Termianl
	*
	* @constructor
	* @param {String} options.name The name or denatation of the non terminal
	*/
	function nonTerminal (options)
	{
		_super.apply(this, arguments);
		
		k.utils.obj.defineProperty(this, 'isNullable'); // Control if the current non-terminal is nullable or not, This valus is calculate by the grammar's constructor
		
		this.isNullable = false;
		this.isSpecial = false;
	}

	/* @function Creates an array os non terminals from a string that represen them
	 * @param {[Array]} arr Array of string used to create new non terminals
	 * @returns {[NonTerminal]} An array of new nonterminals  */
	nonTerminal.fromArray = function (arr)
	{
		if (!k.utils.obj.isArray(arr) && !k.utils.obj.isString(arr)) {
			throw new Error('Invalid parameter. To create non terminal from array the input parameter should be an array!');
		}
		var result = [];
		k.utils.obj.each(arr, function(nonTerminalName)
		{
			result[result.length] = new NonTerminal({name: nonTerminalName});
		});

		return result;
	};

	return nonTerminal;
})(Symbol);

/* Terminal
* @class
* @classdesc Use this class to repsent Termianls (like 'a', 'B', 'Hola', etc.) */
var Terminal = k.data.Terminal = (function(_super) {
	'use strict';
	
	/* jshint latedef:false */
	k.utils.obj.inherit(terminal, _super);

	/*
	* Creates an instance of a new Termianl
	*
	* @constructor
	* @param {String} options.name The name or denatation of the terminal
	* @param {String|RegExp} options.body The string or regexp used to match the input tokens
	*/
	function terminal (options)
	{
		if (!k.utils.obj.isString(options.body) && !k.utils.obj.isRegExp(options.body)) {
			throw new Error('Invalid Terminal Initialization. A string or regexp body must be specified');
		}
		options.name = options.name ? options.name : options.body.toString();

		_super.apply(this, arguments);

		k.utils.obj.defineProperty(this, 'body');
		k.utils.obj.defineProperty(this, 'isTerminal');
		k.utils.obj.defineProperty(this, 'assoc');

		this.isSpecial = false;
		this.isTerminal = true;
	}

	/* @function Shows the terminal's name between < and >
	* @returns {String} Fromatted string */
	terminal.prototype.toString = function()
	{
		return '<' + this.name + '>';
	};

	return terminal;
})(Symbol);

/* Grammatical Rules
* @class
* @classdesc Use this class to create new instance of non Termianls */
var Rule = k.data.Rule = (function() {
	'use strict';
	
	/*
	* Initialize a new Grammatical Rule
	*
	* @constructor
	* @param {NonTerminal} options.head The name or denatation of the non terminal
	* @param {[Terminal|NonTerminal]} options.tail Array of terminals and nonTerminals that represent the tail of the rule. If is not present an empty tail will be created.
	* @param {Function} options.reduceFunc A function to be executed when reducint this rule
	* @param {String} options.name Identification of the rule instance
	* @param {Number} options.precendence Optional number that indicate the precedence of the current rule
	*/
	var rule = function (options)
	{
		this.options = options;

		if (!options.head)
		{
			throw new Error('Invalid initialization values, please provide a head for the rule');
		}

		//Define alias for:
		k.utils.obj.defineProperty(this, 'head');
		k.utils.obj.defineProperty(this, 'tail');
		k.utils.obj.defineProperty(this, 'reduceFunc');
		k.utils.obj.defineProperty(this, 'name');
		k.utils.obj.defineProperty(this, 'precendence');

		k.utils.obj.defineProperty(this, 'index');
		k.utils.obj.defineProperty(this, 'isProductive'); //Determine if the rule be active part of the grammar. This is calculate by the grammar itself
		k.utils.obj.defineProperty(this, 'isReachable'); //Determine if the rule is reachabke form the start symbol of the grammar. This is calculate by the grammar itself
		k.utils.obj.defineProperty(this, 'terminalsCount'); //Contains the number of terminals in the tail of the current rule

		this.index = -1;
		this.isProductive = false;
		this.isReachable = false;
		this.terminalsCount = 0;

		this.head = !(options.head instanceof NonTerminal) ?
			new NonTerminal({
				name: options.head.toString()
			}) :
			options.head;

		this.tail = (options.tail && k.utils.obj.isArray(options.tail)) ? options.tail : [new Symbol({name: specialSymbol.EMPTY, isSpecial: true})];

		k.utils.obj.each(this.tail, function (symbol)
		{
			if (symbol instanceof Terminal)
			{
				this.terminalsCount++;
			}
			symbol.rule = this;
		}, this);
	};

	/* @function Convert a Rule to its pritty string representation
	* @returns {String} Formatted string */
	rule.prototype.toString = function()
	{
		return this.head.toString() + ' --> ' + this.tail.join(' ');
	};

	return rule;
})();

/* Grammar
* @class
* @classdesc This class is used to represent grammars */
var Grammar = k.data.Grammar = (function () {
	'use strict';
	
	var defaultOptions = {
		name: ''
	};

	/*
	* Initialize a new Grammar
	*
	* @constructor
	* @param {NonTerminal} options.startSymbol Start symbol of the grammar
	* @param {[Rule]} options.rules Array of grammatical rules
	* @param {Boolean} options.preserveNonProductiveRules Determine if non-productive rules should be preserve or not. Default: false
	* @param {Boolean} options.preserveUnReachableRules Determine if unreachable rules should be preserve or not. Default: false
	* @param {String} options.name Optional name of the grammar
	*/
	var grammar = function (options)
	{
		this.options = k.utils.obj.extendInNew(defaultOptions, options || {});

		//Define alias for:
		k.utils.obj.defineProperty(this, 'startSymbol');
		k.utils.obj.defineProperty(this, 'name');
		k.utils.obj.defineProperty(this, 'rules');
		k.utils.obj.defineProperty(this, 'preserveNonProductiveRules');
		k.utils.obj.defineProperty(this, 'preserveUnReachableRules');

		k.utils.obj.defineProperty(this, 'specifiedStartSymbol'); //After augmented the grammar this property save the specified start symbol (it should be read only)
		k.utils.obj.defineProperty(this, 'terminals');
		k.utils.obj.defineProperty(this, 'rulesByHeader');
		k.utils.obj.defineProperty(this, 'firstSetsByHeader');
		k.utils.obj.defineProperty(this, 'nullableNonTerminals');

		if (!(this.startSymbol instanceof Symbol))
		{
			throw new Error('Invalid grammar creation, please specify a start Symbol!');
		}

		this.nullableNonTerminals = [];
		this._generateRequireRequisites();
	};

	grammar.constants = {
		AugmentedRuleName: 'AUGMENTRULE'
	};
	
	/* @function Determines if a rule is productive or not based on the CURRENT state of all the rest of the rules in the grammar
	* @param {Rule} rule Rule that will be analized
	* @returns {Boolean} True if the rule is productive, false otherwise */
	grammar.prototype._isRuleProductive = function (rule)
	{
		//find NONProductive tail symbols
		return !k.utils.obj.find(rule.tail, function (symbol)
		{
			// the tail symnol is a non terminal, that; has rules and its rule are all invalid, OR not have any rule
			if (symbol instanceof NonTerminal &&
				(
					(this.rulesByHeader[symbol.name] && k.utils.obj.every(this.rulesByHeader[symbol.name], function (rule) { return !rule.isProductive; } ) ) ||
					(!this.rulesByHeader[symbol.name])
				)
				)
			{
				return true;
			}
			return false;
		}, this);
	};

	/* @function Generate require state for a grammar.
	* Set rule index
	* Augment the grammar to detect when a string is accepts by adding S' --> S#
	* Calculate rules by head
	* @returns {Void} */
	grammar.prototype._generateRequireRequisites = function ()
	{
		// augment the grammar
	   var augmentedRule = this._augmentGrammar(this.startSymbol, this.startSymbol);

		//set rules index
		k.utils.obj.each(this.rules, function (rule, i) {
			rule.index = i;
		});


		// index rule by its rule's head name
		this._indexRulesByHead();
		
		
		// determine which rules are productive and remove unproductive ones
		augmentedRule = this._cleanUnProductiveRules() || augmentedRule;
		this._indexRulesByHead();
		
		
		//Remove unreachabel rules
		this._cleanUnReachableRules(augmentedRule);
		this._indexRulesByHead();
		
		
		// remove middle tail epsilons
		this._removeMiddleTailEpsilons();


		//Determines nullable non-terminals
		this._determineNullableNonTerminals();
		
		
		// get all terminals & determine if it has empty rules
		this.terminals = this._generateListOfTerminals();
		
		
		//Pre-Calculate First Sets
		this.firstSetsByHeader = this._precalculateFirstTerminals();
	};
	
	/* @function Index all the current rules in the rulesByHeader local property 
	* @returns {Void} It does not return anything as the values are stored in this.rulesByHeader. */
	grammar.prototype._indexRulesByHead = function ()
	{
		this.rulesByHeader = k.utils.obj.groupBy(this.rules, function (rule)
		{
			return rule.head.name;
		});
	};
	
	/* @function Calculate the first set for all non-terminals of the current grammar
	* @returns {Object} Object when each property is a non-terminal name and its values are the first sets. */
	grammar.prototype._precalculateFirstTerminals = function ()
	{
		var result = {};
		
		k.utils.obj.each(k.utils.obj.keys(this.rulesByHeader), function (ruleHead)
		{
			result[ruleHead] = this._calculateFirstSetForHead(ruleHead);
		}, this);
		
		return result;
	};
	
	/* @function Calculate the first set for specific non-terminal symbol
	* @param {String} head Name of the head rule to which the First Set will be determined
	* @param {[String]} recursionStack Internal recursion array used to control infinite loops
	* @returns {[Terminals]} Array of terminals (possibly plus EMPTY - the special symbol) FIRST SET */
	grammar.prototype._calculateFirstSetForHead = function (head, recursionStack)
	{
		/*
		This method has as a preconditions:
		-All duplicated epsilon have already being removed
		-Unreachabel rules have been removed
		-Nullable non terminals detected
		-The rulesByHeader object
		*/
		
		var result = [];
			
		recursionStack = recursionStack || {};
		
		k.utils.obj.each(this.rulesByHeader[head], function(rule) {
			
			k.utils.obj.find(rule.tail, function (symbol)
			{
				if (symbol instanceof NonTerminal)
				{
					if (recursionStack[symbol.name])
					{
						//When we found a recursive (or just a symbol that apear more than one in a same rule or in different rules of the same symbol head) symbol (non-terminal) we SKIP IT (continue with the next item in the tail) IF it is NULLABLE,
						//otherwise if it is NOT NULLABLE we STOP our SEARCH of first item as the current rule will not generate the desire first items (because we are in a recursive case)
						return !symbol.isNullable;
					}
					
					recursionStack[symbol.name] = true;
				}
				else if (symbol.isSpecial && symbol.name === specialSymbol.EOF)
				{
					return true; //finish the search of terminal first symbols for the current rule
				}
				
				if (symbol instanceof Terminal || (symbol.name === specialSymbol.EMPTY && symbol.isSpecial))
				{
					result.push(symbol);
				}
				else if (symbol instanceof NonTerminal)
				{
					result = result.concat(k.utils.obj.flatten(this._calculateFirstSetForHead(symbol.name, recursionStack), true));
				}
				else
				{
					throw new Error('Impossible to calculate FIRST Set, some rules have invalid tail symbols');
				}
				
				//Continue adding items to the FIRST Set if the current result contains EMPTY
				return !k.utils.obj.find(result, function (possible_empty_symbol)
				{
					return possible_empty_symbol.name === specialSymbol.EMPTY;
				});
				
			}, this);
			
		}, this);
		
		return k.utils.obj.uniq(result, false, function (item) {return item.name;});
	};
	
	/* @function Augments the current grammar by adding a new initial production of the form S' -> S #
	* @returns {Rule} The new generated rule */
	grammar.prototype._augmentGrammar = function (newSubStartSymbol, oldStartSymbol)
	{
		this.specifiedStartSymbol = oldStartSymbol;
		var augmentedRule = new Rule({
			head: 'S\'',
			tail: [newSubStartSymbol, new k.data.Symbol({name: specialSymbol.EOF, isSpecial: true})],
			name: grammar.constants.AugmentedRuleName
		});

		this.rules.unshift(augmentedRule);
		this.startSymbol = augmentedRule.head;
		
		return augmentedRule;
	};
	
	/* @function Determiens which rules are non-productive and remove them based on the current options
	* @returns {Rule} In case the affter applying this cleaning process all rule are removed, a new augmented rule is generated and returned */
	grammar.prototype._cleanUnProductiveRules = function ()
	{
		//Remove "Don't make functions within a loop" warning
		/*jshint -W083 */
		var areChanges = false,
			ruleIndex = 0,
			augmentedRule;
		
		do {
			areChanges = false;
			k.utils.obj.each(this.rules, function (rule)
			{
				if (!rule.isProductive)
				{
					rule.isProductive = this._isRuleProductive(rule);
					areChanges = areChanges || rule.isProductive;
				}
			}, this);
		} while (areChanges);
		
		if (!this.preserveNonProductiveRules)
		{
			while (ruleIndex < this.rules.length)
			{
				if (!this.rules[ruleIndex].isProductive) {
					this.rules.splice(ruleIndex, 1);
				} else {
					ruleIndex++;
				}
			}
			
			if (this.rules.length === 0)
			{
				//In this case the augmentation rule does not have a tail! S' --> <EMPTY> EOF
				augmentedRule = this._augmentGrammar(new k.data.Symbol({name: specialSymbol.EMPTY, isSpecial: true}), this.specifiedStartSymbol);
				augmentedRule.index = 0;
			}
		}
		
		return augmentedRule;
	};
	
	/* @function Removes each epsilon located in the middle of a rule's tail, as they no add any value but make more complicated the rest of the parser
	* @returns {Void} */
	grammar.prototype._removeMiddleTailEpsilons = function ()
	{
		var tailIndex = 0;
		k.utils.obj.each(this.rules, function (rule)
		{
			tailIndex = 0;
			
			while (tailIndex < rule.tail.length)
			{
				// if the current tail symbol is an empty one
				if (rule.tail[tailIndex].isSpecial && rule.tail[tailIndex].name === k.data.specialSymbol.EMPTY)
				{
					//if it is not the last one or the previous one is not empty
					if ( ((tailIndex + 1) < rule.tail.length && (!rule.tail[tailIndex + 1].isSpecial || rule.tail[tailIndex + 1].name !== specialSymbol.EOF)) || 
						(tailIndex === (rule.tail.length -1) && tailIndex > 0 && !rule.tail[tailIndex-1].isSpecial) )
					{
						rule.tail.splice(tailIndex, 1);
						--tailIndex;
					}
				}
				tailIndex++;
			}
		});
	};
	
	/* @function Determine which rules are unreachable and based on the current options remove this rules
	* @param {Rule} augmentedRule The extra added new initial rule
	* @returns {Void} */
	grammar.prototype._cleanUnReachableRules = function (augmentedRule)
	{
		//Remove "Don't make functions within a loop" warning
		/*jshint -W083 */
		var areChanges = false,
			ruleIndex = 0;
		
		augmentedRule.isReachable = true;
		do
		{
			areChanges = false;
			k.utils.obj.each(this.rules, function (rule)
			{
				if (rule.isReachable)
				{
					k.utils.obj.each(rule.tail, function (symbol)
					{
						if (symbol instanceof NonTerminal)
						{
							k.utils.obj.each(this.rulesByHeader[symbol.name], function (rule)
							{
								if (!rule.isReachable)
								{
									areChanges = true;
									rule.isReachable = true;
								}
							});
						}
					}, this);
				}
			}, this);
		} while (areChanges);
		
		if (!this.preserveUnReachableRules)
		{
			ruleIndex = 0;
			while (ruleIndex < this.rules.length)
			{
				if (!this.rules[ruleIndex].isReachable) {
					this.rules.splice(ruleIndex, 1);
				} else {
					ruleIndex++;
				}
			}
		}
	};
	
	/* @function Generate a list of all the terminals the current grammar has. This list is used by the Lexer
	* @returns {[Terminal]} An array of all uniq terminals in the current grammar  */
	grammar.prototype._generateListOfTerminals = function ()
	{
		var tailSymbols = k.utils.obj.flatten(
				k.utils.obj.map(this.rules, function (rule)
				{
					return rule.tail;
				}),
				false);

		// remove duplicated symbol (by its name) and filter all non terminals
		return k.utils.obj.filter(
			k.utils.obj.uniq(tailSymbols, false, function (symbol)
			{
				return symbol.name;
			}),
			function (symbol)
			{
				return symbol.isTerminal;
			});
	};

	/* @function Mark all non-terminales that are nullable with a flag isNullable set in true
	* @returns {Void} */
	grammar.prototype._determineNullableNonTerminals = function ()
	{
		//Remove "Don't make functions within a loop" warning
		/*jshint -W083 */
		var allNonTerminalAreNullablesInRule = false,
			areChanges = false;
			
		do {
			areChanges = false;
			
			k.utils.obj.each(this.rules, function (rule)
			{
				if (rule.tail.length === 1 && rule.tail[0].name === k.data.specialSymbol.EMPTY && !rule.head.isNullable)
				{
					rule.head.isNullable = true;
					areChanges = true;
					this.nullableNonTerminals.push(rule.head.name);
				}
				else if (rule.terminalsCount === 0)
				{
					allNonTerminalAreNullablesInRule = k.utils.obj.every(rule.tail, function (nonTerminal)
					{
						return this.nullableNonTerminals.indexOf(nonTerminal.name) >= 0;
					}, this);
					
					if (allNonTerminalAreNullablesInRule && !rule.head.isNullable)
					{
						rule.head.isNullable = true;
						areChanges = true;
						this.nullableNonTerminals.push(rule.head.name);
					}
				}
			}, this);
		} while (areChanges);
		
		var allRulesSymbols = k.utils.obj.flatten(
				k.utils.obj.map(this.rules, function (rule)
				{
					return rule.tail.concat(rule.head);
				}),
				false);
				
		// Mark all non terminals that were determined in the previous step, as nullables. This is require because besides share the same name, each non-temrinal in diferentes rules are different isntances
		var allNullablesNonTerminals = k.utils.obj.filter(allRulesSymbols, function (symbol) {
		   return symbol instanceof NonTerminal && this.nullableNonTerminals.indexOf(symbol.name) >= 0;
		}, this);
		
		k.utils.obj.each(allNullablesNonTerminals, function(nonTerminal) {
			nonTerminal.isNullable = true;
		});
	};

	/* @function Returns the list of rules that start with the specified symbols as the head
	* @param {Symbol} symbol Symbol used as the head of the requested rules
	* @returns {[Rules]} Array of rules */
	grammar.prototype.getRulesFromNonTerminal = function(symbol)
	{
		return this.rulesByHeader[symbol.name];
	};

	/* @function Convert a Grammar to its pritty string representation
	* @returns {String} Formatted string */
	grammar.prototype.toString = function()
	{
		var strResult = this.name ? 'Name: ' + this.name + '\n' : '';
		strResult += 'Start Symbol: ' + this.startSymbol.name +'\n';

		strResult += k.utils.obj.reduce(k.utils.obj.sortBy(this.rules, function(rule) {return rule.index;}), function (strAcc, rule) {
			return strAcc + '\n' + rule.index + '. ' + rule.toString();
		}, '');

		return strResult;
	};

	return grammar;
})();
/* ASTNode
 * @class
 * @classdesc This class reprensent an AST NODE, a sub-type of a generic Node */
k.data.ASTNode = (function(_super) {
	'use strict';
	
	/* jshint latedef:false */
	k.utils.obj.inherit(astNode, _super);
	
	/*
	 * Constructor AST Node
	 *
	 * @constructor
	 * @param {Rule} options.rule Asociated reduce rule that originate the node creation
	 * @param {String} options.stringValue Optional string chunk that originate the node creation
	 * @param {Symbol} options.symbol Optional Symbol. Used ad the head of the rule that is related with the current ASTNode
	 * @param {[Object]} options.transitions Array of object that initialy compone this node
	 * @param {[Node]} options.nodes Array of Nodes instances (or just objects) that are children of this Node
	 */
	function astNode (options)
	{
		_super.apply(this, arguments);

		k.utils.obj.defineProperty(this, 'rule');
		k.utils.obj.defineProperty(this, 'stringValue');
		k.utils.obj.defineProperty(this, 'currentValue');
		k.utils.obj.defineProperty(this, 'symbol');
	}

	/* @function Generates a string representation of the current AST Node
	 * @param {Boolean} options.deep True in case to print the entire node and its children
	 * @returns {String} formatted string */
	astNode.prototype.toString = function(options)
	{
		if (options && !k.utils.obj.isUndefined(options.deep))
		{
			options.deep = k.utils.obj.isNumber(options.deep) ? options.deep : 0;
			var tabs = k.utils.str.tabs(options.deep);
			++options.deep;
			
			return tabs + this._toCurrentString() + '\n' + k.utils.obj.reduce(this.nodes, function (acc, node) {
				return acc + (k.utils.obj.isString(node) ? k.utils.str.tabs(options.deep) + node + '\n' : node.toString({deep: options.deep}));
			},'');
		} 
		
		return this._toCurrentString();
	};
	
	/* @function Generates a string representation of the current AST Node
	 * @returns {String} formatted string */
	astNode.prototype._toCurrentString = function ()
	{
		return this.getIdentity() + (this.rule ? ': '+ this.rule.toString() + ' (' + this.currentValue + ')' : '');
	};
	
	return astNode;
})(k.data.Node);
/* Item Rule
* @class
* @classdesc This class represent an Item. A rule being processed. Generally a dot is used to represent which part have already been
processed. Ex. S ==> aB*AB */
var ItemRule = k.data.ItemRule = (function() {
	'use strict';
	
	var defaultCloneOptions = {
		dotLocationIncrement: 0
	};

	/*
	* Constructor for a Item Rule
	*
	* @constructor
	* @param {Rule} options.rule Rule wich is pointed be this item
	* @param {Integer} options.dotLocation Index at the tail of the rule that have already been processed
	*/
	var itemRule = function(options)
	{
		this.options = options;

		//Define alias for the next properties
		k.utils.obj.defineProperty(this, 'rule');
		k.utils.obj.defineProperty(this, 'dotLocation');
		k.utils.obj.defineProperty(this, 'lookAhead');
		
		k.utils.obj.defineProperty(this, '_id');

		this.lookAhead = this.lookAhead || [];
		this.dotLocation = options.dotLocation || 0;
		
		if (this.rule && this.rule.tail.length === 1 && this.rule.tail[0].name === k.data.specialSymbol.EMPTY)
		{
			//Empty rules are reduce items
			this.dotLocation = 1;
		}
	};

	/* @function Convert the current item rule to its string representation
	* @returns {String} formatted string */
	itemRule.prototype.toString = function()
	{
		var aux = this.getIdentity() + '.  ' + this.rule.head.name +'-->';
		for (var i = 0; i < this.rule.tail.length; i++)
		{
			aux += (this.dotLocation === i ? '*': ' ') + this.rule.tail[i].toString();
		}
		if (this.dotLocation === i) {
			aux += '*';
		}
		aux += ',    [' + this.lookAhead.join(', ') + ']';
		return aux;
	};

	/* @function Clone the current item, altering its state by the params specified in cloneUpdateOptions
	* @param {Integer} cloneUpdateOptions.dotLocationIncrement Increment that will be applied into the dot location of the new item. Default: 0
	* @param {Object} creationOptions Optional object use to expand current option used to create the returned clone
	* @returns {ItemRule} A clean new item */
	itemRule.prototype.clone = function(cloneUpdateOptions, creationOptions)
	{
		var updateOptions = k.utils.obj.extendInNew(defaultCloneOptions, cloneUpdateOptions || {}),
			cloneOptions = this._cloneCurrentOptions(cloneUpdateOptions, creationOptions);

		var result = new ItemRule(cloneOptions);
		result._incrementDotLocation(updateOptions.dotLocationIncrement);
		result._id = null;

		return result;
	};

	/* @function Clone the current item's options
	* @param {Object} cloneUpdateOptions Optional object use to control the way the options are being cloned
	* @param {Object} extendedOptions Optional object use to expand current options and create the returned clone
	* @returns {Object} A copy of the current options (The referenced rule is not copied, hte same rule instance is used) */
	itemRule.prototype._cloneCurrentOptions = function(cloneUpdateOptions, extendedOptions)
	{
		var ruleAux = this.rule,
			lookAheadAux = this.lookAhead;
			
		this.rule = this.lookAhead = null;
		
		var result = k.utils.obj.extendInNew(this.options, extendedOptions || {});
		
		this.rule = result.rule = ruleAux;
		this.lookAhead = lookAheadAux;
		result.lookAhead = [].concat(lookAheadAux);

		return result;
	};

	/* @function Increase the dot location by the number specified by parameter
	* @param {Integer} increment Increment that will be applied into the dot location of the new item. Default: 1
	* @returns {Void} */
	itemRule.prototype._incrementDotLocation = function(increment)
	{
		var optionsValue = k.utils.obj.isNumber(this.options.dotLocation) ? this.options.dotLocation : 0,
			incrementValue = k.utils.obj.isNumber(increment) ? increment : 1;

		this.dotLocation = optionsValue + incrementValue;
	};
	
	/* @function Gets a string id that uniquely identity the current item rule
	* @returns {String} Id */
	itemRule.prototype.getIdentity = function ()
	{
		if (!this._id)
		{
			this._id = this._generateIdentity();
		}
		return this._id;
	};
	
	/* @function Internal method to generate a unique Id
	* @returns {String} Id */
	itemRule.prototype._generateIdentity = function ()
	{
		return this.rule.index + '(' + this.dotLocation + ')';
	};

	/* @function Returns the right next symbol to the dot location
	* @returns {Symbol} Next symbol or null if there is not next symbol */
	itemRule.prototype.getCurrentSymbol = function ()
	{
		// When the dot location is the same as tail length is a reduce item.
		// In this case the next item is null
		return this.dotLocation < (this.rule.tail.length + 1) ? this.rule.tail[this.dotLocation] : null;
	};
	
	/* @function Determines if the current item rule is a reduce one or not
	* @returns {Boolean} True if the current item is a reduce item, false otherwise */
	itemRule.prototype.isReduce = function ()
	{
		return this.dotLocation === this.rule.tail.length;
	};

	/* @function Create an array of item rules from an array of rules
	* @param {[Rule]} rules Array of rules used to create the item rules. Each new item rule will have 0 as dot location
	* @param {[Symbol]} lookAhead Array of symbols that will be set to each of the item rules created as its lookahead array
	* @returns {[ItemRule]} Array of new Item Rules */
	itemRule.newFromRules = function(rules, lookAhead)
	{
		return k.utils.obj.reduce(rules, function (acc, rule)
		{
			acc.push(new ItemRule({
				rule: rule,
				dotLocation: 0,
				lookAhead: [].concat(lookAhead || [])
			}));
			return acc;
		}, []);
	};

	return itemRule;
})();

/* global expect: true, describe: true, it:  true, beforeEach: true */
k.data.sampleGrammars = {
	/*
	001. Very simple grammar to represent number divisions
	*/
	numDivs: (function() {
		'use strict';
		/*
		LR(1)
		0. S --> E
		1. E --> E Q F
		2. E --> F
		3. Q --> '%'
		4. F --> 'number
		*/
		var S = new k.data.Rule({
			head: 'S',
			tail: k.data.NonTerminal.fromArray(['E']),
			name: 'SRULE'
		}),

			E1 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['E','Q', 'F']),
				name: 'E1RULE'
			}),
	
			E2 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['F']),
				name: 'E2RULE'
			}),
	
			Q = new k.data.Rule({
				head: 'Q',
				tail: [new k.data.Terminal({name:'DIV', body: /\//})],
				name: 'QRULE'
			}),
	
			F = new k.data.Rule({
				head: 'F',
				tail: [new k.data.Terminal({name:'NUMBER', body: /\d/})],
				name: 'FRULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, E1, E2, Q, F],
				name: 'numDivs'
			}),
			S: S,
			E1: E1,
			E2: E2,
			Q: Q,
			F: F
		};
	})(),

	/*
	002. Very simple list of ids (letters) divides by spaces between '(' and ')'
	*/
	idsList: (function() {
		'use strict';
		/*
		LR(1)
		1. S --> OPAREN EXPS CPAREN
		2. EXPS --> EXPS EXP
		3. EXPS --> <EMPTY>
		4. EXP --> 'id'
		5. OPAREN --> '('
		6. CPAREN --> ')'
		*/
		var S = new k.data.Rule({
			head: 'S',
			tail: k.data.NonTerminal.fromArray(['OPAREN','EXPS','CPAREN']),
			name: 'SRULE'
		}),

			EXPS1 = new k.data.Rule({
				head: 'EXPS',
				tail: k.data.NonTerminal.fromArray(['EXPS','EXP']),
				name: 'EXPS1RULE'
			}),
	
	        EXPS2 = new k.data.Rule({
				head: 'EXPS',
				name: 'EXPS2RULE'
			}),
	
			EXP = new k.data.Rule({
				head: 'EXP',
				tail: [new k.data.Terminal({name:'id_terminal', body: /[a-zA-Z]+/})],
				name: 'EXPRULE'
			}),
	
			OPAREN = new k.data.Rule({
				head: 'OPAREN',
				tail: [new k.data.Terminal({name:'oparen_terminal', body: /\(/})],
				name: 'OPARENRULE'
			}),
	
			CPAREN = new k.data.Rule({
				head: 'CPAREN',
				tail: [new k.data.Terminal({name:'cparen_terminal', body: /\)/})],
				name: 'CPARENRULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, EXPS1, EXPS2, EXP, OPAREN, CPAREN],
				name: 'idsList'
			}),
			S: S,
			EXPS1: EXPS1,
			EXPS2: EXPS2,
			EXP: EXP,
			OPAREN: OPAREN,
			CPAREN: CPAREN
		};
	})(),
	
	/*
	003. Very simple grammar to represent number divisions with epsilon rule
	*/
	numDivsEmpty: (function() {
		'use strict';
		/*
		LR(1)
		0. S --> E
		1. E --> E Q F
		2. E --> F
		3. Q --> '%'
		4. Q --> <EMPTY>
		5. F --> 'number'
		
		*/
		var S = new k.data.Rule({
			head: 'S',
			tail: k.data.NonTerminal.fromArray(['E']),
			name: 'SRULE'
		}),

			E1 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['E','Q', 'F']),
				name: 'E1RULE'
			}),
	
			E2 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['F']),
				name: 'E2RULE'
			}),
	
			Q1 = new k.data.Rule({
				head: 'Q',
				tail: [new k.data.Terminal({name:'DIV', body: /\//})],
				name: 'Q1RULE'
			}),
			
			Q2 = new k.data.Rule({
				head: 'Q',
				name: 'Q2RULE'
			}),
	
			F = new k.data.Rule({
				head: 'F',
				tail: [new k.data.Terminal({name:'NUMBER', body: /\d/})],
				name: 'FRULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, E1, E2, Q1, Q2, F],
				name: 'numDivsEmpty'
			}),
			S: S,
			E1: E1,
			E2: E2,
			Q1: Q1,
			Q2: Q2,
			F: F
		};
	})(),
	
	/*
	004. Very simple grammar for difference of numbers
	*/
	numDiff: (function() {
		'use strict';
		/*
		LR(k>1)
		1. S --> E
		2. E --> E R T
		3. E --> T
		4. T --> 'number'
		5. T --> OPAREN E CPAREN
		6. OPAREN --> '('
		7. CPAREN --> ')'
		8. R --> '-'
		*/
		var S = new k.data.Rule({
				head: 'S',
				tail: k.data.NonTerminal.fromArray(['E']),
				name: 'SRULE'
			}),
	
			E1 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['E', 'R', 'T']),
				name: 'E1RULE'
			}),
	
			E2 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['T']),
				name: 'E2RULE'
			}),
	
			T1 = new k.data.Rule({
				head: 'T',
				tail: [new k.data.Terminal({name:'NUMBER', body: /\d/})],
				name: 'T1RULE'
			}),
			
			T2 = new k.data.Rule({
				head: 'T',
				tail: k.data.NonTerminal.fromArray(['OPAREN', 'E', 'CPAREN']),
				name: 'T2RULE'
			}),
			
			OPAREN = new k.data.Rule({
				head: 'OPAREN',
				tail: [new k.data.Terminal({name:'OPAREN', body: /\(/})],
				name: 'OPARENRULE'
			}),
	
			CPAREN = new k.data.Rule({
				head: 'CPAREN',
				tail: [new k.data.Terminal({name:'CPAREN', body: /\)/})],
				name: 'CPARENRULE'
			}),
	
			R = new k.data.Rule({
				head: 'R',
				tail: [new k.data.Terminal({name:'DIFF', body: '-'})],
				name: 'RRULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, E1, E2, T1, T2, OPAREN, CPAREN, R],
				name: 'numDiff'
			}),
			S: S,
			E1: E1,
			E2: E2,
			T1: T1,
			T2: T2,
			OPAREN: OPAREN,
			CPAREN: CPAREN,
			R:R
		};
	})(),
	
	/*
	005. Very simple grammar for a*b (b, ab, aab, aaaaaaab)
	*/
	aPlusb: (function() {
		'use strict';
		/*
		LR(0)
		1. A --> 'a' A
		2. A --> 'b'
		*/
		var A1 = new k.data.Rule({
				head: 'A',
				tail: [new k.data.Terminal({name:'A_LET', body: 'a'}), new k.data.NonTerminal({name: 'A'})],
				name: 'A1RULE'
			}),
	
			A2 = new k.data.Rule({
				head: 'A',
				tail: [new k.data.Terminal({name:'B_LET', body: 'b'})],
				name: 'A2RULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: A1.head,
				rules: [A1, A2],
				name: 'aPlusb'
			}),
			A1: A1,
			A2: A2
		};
	})(),
	
	/*
	006. Very simple grammar for a*
	*/
	aPlusEMPTY: (function () {
		'use strict';
		/*
		LR(1)
		1. S --> 'a' S
		2. S --> EMPTY
		*/
		var S1 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Terminal({name:'A_LET', body: 'a'}), new k.data.NonTerminal({name: 'S'})],
				name: 'S1RULE'
			}),
			
			S2 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Symbol({name:k.data.specialSymbol.EMPTY})],
				name: 'S2RULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S1.head,
				rules: [S1, S2],
				name:'aPlusEMPTY'
			}),
			S1: S1,
			S2: S2
		};
	})(),

	/*
	007. Condenced version of the grammar numDiff (same language)
	*/
	numDiffCondenced: (function() {
		'use strict';
		/*
		LR(1)
		1. S --> E
		2. E --> E '-' T
		3. E --> T
		4. T --> 'number'
		5. T --> '(' E ')'
		*/
		var S = new k.data.Rule({
				head: 'S',
				tail: k.data.NonTerminal.fromArray(['E']),
				name: 'SRULE'
			}),
	
			E1 = new k.data.Rule({
				head: 'E',
				tail: [new k.data.NonTerminal({name: 'E'}), new k.data.Terminal({name:'DIFF', body: '-'}), new k.data.NonTerminal({name: 'T'})],
				name: 'E1RULE'
			}),
	
			E2 = new k.data.Rule({
				head: 'E',
				tail: k.data.NonTerminal.fromArray(['T']),
				name: 'E2RULE'
			}),
	
			T1 = new k.data.Rule({
				head: 'T',
				tail: [new k.data.Terminal({name:'NUMBER', body: /\d/})],
				name: 'T1RULE'
			}),
			
			T2 = new k.data.Rule({
				head: 'T',
				tail: [new k.data.Terminal({name:'OPAREN', body: /\(/}), new k.data.NonTerminal({name: 'E'}), new k.data.Terminal({name:'CPAREN', body: /\)/})],
				name: 'T2RULE'
			});

		return {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules: [S, E1, E2, T1, T2],
				name: 'numDiffCondenced'
			}),
			S: S,
			E1: E1,
			E2: E2,
			T1: T1,
			T2: T2
		};
	})(),
	
	/*
	008. Simple a^(n+1)b^(n) Grammar
	*/
	aPowN1b: (function () {
		'use strict';
		/*
		LR(1)
		1. S --> AD
		2. A --> 'a' A 'b'
		3. A --> 'a'
		4. D --> 'd'
		*/
		var S = new k.data.Rule({
				head: 'S',
				tail: k.data.NonTerminal.fromArray(['A','D']),
				name: 'SRULE'
			}),
			
			A1 = new k.data.Rule({
				head: 'A',
				tail: [new k.data.Terminal({name:'a_terminal', body: 'a'}), new k.data.NonTerminal({name: 'A'}), new k.data.Terminal({name:'b_terminal', body: 'b'})],
				name: 'A1RULE'
			}),
			
			A2 = new k.data.Rule({
				head: 'A',
				tail: [new k.data.Terminal({name:'a_terminal', body: 'a'})],
				name: 'A2RULE'
			}),
			
			D = new k.data.Rule({
				head: 'D',
				tail: [new k.data.Terminal({name:'d_terminal', body: 'd'})],
				name: 'DRULE'
			});
			
		return  {
			g: new k.data.Grammar({
				startSymbol: S.head,
				rules:[S,A1,A2,D],
				name:'aPowN1b'
			}),
			S:S,
			A1:A1,
			A2:A2,
			D:D
		};
	})(),
	
	/*
	009. Simple a^(n+1)b^(n) Grammar
	*/
	selectedBs: (function () {
		'use strict';
		/*
		LR(0)
		1. S --> 'b'
		2. S --> '(' L ')'
		3. L --> S
		4. L --> L ';' S
		*/
		var S1 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Terminal({name:'b_terminal', body: 'b'})],
				name: 'S1RULE'
			}),
			
			S2 = new k.data.Rule({
				head: 'S',
				tail: [new k.data.Terminal({name:'oparen_terminal', body: '('}), new k.data.NonTerminal({name: 'L'}), new k.data.Terminal({name:'cparen_terminal', body: ')'})],
				name: 'S2RULE'
			}),
			
			L1 = new k.data.Rule({
				head: 'L',
				tail: [new k.data.NonTerminal({name:'S'})],
				name: 'L1RULE'
			}),
			
			L2 = new k.data.Rule({
				head: 'L',
				tail: [new k.data.NonTerminal({name:'L'}), new k.data.Terminal({name:'semicol_terminal', body: ';'}), new k.data.NonTerminal({name:'S'})],
				name: 'L2RULE'
			});
			
		return  {
			g: new k.data.Grammar({
				startSymbol: S1.head,
				rules:[S1, S2, L1, L2],
				name:'selectedBs'
			}),
			S1:S1,
			S2:S2,
			L1:L1,
			L2:L2
		};
	})(),
	
	/*
	010. Grammar for simple arithmetic expressions
	*/
	arithmetic: (function () {
		'use strict';
		/*
		LR(1)
		1. E --> E '+' E
		2. E --> E '-' E
		3. E --> E '*' E
		4. E --> E '/' E
		5. E --> (E) 
		. E --> \d
		*/
		var E_NT = new k.data.NonTerminal({name: 'E'}),
			
			plus_T = new k.data.Terminal({name:'plus_terminal', body: '+', assoc: k.data.associativity.LEFT}),
			minus_T = new k.data.Terminal({name:'minus_terminal', body: '-', assoc: k.data.associativity.LEFT}),
			multi_T = new k.data.Terminal({name:'multi_terminal', body: '*', assoc: k.data.associativity.LEFT}),
			div_T = new k.data.Terminal({name:'div_terminal', body: '/', assoc: k.data.associativity.LEFT}),
			oparen_T = new k.data.Terminal({name:'oparen_terminal', body: '('}),
			cparen_T = new k.data.Terminal({name:'cparen_terminal', body: ')'}),
			number_T = new k.data.Terminal({name:'number_terminal', body: /\d+/}),
			
			E1 = new k.data.Rule({
				head: E_NT.name,
				tail: [E_NT, plus_T, E_NT],
				reduceFunc: function (expressionsParams)
				{
					return expressionsParams.values[0] + expressionsParams.values[2];
				},
				precendence: 10,
				name: 'EPLUSRULE'
			}),
			
			E2 = new k.data.Rule({
				head: E_NT.name,
				tail: [E_NT, minus_T, E_NT],
				reduceFunc: function (expressionsParams)
				{
					return expressionsParams.values[0] - expressionsParams.values[2];
				},
				precendence: 10,
				name: 'EMINUSRULE'
			}),
			
			E3 = new k.data.Rule({
				head: E_NT.name,
				tail: [E_NT, multi_T, E_NT],
				reduceFunc: function (expressionsParams)
				{
					return expressionsParams.values[0] * expressionsParams.values[2];
				},
				precendence: 20,
				name: 'EMULTIRULE'
			}),
			
			E4 = new k.data.Rule({
				head: E_NT.name,
				tail: [E_NT, div_T, E_NT],
				reduceFunc: function (expressionsParams)
				{
					return expressionsParams.values[0] / expressionsParams.values[2];
				},
				precendence: 20,
				name: 'EDIVRULE'
			}),
			
			E5 = new k.data.Rule({
				head: E_NT.name,
				tail: [oparen_T, E_NT, cparen_T],
				reduceFunc: function (expressionsParams)
				{
					return expressionsParams.values[1];
				},
				precendence: 30,
				name: 'EPARENRULE'
			}),
			
			EN = new k.data.Rule({
				head: E_NT.name,
				tail: [number_T],
				reduceFunc: function (numberParam)
				{
					return parseInt(numberParam.values[0]);
				},
				name: 'ENUMBERRULE'
			});
			
		return  {
			g: new k.data.Grammar({
				startSymbol: E1.head,
				rules:[E1, E2, E3, E4, E5, EN],
				name:'arithmetic'
			}),
			plus_T:plus_T,
			minus_T:minus_T,
			multi_T:multi_T,
			div_T:div_T,
			number_T:number_T,
			
			E1:E1,
			E2:E2,
			E3:E3,
			E4:E4,
			E5:E5,
			EN:EN
		};
	})()
};
/* StackItem
* @class
* @classdesc Each instance of this class will be used by the parse to represent a state into the stack */
k.data.StackItem = (function() {
	'use strict';
	/*
	* Creates an instance of a Parser 
	*
	* @constructor
	* @param {Object} options.state (Require) The current state
	* @param {Object} options.currentValue The Optional result of getting this stack Item. This property is used by the grammar creator to make on-going processing of the being build AST.
	* @param {Symbol} options.stringValue In case that this stack item is created by a TERMINAL reduction or shift, the associated string that generate the stack item creation is attached.
	* @param {Symbol} options.symbol The Optional Current Symbol of the stack item
	* @param {Automata} options.AST Optional underprocessing AST. The Sub-tree AST for the current node
	*/
	var stackItem = function(options) {
		this.options = options;

		k.utils.obj.defineProperty(this, 'state');
		k.utils.obj.defineProperty(this, 'currentValue');
		k.utils.obj.defineProperty(this, 'stringValue');
		k.utils.obj.defineProperty(this, 'symbol');
		k.utils.obj.defineProperty(this, 'AST');
		
		if (!this.state) {
			throw new Error('Invalid initialization values for a Stack Item, please provide a valid state');
		}
	};
	
	return stackItem;
})();

/* State
 * @class
 * @classdesc This class reprensent an automata state, a sub-type of a generic Node */
k.data.State = (function(_super)
{
	'use strict';
	/* jshint latedef:false */
	k.utils.obj.inherit(state, _super);
	
	/*
	 * Constructor Automata State
	 *
	 * @constructor
	 * @param {[ItemRule]} options.items Array of item rules that initialy compone this state
	 * @param {[Object]} options.transitions Array of object that initialy compone this node
	 * @param {[Node]} options.nodes Array of State instances that are children of this State
	 */
	function state (options) {
		
		_super.apply(this, arguments);

		k.utils.obj.defineProperty(this, 'isAcceptanceState'); // This is set by the automata generator
		
		k.utils.obj.defineProperty(this, '_items');
		k.utils.obj.defineProperty(this, '_registerItems');
		k.utils.obj.defineProperty(this, '_index');
		k.utils.obj.defineProperty(this, '_condencedView');

		this.isAcceptanceState = false;
		
		this._items = options.items || [];
		options.items = null;
		this._index = 0;
		this._registerItems = {};

		this._registerItemRules();
	}
	
	/* @function REgister the list of item rules of the current stateso they are assesible by its id
	 * @returns {Void} */
	state.prototype._registerItemRules = function ()
	{
		k.utils.obj.each(this._items, function (itemRule)
		{
			this._registerItems[itemRule.getIdentity()] = itemRule;
		}, this);
	};
	
	state.constants = {
		AcceptanceStateName: 'AcceptanceState'
	};

	/* @function Get the next unprocessed item rule
	 * @returns {ItemRule} Next Item Rule */
	state.prototype.getNextItem = function() {
		return this._index < this._items.length ? this._items[this._index++] : null;
	};

	/* @function Adds an array of item rule into the state. Only the rules that are not already present in the state will be added
	 * @param {[ItemRule]} itemRules Array of item rules to add into the state
	 * @param {Boolean} options.hasLookAhead Determines if the adding action should take into account lookAhead (to merge them) when the item rule are already present
	 * @returns {void} Nothing */
	state.prototype.addItems = function(itemRules, options) {
		this._id = null;
		k.utils.obj.each(itemRules, function (itemRule)
		{
			// The same item rule can be added more than once if the grammar has loops.
			// For sample: (1)S -> A *EXPS B      (2)EXPS -> *EXPS
			if (!this._registerItems[itemRule.getIdentity()])
			{
				this._registerItems[itemRule.getIdentity()] = itemRule;
				this._items.push(itemRule);
			}
			else if (options && options.hasLookAhead)
			{
				//As the way to of generating a LR(1) automata adds a item rule for each lookAhead we simply merge its lookAheads
				var mergedLookAheads = this._registerItems[itemRule.getIdentity()].lookAhead.concat(itemRule.lookAhead);
				this._registerItems[itemRule.getIdentity()].lookAhead = k.utils.obj.uniq(mergedLookAheads, function (item) { return item.name;});
			}
		}, this);
	};

	/* @function Convert the current state to its string representation
	 * @returns {String} formatted string */
	state.prototype.toString = function() {
		var strResult = 'ID: ' + this.getIdentity() + '\n' +
						this._items.join('\n') +
						'\nTRANSITIONS:\n';
						
		k.utils.obj.each(this.transitions, function (transition)
		{
			strResult += '*--' + transition.symbol + '-->' + transition.state.getIdentity() + '\n';
		});
		return strResult;
	};
	
	/* @function Returns the condenced (one line) string that reprenset the current 'state' of the current state
	 * @returns {String} State Representation in one line  */
	state.prototype.getCondencedString = function() {
		if(!this._condencedView)
		{
			this._condencedView = this._generateCondencedString();
		}
		return this._condencedView;
	};
	
	/* @function Internal method to generate a condenced (one line) string that reprenset the current 'state' of the current state
	 * @returns {String} State Representation in one line  */
	state.prototype._generateCondencedString = function() {
		return  k.utils.obj.map(
			k.utils.obj.sortBy(this._items, function(item)
			{
				return item.rule.index;
			}),
			function (item) {
				return item.rule.index;
			}).join('-');
	};
	
	/* @function Generates an ID that identify this state from any other state
	 * @returns {String} Generated ID  */
	state.prototype._generateIdentity = function() {
		
		if (this.isAcceptanceState)
		{
			return state.constants.AcceptanceStateName;
		}
		else if (!this._items.length)
		{
			return _super.prototype._generateIdentity.apply(this, arguments);    
		}
	
		return k.utils.obj.reduce(
			k.utils.obj.sortBy(this._items, function(item)
			{
				return item.rule.index;
			}),
			function (acc, item) {
				return acc + item.getIdentity(); //.rule.index + '(' + item.dotLocation + ')';
			}, '');
	};

	/* @function Returns a copy the items contained in the current state
	 * @returns {[ItemRule]} Array of cloned item rules  */
	state.prototype.getItems = function() {
		return k.utils.obj.map(this._items, function(item) {
			return item.clone();
		});
	};
	
	/* @function Returns an orignal item rule based on its id.
		This method is intended to be use as READ-ONLY, editing the returned items will affect the state and the rest of the automata at with this state belongs to.
	 * @returns {[ItemRule]} Array of current item rules  */
	state.prototype.getOriginalItems = function() {
		return this._items;
	};
	
	/* @function Returns an orignal item rule based on its id.
		This method is intended to be use as READ-ONLY, editing the returned items will affect the state and the rest of the automata at with this state belongs to.
	 * @returns {ItemRule} Item rule corresponding to the id passed in if present or null otherwise  */
	state.prototype.getOriginalItemById = function(id) {
		return this._registerItems[id];
	};

	/** @function Get the list of all supported symbol which are valid to generata transition from the current state.
	 * @returns {[Object]} Array of object of the form: {symbol, items} where items have an array of item rules  */
	state.prototype.getSupportedTransitionSymbols = function() {
		var itemsAux = {},
			result = [],
			symbol;

		k.utils.obj.each(this._items, function (item)
		{
			symbol = item.getCurrentSymbol();
			if (symbol)
			{
				if (itemsAux[symbol.name]) {
					itemsAux[symbol.name].push(item);
				}
				else
				{
					itemsAux[symbol.name] = [item];
					result.push({
						symbol: symbol,
						items: itemsAux[symbol.name]
					});
				}
			}
		});

		return result;
	};

	/* @function Responsible of new transitions. We override this method to use the correct variable names and be more meanful
	 * @param {Symbol} symbol Symbol use to make the transition, like the name of the transition
	 * @param {State} state Destination state arrived when moving with the specified tranisiotn
	 * @returns {Object} Transition object  */
	state.prototype._generateNewTransition = function (symbol, state) {
		return {
			symbol: symbol,
			state: state
		};
	};
	
	/* @function Returns the list of item rules contained in the current state that are reduce item rules.
	 * @returns {[ItemRule]} Recude Item Rules  */
	state.prototype.getRecudeItems = function () {
		return k.utils.obj.filter(this._items, function (item) {
			return item.isReduce();
		});   
	};
	
	/* @function Determine if the current state is valid or not.
	 * @param {Boolean} options.considerLookAhead Indicate if the state should take into account look ahead to validate. Default: false
	 * @param {Automata} options.automata Optional automata instance used to pass to the conflict resolver in case there are conflict and resolvers.
	 * @param {[ConflictResolver]} options.conflictResolvers List of conflict resolvers used to resolve possible conflict at the current state.
	 * @returns {Boolean} true if the state is valid (invalid), false otherwise (inconsistent) */
	state.prototype.isValid = function(options) {
		//NOTE: Important! When usign this method for LR(0) without taking into account lookAhead, the current implementation DOES NOT USE RESOLVERS IN THIS CASE! it just return false if invalid
		options = k.utils.obj.isObject(options) ? options : {};
		options.conflictResolvers = options.conflictResolvers || [];
		
		var reduceItems = this.getRecudeItems(),
			self = this,
			isTheConflictResolvableWithResolvers = false;
		
		if (!options.considerLookAhead || !reduceItems.length)
		{
			return !(reduceItems.length !== this._items.length && reduceItems.length > 0 || reduceItems.length > 1);
		}
		
		var shiftItems = k.utils.obj.filter(this._items, function (item)
			{
				return !item.isReduce();
			});
		
		//Check for SHIFT/REDUCE Conflicts
		if (shiftItems.length && reduceItems.length)
		{
			var shiftReduceResolvers = k.utils.obj.sortBy(k.utils.obj.filter(options.conflictResolvers, function (resolver)
			{
				return resolver.type === k.parser.conflictResolverType.STATE_SHIFTREDUCE;
			}), 'order');
			
			//Generla Idea: For each shift item rule validate that the shift symbol is not in any lookAhead symbol of any reduce rule
			
			//For each shift item
			var isAnyShiftReduceConflict = k.utils.obj.any(shiftItems, function (shiftItem)
			{
				//get the shift symbol
				var shiftSymbol = shiftItem.getCurrentSymbol();
				
				//find among all reduce items
				return k.utils.obj.find(reduceItems, function (reduceItem)
				{
					//if the shift symbol is in any reduce item rule's lookAhead set.
					
					var isShiftSymbolInReduceLookAhead = k.utils.obj.find(reduceItem.lookAhead, function (lookAheadSymbol) { return lookAheadSymbol.name === shiftSymbol.name;});
					if (isShiftSymbolInReduceLookAhead)
					{
						isTheConflictResolvableWithResolvers = k.utils.obj.find(shiftReduceResolvers, function (resolver)
						{
							return resolver.resolve(options.automata, self, shiftItem, reduceItem);
						});
						
						return !isTheConflictResolvableWithResolvers;
					}
					
					return false;
				});
			});
			
			if (isAnyShiftReduceConflict)
			{
				return false;
			}
		}
		
		//Check for REDUCE/REDUCE Conflicts
		if (reduceItems.length > 1)
		{
			var reduceReduceResolvers = k.utils.obj.sortBy(k.utils.obj.filter(options.conflictResolvers, function (resolver)
				{
					return resolver.type === k.parser.conflictResolverType.STATE_REDUCEREDUCE;
				}), 'order');
				
			//General Idea: For each reduce rule, validate that its look Ahead set is disjoin with the rest of the reduce rule
				
			//for each reduce rule
			var isAnyReduceReduceConflict = k.utils.obj.any(reduceItems, function (reduceItemSelected)
			{
				//compare it with each of the other reduce rules
				return k.utils.obj.find(reduceItems, function (reduceItemInspected)
				{
					if (reduceItemInspected.getIdentity() === reduceItemSelected.getIdentity())
					{
						return false;
					}
					
					//and for each look ahead symbol of the first reduce rule, validate the it is not present in any other look Ahead
					var isLookAheadSymbolInOtherLookAheadSet = k.utils.obj.find(reduceItemSelected.lookAhead, function (lookAheadSelected)
					{
						return k.utils.obj.find(reduceItemInspected.lookAhead, function (lookAheadSymbol) { return lookAheadSymbol.name === lookAheadSelected.name;});
					});
					
					if (isLookAheadSymbolInOtherLookAheadSet)
					{
						isTheConflictResolvableWithResolvers = k.utils.obj.find(reduceReduceResolvers, function (resolver)
						{
							return resolver.resolve(options.automata, self, reduceItemSelected, reduceItemInspected);
						});
						
						return !isTheConflictResolvableWithResolvers;
					}
					
					return false;
				});
				
			});
			
			if (isAnyReduceReduceConflict)
			{
				return false;
			}
		}
		
		return true;
	};
	
	/* @function Generates the list of shift and reduce items that take part iin the current state. Validating at the same time that none of these items are in conflict
		or that the conflicts are solvable.
	 * @param {Boolean} options.considerLookAhead Indicate if the state should take into account look ahead to validate. If not the state will validate and generate the result as in a LR(0). Default: false
	 * @param {Automata} options.automata Optional automata instance used to pass to the conflict resolver in case there are conflict and resolvers.
	 * @param {[ConflictResolver]} options.conflictResolvers List of conflict resolvers used to resolve possible conflict at the current state.
	 * @param {Boolean} options.ignoreErrors Indicate if when facing an error (a conflict that can not be solve by any resolver) continue the execution. Default: false
	 * @returns {Object} An object containg two properties (arrays) shiftItems and reduceItems */
	state.prototype.getShiftReduceItemRule = function(options) {
		//NOTE: Important! When using this method for LR(0) without taking into account lookAhead, the current implementation DOES NOT USE RESOLVERS IN THIS CASE! it just return false if invalid
		//NOTE: Important! When using this method for LR(0) without taking into account lookAhead, the current implementation DOES NOT HONOR the ignoreErrors PROPERTY!
		options = k.utils.obj.isObject(options) ? options : {};
		options.conflictResolvers = options.conflictResolvers || [];
		
		var reduceItems = this.getRecudeItems(),
			shiftItems = k.utils.obj.filter(this._items, function (item)
			{
				return !item.isReduce();
			}),
			self = this,
			ignoreErrors = !!options.ignoreErrors,
			result = {shiftItems:[], reduceItems:[]},
			isTheConflictResolvableWithResolvers = false;
		
		if (!options.considerLookAhead)
		{
			if (!reduceItems.length)
			{
				result.shiftItems = shiftItems || [];
			}
			else if (!shiftItems.length && reduceItems.length === 1)
			{
				result.reduceItems = reduceItems;
			}
			else
			{
				return false;
			}
			
			return result;
		}
	};

	return state;
})(k.data.Node);
/* Automata
* @class
* @classdesc This class reprensent an automata, whith all its state and transitions */
k.data.Automata = (function() {
	'use strict';
	/*
	* Automata Constructor
	*
	* @constructor
	* @param {[State]} options.states Array of initial states
	* @param {State} options.initialState Initial state of the automata.
	* @param {Bool} options.hasLookAhead Boolean value used to indicate if the items if the state use or not look ahead.
	*/
	var automata = function (options)
	{
		this.options = options;

		k.utils.obj.defineProperty(this, 'states');
		k.utils.obj.defineProperty(this, 'initialState');
		//Determines if the current autamata has or not lookAhead. This is set by the automata Generator
		k.utils.obj.defineProperty(this, 'hasLookAhead');
		
		
		k.utils.obj.defineProperty(this, '_index');
		k.utils.obj.defineProperty(this, '_unprocessedStates');
		k.utils.obj.defineProperty(this, '_registerStates');

		this.states = options.states || [];
		this._unprocessedStates = [];
		this._index = 0; //Index used to traversal the states of the current instance
		this._registerStates = k.utils.obj.groupBy(this.states, function (state) {return state.getIdentity();});
		
		if (this.states.length)
		{
			this._unprocessedStates = [].concat(this.states);
		}
	};

	/* @function Convert the current automata to its string representation
	* @returns {String} formatted string */
	automata.prototype.toString = function ()
	{
		return this.states.join('\n');
	};

	/* @function Get the next unprocessed state
	* @returns {State} A State not processed yet if any or null otherwise */
	automata.prototype.getNextState = function()
	{
		return this._unprocessedStates.splice(0,1)[0];
		//this._index < this.states.length ? this.states[this._index++] : null;
	};
	
	/* @function Function used to check if an automamta is valid.
	* Commonly used to check if an automata is an LR(0) valid one.
	* @param {Boolean} options.considerLookAhead Indicate if the validation process should take into account lookAhead values in the rule items. This values is passed in to each state.
	* @param {[ConflictResovler]} options.conflictResolvers List of conflict resolvers used by the states in conflict.
	* @returns {Boolean} true in case th automata is valid, false otherwise */
	automata.prototype.isValid = function(options)
	{
		var defaultValidationOptions = {
			considerLookAhead: this.hasLookAhead
		};
		
		options = k.utils.obj.extendInNew(defaultValidationOptions, options || {});
		options.automata = this;
		
		return !k.utils.obj.any(this.states, function (state)
		{
			return !state.isValid(options);
		}, this);
	};
	
	/* @function Set or get the initial state.
	* @param {State} state If specified, set the initial state of the automata
	* @returns {State} In case that none state is specifed returnes the initial state previously set */
	automata.prototype.initialStateAccessor = function(state)
	{
		if (!state) {
			return this.initialState;
		}
		this.initialState = state;
	};

	/* @function Add a new state into the automata controlling if it is duplicated or not. If the new state is duplicated we merge its look-ahead
	* @param {State} newState State to add
	* @returns {State} The added state, if the state is duplicated returns the already created state */
	automata.prototype.addState = function(newState)
	{
		if (!this._registerStates[newState.getIdentity()])
		{
			this._registerStates[newState.getIdentity()] = newState;
			this.states.push(newState);
			this._unprocessedStates.push(newState);
		}
		else if (this.hasLookAhead)
		{
			//When the states are the same in rules but its only difference is in its the look aheads, as a easy-to-implement a LALR(1) parser, we merge this look-aheads
			var currentState = this._registerStates[newState.getIdentity()],
				currentStateHasChange = false;
				
			k.utils.obj.each(currentState.getOriginalItems(), function (originalItemRule)
			{
				var newItemRule = newState.getOriginalItemById(originalItemRule.getIdentity()),
					originalItemRuleLookAheadLength = originalItemRule.lookAhead.length;
				
				originalItemRule.lookAhead = k.utils.obj.uniq(originalItemRule.lookAhead.concat(newItemRule.lookAhead), function (item) { return item.name;});
				
				if (!currentStateHasChange && originalItemRuleLookAheadLength !== originalItemRule.lookAhead.length)
				{
					currentStateHasChange = true;
				}
			});
			
			if (currentStateHasChange)
			{
				var isCurrentStateAlreadyUnProcessed = k.utils.obj.find(this._unprocessedStates, function (unprocessedState)
				{
					return currentState.getIdentity() === unprocessedState.getIdentity();
				});
				
				if (!isCurrentStateAlreadyUnProcessed)
				{
					this._unprocessedStates.push(currentState);
				}
			}
		}
		return this._registerStates[newState.getIdentity()];
	};

	return automata;
})();

/*global toString: true*/
//TODO: Implement a REAL lexer. This one is just a temporal one!

/* Lexer
* @class
* @classdesc This class scan an input stream and convert it to an token input */
k.lexer.Lexer = (function() {
	'use strict';
	
	var defaultOptions = {
		notIgnoreSpaces : false
	};

	/*
	* Initialize a new Lexer
	*
	* @constructor
	* @param {Grammar} options.grammar Grammar used to control the scan process
	* @param {String} options.stream Input Stream (Generally a String)
	* @param {Boolean} options.notIgnoreSpaces If true spaces are not ignored. False by default. 
		IMPORTANT: If the grammar has empty rules (A --> <EMPTY>) ignoring spaces will make that the lexer returns EOF instead of EMPTY at the end of the string ('').
	*/
	var lexer = function (options)
	{
		this.options = k.utils.obj.extendInNew(defaultOptions, options || {});

		k.utils.obj.defineProperty(this, 'grammar');
		k.utils.obj.defineProperty(this, 'stream'); //Specified input stream
		k.utils.obj.defineProperty(this, 'inputStream'); // Post-Processed input stream
		k.utils.obj.defineProperty(this, 'notIgnoreSpaces');

		this.setStream(this.stream);
	};
	
	/* @function Get next input token
	* @param {String} stream Input string to be processed
	* @returns {Void} */
	lexer.prototype.setStream = function (stream)
	{
		this.stream = stream;
		this.inputStream = (!this.notIgnoreSpaces && this.stream) ? k.utils.str.ltrim(this.stream) : this.stream;
		if (!this.notIgnoreSpaces && this.inputStream === '')
		{
			this.inputStream = null;
		}
	};
	
	/* @function Get a generic result in case of error, when the lexer cannnot match any terminal in the input
	* @returns {Object} An object representing the the mis of any match (error)  */
	lexer.prototype._getErrorResult = function()
	{
		return {
				length: -1,
				string: this.inputStream,
				ERROR: 'NOT MATCHING FOUND'
			};
	};

	/* @function Get next input token
	* @returns {Object} An object representing the current finded token. The object can not have a rule associated if there is any match */
	lexer.prototype.getNext = function()
	{
		var result = {
				length: -1
			},
			terminals = this.grammar.terminals,
			grammarHasEmptyRules = k.utils.obj.find(this.grammar.rules, function (rule)
				{
					return rule.tail.length === 1 && rule.tail[0].isSpecial && rule.tail[0].name === k.data.specialSymbol.EMPTY;
				}),
			body;

		if  (this.inputStream === null)
		{
			result = {
				length: -1,
				terminal: new k.data.Symbol({name: k.data.specialSymbol.EOF})
			};
		}
		else if (this.inputStream === '')
		{
			if (grammarHasEmptyRules)
			{
				result = {
					length: 0,
					string: '',
					terminal: new k.data.Symbol({name: k.data.specialSymbol.EMPTY})
				};
				this.inputStream = null;	
			}
			else
			{
				result = this._getErrorResult();
			}
		}
		else
		{
			for (var i = 0; i < terminals.length; i++)
			{
				body = terminals[i].body;
				//If it's reg exp and match (this.inputStream.search(body) returns the index of matching which evals to false so !)
				if (body instanceof RegExp && !this.inputStream.search(body))
				{
					var match = body.exec(this.inputStream)[0];
					if (result.length < match.length)
					{
						result = {
							length: match.length,
							string: match,
							terminal: terminals[i]
						};
					}
				}
				
				//if it is a string check if they are the same
				else if (k.utils.obj.isString(body) && k.utils.str.startsWith(this.inputStream, body) && result.length < body.length)
				{
					result = {
						length: body.length,
						string: body,
						terminal: terminals[i]
					};
				}
			}

			if (result.length === -1)
			{
				//if there is no valid match, we return the current input stream
				result = this._getErrorResult();
			}
			else
			{
				//If there is a match
				this.inputStream = this.inputStream.substr(result.length);
				if (!this.options.notIgnoreSpaces)
				{
					this.inputStream = k.utils.str.ltrim(this.inputStream);
					// if ignoring spaces and the input string only left empty, set the input as finished
					if (this.inputStream === '')
					{
						this.inputStream = null;
					}
				}

			}
		}

		return result;
	};

	return lexer;
})();

/*Enum for valid action in an action table
* @readonly
* @enum {String}
*/
var tableAction = k.parser.tableAction = {
	SHIFT: 'SHIFT',
	REDUCE: 'REDUCE',
	ERROR: 'ERROR',
	ACCEPT: 'ACCEPT'
};

/* Abstract Base Automata Generator
* @class
* @classdesc This is the base class for all LR automatas generator. The idea is simplify the autamata creation process */
k.parser.AutomataLRGeneratorBase = (function() {
	'use strict';
	/*
	* Initialize a new Automaton Generator
	*
	* @constructor
	* @param {Grammar} options.grammar Grammar used to generate the automata
	*/
	var automataLRGeneratorBase = function (options)
	{
		this.options = options;
		
		k.utils.obj.defineProperty(this, 'grammar');

		if (!(this.grammar instanceof k.data.Grammar))
		{
			throw new Error('In order to create a new Automata Generator please provide a grammar!');
		}
	};

	/* @function Expands a state adding in it the full list of require items (item rules)
	* @param {State} currentState State that will be expanded
	* @returns {State} The full state with all its require items */
	automataLRGeneratorBase.prototype.expandItem = function (currentState)
	{
		// The inital rule is first added and then this method is called
		var currentSymbol,
			currentItem = currentState.getNextItem();

		while (currentItem) {
			currentSymbol = currentItem.getCurrentSymbol();

			if (currentSymbol instanceof k.data.NonTerminal)
			{
				currentState.addItems(this._newItemRulesForStateExpansion(currentItem, currentSymbol), this._getExpansionItemNewItemsOptions());
			}

			currentItem = currentState.getNextItem();
		}

		return currentState;
	};
	
	/* @function Generate the options used to add item rules into the states when thy are being expanded
	* @returns {Object} An object specifying the options used by the state.addItems method to include methods */
	automataLRGeneratorBase.prototype._getExpansionItemNewItemsOptions = function ()
	{
		return {
			hasLookAhead: false
		};
	};
	
	/* @function When expanding an state, depending on the kind of automata that is being created (LR1/LALR1/LR0/etc), the way that is genrerated the list
	* of new item rule to add to the current being processed state.
	* This method is intended to be overwritten!.
	* @param {ItemRule} currentItem The current item rule from which the new item rule are being generated.
	* @param {Symbol} currentSymbol Is the symbol used to find new item rules.
	* @returns {[ItemRule]} Array of item rule ready to be part of the current processing state */
	automataLRGeneratorBase.prototype._newItemRulesForStateExpansion = function (currentItem, currentSymbol)
	{};

	/* @function Generate the requested automata
	* This method allows that sub-clases override it and have already almost all the implementation done in the method _generateAutomata()
	* @param {Boolean} options.notValidate Indicate if the resulting automata should be validated for the current lookAhead or not. False by default (DO validate the automata).
	* @param {[ConflicResolver]} options.conflictResolvers ORDERED List of conflicts resolvers used in case of conflicts in the state.
	* @returns {Automata} The corresponding automata for the specified grammar */
	automataLRGeneratorBase.prototype.generateAutomata = function(options)
	{
		var defaultAutomataGenerationOptions = {
				notValidate: false,
				conflictResolvers: []
			};
		options = k.utils.obj.extendInNew(defaultAutomataGenerationOptions, options || {});
		
		var automata = this._generateAutomata();
		
		if (!options.notValidate && !automata.isValid(options))
		{
			return false;
		}
		//really
		return automata;
	};
	
	/* @function Generate the conflict resolvers list use to solve any possible conflict when validating the automata and when creating the Action table.
	* @returns {Automata} The corresponding automata for the specified grammar */
	automataLRGeneratorBase.prototype._getConflictResolvers = function ()
	{
		
	};
	
	/* @function Actually Generate an automata
	* @returns {Automata} The corresponding automata for the specified grammar */
	automataLRGeneratorBase.prototype._generateAutomata = function()
	{
		var initialState = new k.data.State({
				items: this._getInitialStateItemRules()
			}),
			automata = new k.data.Automata(this._getNewAutomataOptions(initialState));

		automata.initialStateAccessor(initialState);
		this._expandAutomata(automata);
		return automata;
	};
	
	/* @function Generate the construction object used to initialize the new automata
	* @param {State} initialState State that only contains the items rules from the start symbol of the grammar. This is the initial state before being expanded.
	* @returns {Object} Object containing all the options used to create the new automata */
	automataLRGeneratorBase.prototype._getNewAutomataOptions = function (initialState)
	{
		return {
				states: [this.expandItem(initialState)]
			};
	};
	
	/* @function Returns the initial list of item rules that will take part in the initial state of the automata. This can differ if the automata has or not lookahead
	* @returns {[ItemRule]} The initial list of item rule. */
	automataLRGeneratorBase.prototype._getInitialStateItemRules = function ()
	{};

	/* @function Internal method which resive an inital automata with only it inital state and generate a full automata
	* @param {Automata} automata Automatma to be expanded
	* @returns {Automata} A full automata */
	automataLRGeneratorBase.prototype._expandAutomata = function(automata)
	{
		var currentState = automata.getNextState();
		
		while (currentState) {

			//Get all valid symbol from which the current state can have transitions
			var supportedTransitions = currentState.getSupportedTransitionSymbols(),
				addedState, //To control duplicated states
				newItemRules = [];

			// For each supported transicion from the current state, explore neighbours states 
			//Warning remove to create function inside this loop
			/*jshint -W083 */
			k.utils.obj.each(supportedTransitions, function (supportedTransition)
			{
				// for the current new neighbour of the current state, generate the basic state with the known items
				k.utils.obj.each(supportedTransition.items, function (supportedItem)
				{
					// Because each item in the supported transition does NOT move the dot location when retrieved from the state, we MUST do that here
					newItemRules.push(supportedItem.clone({
						dotLocationIncrement: 1
					}));
				});

				var newState = new k.data.State({
					items: newItemRules
				});

				this.expandItem(newState, automata);
				
				// We determien if the new state is an acceptance state, if it has only the augmented rule in reduce state.    
				newState.isAcceptanceState = !!(newState.getOriginalItems().length === 1 && newState.getOriginalItems()[0].rule.name === k.data.Grammar.constants.AugmentedRuleName && newState.getOriginalItems()[0].dotLocation === 2);

				// Add state controlling duplicated ones
				addedState = automata.addState(newState);
				
				currentState.addTransition(supportedTransition.symbol, addedState);

				newItemRules = [];
			}, this);

			currentState = automata.getNextState();
		}
	};
	
	/* @function Given an automata returnes its GOTO Table. The table is represented by an object where each state is a property (row) and each possible symbol is a property of the previous object (column)
	* Sample: table[<state>][<symbol>] = [undefined = error|<state id - string>]
	* @param {Automata} automata Automatma used as a base of the calculation
	* @returns {Object} A GOTO Table */
	automataLRGeneratorBase.prototype.generateGOTOTable = function(automata)
	{
		var table = {};
		
		k.utils.obj.each(automata.states, function (state)
		{
			table[state.getIdentity()] = {};
			
			k.utils.obj.each(state.transitions, function (transition) {
				table[state.getIdentity()][transition.symbol.toString()] = transition.state;
			});
		});
		
		return table;
	};
	
	/* @function Given an automata returnes its ACTION Table. 
	* The intend of this method is to be overwriten by each son class
	* @param {Automata} automata Automatma used as a base of the calculation.
	* @param {Boolean} options.ignoreErrors Indicate that when a state is in an error that cannot be resolver, continue the execution anyway.
	* @param {Boolean} options.conflictResolvers List of resolver in case of conflic in any state.
	* @returns {Function} Function that given the a state id and a lookAhead returns the action to take */
	automataLRGeneratorBase.prototype.generateACTIONTable = function (automata, options)
	{};

	return automataLRGeneratorBase;
})();

/* Automata Generator
* @class
* @classdesc This class is reponsible for given a grammar create a new LR(0) automata */
k.parser.AutomataLR0Generator = (function(_super) {
	'use strict';
	/* jshint latedef:false */
	k.utils.obj.inherit(automataLR0Generator, _super);
	
	/*
	* Initialize a new Automaton Generator
	*
	* @constructor
	* @param {Grammar} options.grammar Grammar used to generate the automata
	*/
	function automataLR0Generator (options)
	{
		_super.apply(this, arguments);
	}
	
	/* @function Override super method to return the list of item rules that has as its head the current symbol, without taking into account the lookAhead
	* @param {ItemRule} currentItem The current item rule from which the new item rule are being generated.
	* @param {Symbol} currentSymbol Is the symbol used to find new item rules.
	* @returns {[ItemRule]} Array of item rule ready to be part of the current processing state */
	automataLR0Generator.prototype._newItemRulesForStateExpansion = function (currentItem, currentSymbol)
	{
		return k.data.ItemRule.newFromRules(this.grammar.getRulesFromNonTerminal(currentSymbol));
	};
	
	/* @function Generate the construction object used to initialize the new automata. Override the super method to indicate that te automata should NOT use lookahead
	* @param {State} initialState State that only contains the items rules from the start symbol of the grammar. This is the initial state before being expanded.
	* @returns {Object} Object containing all the options used to create the new automata */
	automataLR0Generator.prototype._getNewAutomataOptions = function ()
	{
		var result = _super.prototype._getNewAutomataOptions.apply(this, arguments);
		result.hasLookAhead = false;
		
		return result;
	};
	
	/* @function Override super method to return the list of item rules that has as its head the start symbol of the grammar
	* @returns {[ItemRule]} The initial list of item rule. */
	automataLR0Generator.prototype._getInitialStateItemRules = function ()
	{
		return 	[new k.data.ItemRule({
					rule: this.grammar.getRulesFromNonTerminal(this.grammar.startSymbol)[0],
					lookAhead: []
				})];
	};
	
	/* @function Given an automata returnes its ACTION Table. 
	* @param {Automata} automata Automatma used as a base of the calculation
	* @returns {Function} Function that given the a state id and a lookAhead returns the action to take */
	automataLR0Generator.prototype.generateACTIONTable = function (automata)
	{
		var table = {};
		
		k.utils.obj.each(automata.states, function(state)
		{
			var stateItems = state.getItems();
			
			// If it is a REDUCE state
			if (stateItems.length === 1 && stateItems[0].dotLocation === (stateItems[0].rule.tail.length))
			{
				// S'--> S#*
				if (state.isAcceptanceState) {
					 table[state.getIdentity()] = {
						action: k.parser.tableAction.ACCEPT,
						rule: stateItems[0].rule
					};
				}
				else 
				{
					table[state.getIdentity()] = {
						action: k.parser.tableAction.REDUCE,
						rule: stateItems[0].rule
					};
				}
			// SHIFT state
			} else {
				table[state.getIdentity()] = {
					action: k.parser.tableAction.SHIFT
				};
			}
		});
		
		
		return (function (hasLookAhead, actionTable) {
			return function (currentStateId, look_ahead)
			{
				return actionTable[currentStateId] || {
					action: k.parser.tableAction.ERROR
				};
			};
		})(automata.hasLookAhead, table);
	};

	return automataLR0Generator;
})(k.parser.AutomataLRGeneratorBase);

/* Automata Generator
* @class
* @classdesc This class is reponsible for given a grammar create a new LR(0) automata */
k.parser.AutomataLALR1Generator = (function(_super)
{
	'use strict';
	/* jshint latedef:false */
	k.utils.obj.inherit(automataLALR1Generator, _super);
	
	/*
	* Initialize a new Automaton Generator
	*
	* @constructor
	* @param {Grammar} options.grammar Grammar used to generate the automata
	*/
	function automataLALR1Generator (options)
	{
		_super.apply(this, arguments);
	}
	
	/* @function Override super method to return the list of item rules that has as its head the current symbol, TAKING into account the lookAhead
	* @param {ItemRule} currentItem The current item rule from which the new item rule are being generated.
	* @param {Symbol} currentSymbol Is the symbol used to find new item rules.
	* @returns {[ItemRule]} Array of item rule ready to be part of the current processing state */
	automataLALR1Generator.prototype._newItemRulesForStateExpansion = function (currentItem, currentSymbol)
	{
		var lookAhead = this._getFirstSet(currentItem);
		return k.data.ItemRule.newFromRules(this.grammar.getRulesFromNonTerminal(currentSymbol), lookAhead);
	};
	
	/* @function Override super method to return the object require to indicate that new item rules added into a state should take into account the lookAhead
	* @returns {Object} Object used by State.addItemRules indicating to DO use lookAhead to merge new items */
	automataLALR1Generator.prototype._getExpansionItemNewItemsOptions = function ()
	{
		return {
			hasLookAhead: true
		};
	};
	
	/* @function Gets the array of look-ahead for the particular item rule taking into account the dot location fo the specified item rule.
	* @param {ItemRule} itemRule Item rule to find FIRST Set
	* @returns {[Terminals]} First set for specified look ahead */
	automataLALR1Generator.prototype._getFirstSet = function (itemRule)
	{
		var symbolsToTraverse = itemRule.rule.tail.slice(itemRule.dotLocation + 1),
			requestedFirstSet = [];
			
		symbolsToTraverse = symbolsToTraverse.concat(itemRule.lookAhead);
		
		k.utils.obj.find(symbolsToTraverse, function (symbolTraversed)
		{
			if (symbolTraversed instanceof k.data.NonTerminal)
			{
				requestedFirstSet = requestedFirstSet.concat(this.grammar.firstSetsByHeader[symbolTraversed.name]);
				requestedFirstSet = k.utils.obj.uniq(requestedFirstSet, false, function (item) {return item.name;});
				return !symbolTraversed.isNullable;
			}
			else if (symbolTraversed instanceof k.data.Terminal)
			{
				requestedFirstSet.push(symbolTraversed);
				return true;
			}
			else if (symbolTraversed.isSpecial && symbolTraversed.name === k.data.specialSymbol.EOF)
			{
				requestedFirstSet.push(symbolTraversed);
				return true;
			}
			else 
			{
				throw new Error('Invalid Item Rule. Impossible calculate first set. Item Rule: ' + itemRule.toString());
			}
			
		}, this);
		
		return requestedFirstSet;
	};
	
	/* @function Generate the construction object used to initialize the new automata. Override the super method to indicate that te automata should DO use lookahead
	* @param {State} initialState State that only contains the items rules from the start symbol of the grammar. This is the initial state before being expanded.
	* @returns {Object} Object containing all the options used to create the new automata */
	automataLALR1Generator.prototype._getNewAutomataOptions = function ()
	{
		var result = _super.prototype._getNewAutomataOptions.apply(this, arguments);
		result.hasLookAhead = true;
		
		return result;
	};
	
	/* @function Override super method to return the list of item rules that has as its head the start symbol of the grammar, TAKING into account the lookAhead
	* @returns {[ItemRule]} The initial list of item rule. */
	automataLALR1Generator.prototype._getInitialStateItemRules = function ()
	{
		return [new k.data.ItemRule({
					rule: this.grammar.getRulesFromNonTerminal(this.grammar.startSymbol)[0],
					lookAhead: [new k.data.Symbol({name: k.data.specialSymbol.EOF, isSpecial: true})]
				})];
	};
	
	/* @function Given an automata returnes its ACTION Table. 
	* @param {Automata} automata Automatma used as a base of the calculation
	* @returns {Function} Function that given the a state id and a lookAhead returns the action to take */
	automataLALR1Generator.prototype.generateACTIONTable = function (automata, options)
	{
		var table = {};
		
		k.utils.obj.each(automata.states, function (state)
		{
			table[state.getIdentity()] = {};
			
			if (state.isAcceptanceState)
			{
				table[state.getIdentity()][k.data.specialSymbol.EOF] = {
					action: k.parser.tableAction.ACCEPT,
					rule: state.getOriginalItems()[0].rule //As we augment the grammar in the acceptance state is should be only one rule, the augmented rule, for that reason is the 0
				};
			} 
			else
			{
				var defaultActionTableStateOptions = {
					ignoreErrors: false,
					considerLookAhead: true
				};
				options = k.utils.obj.extendInNew(defaultActionTableStateOptions, options || {});
				
				// var stateItems = state.getShiftReduceItemRule(options);
				var stateItems = this.getShiftReduceItemRuleFromState(state, options);
				
				if (!stateItems)
				{
					throw new Error('Impossible to generate Action Table. The following state is invalid. State: ' + state.getIdentity());	
				}
				
				
				//Shift Items
				k.utils.obj.each(stateItems.shiftItems, function (shiftItem)
				{
					table[state.getIdentity()][shiftItem.getCurrentSymbol().name] = {
						action: k.parser.tableAction.SHIFT
					};
				});
				
				//Reduce Items
				//IMPORTANT: At this point the automata MUST be already validated, ensuring us that the lookAhead sets ARE DISJOINT
				k.utils.obj.each(stateItems.reduceItems, function (reduceItemRule)
				{
					k.utils.obj.each(reduceItemRule.lookAhead, function (reduceSymbol)
					{
						table[state.getIdentity()][reduceSymbol.name] = {
							action: k.parser.tableAction.REDUCE,
							rule: reduceItemRule.rule
						};
					});	
				});
			}
		}, this);
		
		
		return (function (hasLookAhead, actionTable) {
			return function (currentStateId, look_ahead)
			{
				return (actionTable[currentStateId] && look_ahead && look_ahead.name && actionTable[currentStateId][look_ahead.name] ) || 
					{
						action: k.parser.tableAction.ERROR
					};
				
			};
		})(automata.hasLookAhead, table);
	};
	
	/* @function Generates the list of shift and reduce items that take part from the passed in state. Validating at the same time that none of these items are in conflict
		or that the conflicts are solvable.
	 * @param {State} state State to extract form each of the reduce/shift item rules
	 * @param {Boolean} options.considerLookAhead Indicate if the state should take into account look ahead to validate. If not the state will validate and generate the result as in a LR(0). Default: false
	 * @param {Automata} options.automata Optional automata instance used to pass to the conflict resolver in case there are conflict and resolvers.
	 * @param {[ConflictResolver]} options.conflictResolvers List of conflict resolvers used to resolve possible conflict at the current state.
	 * @param {Boolean} options.ignoreErrors Indicate if when facing an error (a conflict that can not be solve by any resolver) continue the execution. Default: false
	 * @returns {Object} An object containg two properties (arrays) shiftItems and reduceItems */
	automataLALR1Generator.prototype.getShiftReduceItemRuleFromState = function (state, options)
	{
		options = k.utils.obj.isObject(options) ? options : {};
		options.conflictResolvers = options.conflictResolvers || [];
		
		var reduceItems = state.getRecudeItems(),
			shiftItems = k.utils.obj.filter(state.getOriginalItems(), function (item)
			{
				return !item.isReduce();
			}),
			ignoreErrors = !!options.ignoreErrors,
			result = {shiftItems:[], reduceItems:[]},
			isTheConflictResolvableWithResolvers = false;
			
		//We clone the reduce item, becuase when there is a Shift/Reduce conflic and the solution is shift, we need to remove the shift symbol from the lookAhead set of the reduce item!
		//Otherwise when createion the Action table the reduce item end it up overriding the shift actions! (see automataLALRGenerator)
		reduceItems = k.utils.obj.map(reduceItems, function (reduceItem)
		{
			return reduceItem.clone(); 
		});
		
		//Process all SHIFT items & Check for SHIFT/REDUCE Conflicts
		if (shiftItems.length)
		{
			var shiftReduceResolvers = k.utils.obj.sortBy(k.utils.obj.filter(options.conflictResolvers, function (resolver)
			{
				return resolver.type === k.parser.conflictResolverType.STATE_SHIFTREDUCE;
			}), 'order');
			
			//Generla Idea: For each shift item rule validate that the shift symbol is not in any lookAhead symbol of any reduce rule
			
			//For each shift item
			var isAnyShiftReduceConflict = k.utils.obj.any(shiftItems, function (shiftItem)
			{
				//get the shift symbol
				var shiftSymbol = shiftItem.getCurrentSymbol();
				
				//find among all reduce items
				var isShiftItemInConflict = k.utils.obj.find(reduceItems, function (reduceItem)
				{
					//if the shift symbol is in any reduce item rule's lookAhead set.
					//NOTE: Here we obtain the lookAhead Symbol that is in conflict, if any. 
					var isShiftSymbolInReduceLookAhead = k.utils.obj.find(reduceItem.lookAhead, function (lookAheadSymbol) { return lookAheadSymbol.name === shiftSymbol.name;});
					
					//if there is a possible shift/reduce conflict try to solve it by usign the resolvers list
					if (isShiftSymbolInReduceLookAhead)
					{
						var conflictSolutionFound;
						isTheConflictResolvableWithResolvers = k.utils.obj.find(shiftReduceResolvers, function (resolver)
						{
							conflictSolutionFound = resolver.resolve(options.automata, state, shiftItem, reduceItem);
							return conflictSolutionFound;
						});
						
						//If the conflict is resolvable, and the action to be taken is SHIFT, we remove the Shift symbol from the reduce item lookAhead, so when creating the Action table
						//that symbol wont take part of the table.
						if (isTheConflictResolvableWithResolvers && conflictSolutionFound.action === k.parser.tableAction.SHIFT)
						{
							var symbolIndexToRemove = k.utils.obj.indexOf(reduceItem.lookAhead, isShiftSymbolInReduceLookAhead);
							reduceItem.lookAhead.splice(symbolIndexToRemove,1);
						}
						
						return !isTheConflictResolvableWithResolvers;
					}
					
					return false;
				});
				
				if (!isShiftItemInConflict || ignoreErrors)
				{
					result.shiftItems.push(shiftItem);
					return false;
				} 
				
				return true;
				
			});
			
			if (isAnyShiftReduceConflict)
			{
				return false;
			}
		}
		
		//Process all REDUCE items & Check for REDUCE/REDUCE Conflicts
		if (reduceItems.length)
		{
			var reduceReduceResolvers = k.utils.obj.sortBy(k.utils.obj.filter(options.conflictResolvers, function (resolver)
				{
					return resolver.type === k.parser.conflictResolverType.STATE_REDUCEREDUCE;
				}), 'order');
				
			//General Idea: For each reduce rule, validate that its look Ahead set is disjoin with the rest of the reduce rule
				
			//for each reduce rule
			var isAnyReduceReduceConflict = k.utils.obj.any(reduceItems, function (reduceItemSelected)
			{
				//compare it with each of the other reduce rules
				var isReduceItemInConflict = k.utils.obj.find(reduceItems, function (reduceItemInspected)
				{
					if (reduceItemInspected.getIdentity() === reduceItemSelected.getIdentity())
					{
						return false;
					}
					
					//and for each look ahead symbol of the first reduce rule, validate the it is not present in any other look Ahead
					var isLookAheadSymbolInOtherLookAheadSet = k.utils.obj.find(reduceItemSelected.lookAhead, function (lookAheadSelected)
					{
						return k.utils.obj.find(reduceItemInspected.lookAhead, function (lookAheadSymbol) { return lookAheadSymbol.name === lookAheadSelected.name;});
					});
					
					if (isLookAheadSymbolInOtherLookAheadSet)
					{
						isTheConflictResolvableWithResolvers = k.utils.obj.find(reduceReduceResolvers, function (resolver)
						{
							return resolver.resolve(options.automata, state, reduceItemSelected, reduceItemInspected);
						});
						
						return !isTheConflictResolvableWithResolvers;
					}
					
					return false;
				});
				
				if (!isReduceItemInConflict || ignoreErrors)
				{
					result.reduceItems.push(reduceItemSelected);
					return false; 
				}
				return true;
			});
			
			if (isAnyReduceReduceConflict)
			{
				return false;
			}
		}
		
		return result;
	};

	return automataLALR1Generator;
})(k.parser.AutomataLRGeneratorBase);

//TODO TEST ALL THIS CLASS!!

/* Enum that describe valid types of conflict resolvers
* @readonly
* @enum {String}
*/
var conflictResolverType = k.parser.conflictResolverType = {
	STATE_SHIFTREDUCE: 'STATE_SHIFTREDUCE',
	STATE_REDUCEREDUCE: 'STATE_REDUCEREDUCE'
};

/* State Conflict Resolver
* @class
* @classdesc This class is responsible for resolver conflicts at state level, for example Shift/Reduce conflicts */
var ConflictResolver = k.parser.ConflictResolver = (function () {
	'use strict';
	/*
	* Initialize a new Conflict Resolver
	*
	* @constructor
	* @param {String} options.name Uique name of the resolver.
	* @param {conflictResolverType} options.type Indicate the kind of conflict that the current resolver can handle. Default: STATE_SHIFTREDUCE
	* @param {Integer} options.order Numeric values used to sort the resolver and in this way take precendence at the moment of resolve a problem.
		Resolvers will be sorted from lowest values to highest. Default: 9999
	* @param {Function} options.resolveFnc function evalutad at the time of resolve a conflict. Default: Just return false
	*/
	var conflictResolver = function (options)
	{
		this.options = options;
		
		k.utils.obj.defineProperty(this, 'name');
		k.utils.obj.defineProperty(this, 'type');
		k.utils.obj.defineProperty(this, 'order');
		k.utils.obj.defineProperty(this, 'resolveFnc');
		
		this.type = this.type || conflictResolverType.STATE_SHIFTREDUCE;
		this.order = this.order || 9999;
	};
	
	/* @function Resolve a conflict
	* This method main idea is that sub-clases override it and implement the real logic. By defaukt it should return false.
	* @param {Automata} automata Automata containing the state tothat is being validated.
	* @param {State} state State that contains the conflict.
	* @param {ItemRule} itemRule1 In case of SHIFT/REDUCE conflict is the SHIFT item rule.
	* @param {ItemRule} itemRule2 In case of SHIFT/REDUCE conflict is the REDUCE item rule.
	* @returns {Object} This meethod will return false in there is not solution for the conflict, otherwise will return an object containing the next properties:
			action: {tableAction} string solution, iteRule: {ItemRule} item rule that should be taken into account*/
	conflictResolver.prototype.resolve = function (automata, state, itemRule1, itemRule2)
	{
		return  k.utils.obj.isFunction(this.resolveFnc) ? this.resolveFnc(automata, state, itemRule1, itemRule2) : false;
	};
	
	/* @function Generate the default list of resolvers. These are:
		Shift/Reduce Resolver: Precendence
		Shift/Reduce Resolver: Associativity
	* @returns {[ConflictResolver]} List of the default (wide-app) Conflict Resolvers. */
	conflictResolver.getDefaultResolvers = function ()
	{
		return [
				new ConflictResolver({
					name: 'precedence_resolver',
					type: conflictResolverType.STATE_SHIFTREDUCE,
					order: 10,
					resolveFnc: function (automata, state, shiftItemRule, reduceItemRule)
					{
						if (!k.utils.obj.isNumber(shiftItemRule.rule.precendence) && !k.utils.obj.isNumber(reduceItemRule.rule.precendence))
						{
							//If neither of the rules define precedence, we can resolve the conflict
							return false;
						}
						
						shiftItemRule.rule.precendence =  k.utils.obj.isNumber(shiftItemRule.rule.precendence) ? shiftItemRule.rule.precendence : 0;
						reduceItemRule.rule.precendence =  k.utils.obj.isNumber(reduceItemRule.rule.precendence) ? reduceItemRule.rule.precendence : 0;
						
						if (shiftItemRule.rule.precendence > reduceItemRule.rule.precendence)
						{
							return {
								itemRule: shiftItemRule,
								action: k.parser.tableAction.SHIFT
							};
						}
						else if (shiftItemRule.rule.precendence < reduceItemRule.rule.precendence)
						{
							return {
								itemRule: reduceItemRule,
								action: k.parser.tableAction.REDUCE
							};    
						}
						return false; // both rules have the same precendence
					}
				}),
				new ConflictResolver({
					name: 'associativity_resolver',
					type: conflictResolverType.STATE_SHIFTREDUCE,
					order: 20,
					resolveFnc: function (automata, state, shiftItemRule, reduceItemRule)
					{
						var shiftSymbol = shiftItemRule.getCurrentSymbol();
						if (shiftSymbol.assoc === k.data.associativity.RIGHT)
						{
							return {
								action: k.parser.tableAction.SHIFT,
								itemRule: shiftItemRule
							};
						}
						else if (shiftSymbol.assoc === k.data.associativity.LEFT)
						{
							return {
								action: k.parser.tableAction.REDUCE,
								itemRule: reduceItemRule
							};
						}
						
						return false;
					}
				})
			];
	};
	
	return conflictResolver;
})();

/* Parser
* @class
* @classdesc Parser engine reponsible for parse an entire string */
var Parser = k.parser.Parser = (function() {
	'use strict';
	/*
	* Creates an instance of a Parser
	*
	* @constructor
	* @param {Object} options.gotoTable The GOTO Table of the current grammar
	* @param {Grammar} options.grammar The grammar used to generate all the parser
	* @param {Function} options.actionTable Action table used to control the parsing process
	* @param {State} options.initialState Initial state of the automata the describe the current grammar
	*/
	var parser = function (options) {
		this.options = options;

		k.utils.obj.defineProperty(this, 'gotoTable');
		k.utils.obj.defineProperty(this, 'grammar');
		k.utils.obj.defineProperty(this, 'actionTable');
		k.utils.obj.defineProperty(this, 'initialState');

		k.utils.obj.defineProperty(this, 'stack');
		k.utils.obj.defineProperty(this, 'currentInput');

		if (!this.gotoTable) {
			throw new Error('Invalid initialization values for a Parser, please provide a GOTO Table');
		}

		if (!this.actionTable) {
			throw new Error('Invalid initialization values for a Parser, please provide a Action Table');
		}

		if (!this.grammar) {
			throw new Error('Invalid initialization values for a Parser, please provide a Grammar');
		}

		if (!this.initialState) {
			throw new Error('Invalid initialization values for a Parser, please provide a Initial State');
		}

		this.stack = this.stack || [];
	};

	/* @function Parse an input
	* @param {Lexer} lexer The lexer which will lexically analize the input
	* @returns {ASTNode|false} The generated AST in case of sucess or false otherwise */
	parser.prototype.parse = function(lexer) {
		//TODO TEST THIS!!!

		var initialStackItem = new k.data.StackItem({
				state: this.initialState
			});
		this.currentInput = lexer.getNext();
		
		if (this.currentInput.ERROR)
		{
			return false;
		}
		this.stack.push(initialStackItem);

		return this._parse(lexer);
	};

	/* @function Internal method to Parse an input. This method will loop through input analizyng the Goto and Action tables
	* @param {Lexer} lexer The lexer which will lexically analize the input
	* @returns {ASTNode|false} The generated AST in case of success or false otherwise */
	parser.prototype._parse = function(lexer) {
		var stateToGo,
			actionToDo,
			lastItem = this.stack[this.stack.length-1];
			
		/*
		Basic Functionality: 
		Create an state, ask for an action todo based on the symbol lookAhead an the current state
			if SHIFT, as we have already created the state we just update our current state
			if ERROR, finish execution
			if REDUCE shrink the stack, apply reduce function and update the stack based on the reduce rule
		When the current state is updated ask for goto action and create the new stack item based on this answer.
		*/

		do {
			//Action
			actionToDo = this.actionTable(lastItem.state.getIdentity(), this.currentInput.terminal);
			
			if (actionToDo.action === k.parser.tableAction.ERROR)
			{
				//TODO Think how to express an error o description or give some details about what happend
				return false;
			} 
			else if (actionToDo.action === k.parser.tableAction.SHIFT)
			{
				lastItem.symbol = this.currentInput.terminal;
				lastItem.currentValue = this.currentInput.string;
				lastItem.stringValue = this.currentInput.string;
				this.currentInput = lexer.getNext();
			}
			else if (actionToDo.action === k.parser.tableAction.REDUCE)
			{
				lastItem = this._reduce(actionToDo);
			}
			else if (actionToDo.action === k.parser.tableAction.ACCEPT)
			{
				lastItem = this._reduce(actionToDo);
				//As we extend the grammar adding a extra rule S' => S #, the last stack item has two children and the first one is the expeted result
				return lastItem.AST.nodes[0];
			}


			//Goto
			stateToGo = this.gotoTable[lastItem.state.getIdentity()][lastItem.symbol];
			if (!stateToGo)
			{
				return false; //The input string is not valid!
			}

			this.stack.push(new k.data.StackItem({
				state: stateToGo
			}));

			lastItem = this.stack[this.stack.length-1];

		} while(true);
	};

	/* @function Internal method to apply a reduce action.
	* @param {Rule} actionToDo.rule The by which the reduce aciton will take place
	* @returns {Object} The last item in the stack already updated */
	parser.prototype._reduce = function (actionToDo)
	{
		var reduceFunctionParameters = {},
			newASTNode,
			subASTNodes,
			stackRange,
			rule = actionToDo.rule,
			isEMPTYRule = rule.tail.length === 1 && rule.tail[0].name === k.data.specialSymbol.EMPTY,
			lastItem = this.stack[this.stack.length - 1];
			
		stackRange = isEMPTYRule ? 
						//If the reduce rule is the empty one, there is no values to collect
						[] : 
						// Get the last n (rule length) elements of the stack ignoring the last one, which is just there for the previous GoTo Action.
						this.stack.slice(-1 * (rule.tail.length + 1), this.stack.length - 1);
		reduceFunctionParameters.values = k.utils.obj.map(stackRange, function (stackItem)
		{
			return stackItem.currentValue || stackItem.symbol;
		});
		reduceFunctionParameters.rule = rule;

		//Shrink stack based on the reduce rule
		this.stack = isEMPTYRule ? 
						//Based on the Basic Functionality the last stack item used by the empty rule is already there and no item is require to be removed 
						this.stack :
						this.stack.slice(0, -1 * rule.tail.length);
		//Update last stack item
		lastItem = this.stack[this.stack.length - 1];
		lastItem.symbol = rule.head;
		lastItem.currentValue = k.utils.obj.isFunction(rule.reduceFunc) ? rule.reduceFunc.call(this, reduceFunctionParameters) : lastItem.symbol;
		
		
		// Update/Generate AST
		subASTNodes = k.utils.obj.map(stackRange, function (stackItem)
		{
			return stackItem.AST || stackItem.stringValue;
		});
		
		newASTNode = new k.data.ASTNode({
			nodes: subASTNodes,
			rule: rule,
			symbol: rule.head,
			stringValue: lastItem.stringValue,
			currentValue: lastItem.currentValue
		});
		lastItem.AST = newASTNode;

		return lastItem;
	};

	return parser;
})();


/* Parser Creator
* @class
* @classdesc Util class to simplify the process of creating a parser */
var parserCreator = k.parser.parserCreator = (function () {
	'use strict';
	/*
	* Creates an instance of a Parser  Creator. Generally this is not necessary, owing to this class has all its method statics
	*
	* @constructor
	*/
	var creator =  function()
	{
	};

	/* @function Helper method to instanciate a new parser and a lexer
	* @param {Grammar} options.grammar The grammar used to generate the parser
	* @param {AutomataLRGeneratorBase} options.automataGenerator Optional class used to generate the automata. If not specified LR0 will be used
	* @param {String} options.strInput Optional String to be processed
	* @returns {Object} An object with two properties, parser and lexer */
	creator.create = function (options)
	{
		options = k.utils.obj.extend({}, {
			automataGenerator: k.parser.AutomataLALR1Generator
		}, options || {});
		
		var	grammar = options.grammar,
			automataGenerator = new options.automataGenerator({
				grammar: grammar
			}),
			automata = automataGenerator.generateAutomata({conflictResolvers: k.parser.ConflictResolver.getDefaultResolvers()}),
			gotoTable = automataGenerator.generateGOTOTable(automata),
			actionTable = automataGenerator.generateACTIONTable(automata, {
				conflictResolvers: k.parser.ConflictResolver.getDefaultResolvers(),
				ignoreErrors: false
			}),
			lexer = new k.lexer.Lexer({
				grammar: grammar,
				stream: options.strInput
			}),
			parser = new k.parser.Parser({
				gotoTable: gotoTable,
				grammar: grammar,
				actionTable: actionTable,
				initialState: automata.initialStateAccessor()
			});

		return  {
			parser: parser,
			lexer: lexer
		};
	};

	return creator;
})();

// See __prologue__.js
	return k;
});
//# sourceMappingURL=kappa.js.map

k.utils.obj = (function ()
{
	'use strict';
	/*
	* @function Util function used to apply "Inheritance"
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
	* @function Util function used to define properties in objects, Common to define alias, insteas od using instance.options.property, used instance.property
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
	* @function Util function to extend an object. This function accepts n arguments and the first one will be the same as the retuned one (the extended)
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
	* @function Util function to clone OBJECTS by using JSON.parser/stringify (a deep clone)
	* @param {Object} obj object to clone
	* @returns {Object} A copy of the passed in object
	*/
	var __clone = function(obj)
	{
		return JSON.parse(JSON.stringify(obj));
	};

	/*
	* @function Util function to extend an object. This function accepts n arguments and the first one will be the same as the retuned one (the extended)
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
	* @function Util function to determine if an object is or not an array
	* @param {Object} o object to check its type
	* @returns {Boolean} True if the object passed in is an Array or false otherwise
	*/
	var __isArray = function(o)
	{
		return Object.prototype.toString.call(o) === '[object Array]';
	};

	/*
	* @function Util function to determine if an object is or not a String
	* @param {Object} s object to check its type
	* @returns {Boolean} True if the object passed in is a String or false otherwise
	*/
	var __isString = function(s)
	{
		return Object.prototype.toString.call(s) === '[object String]';
	};

	/*
	* @function Util function to determine if an object is or not a Regular Expression
	* @param {Object} s object to check its type
	* @returns {Boolean} True if the object passed in is a Regular Expresion, false otherwise
	*/
	var __isRegExp = function(r)
	{
		return Object.prototype.toString.call(r) === '[object RegExp]';
	};

	/*
	* @function Util function to determine if an object is or not a Number
	* @param {Object} n object to check its type
	* @returns {Boolean} True if the object passed in is a Number, false otherwise
	*/
	var __isNumber = function(n)
	{
		return Object.prototype.toString.call(n) === '[object Number]';
	};

	/*
	* @function Util function to determine if an object is or not a Function
	* @param {Object} f object to check its type
	* @returns {Boolean} True if the object passed in is a Function, false otherwise
	*/
	var __isFunction = function(f)
	{
		return Object.prototype.toString.call(f) === '[object Function]';
	};

	/*
	* @function Util function to determine if an object is or not Boolean
	* @param {Object} b object to check its type
	* @returns {Boolean} True if the object passed in is Boolean, false otherwise
	*/
	var __isBoolean = function(b) {
		return b === true || b === false || Object.prototype.toString.call(b) === '[object Boolean]';
	};

	/*
	* @function Util function to determine if an object is the JS Arguments array, which is of a particular type
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
	* @function Util function to determine if an thing is or not a Object
	* @param {Thing} n object to check its type
	* @returns {Boolean} True if the thing passed in is a Object, false otherwise
	*/
	var __isObject = function(obj) {
		return obj === Object(obj) && !__isFunction(obj);
	};

	/*
	* @function Util function to determine if a thing is or not defined
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

	/* @function Alias of hasOwnProperty just for brevety
	* @param {Object} obj object to check ownership of property
	* @param {String} key Property name to verify
	* @returns {Boolean} True if the object posses that property
	*/
	var __has = function(obj, key) {
		return hasOwnProperty.call(obj, key);
	};

	/* @function Returns the list of own properties of an object
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

	/* @function Iterate over the passed in first parameter calling the iterator with the specified context
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

	/* @function Iterate over the passed in first parameter and mapping each of its valur according the iteration logic
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

	/* @function Iterate over the passed in first parameter and group them all into the result by applying the iteralot logic
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

	/* @function Bind a function to an object, meaning that whenever the function is called, the value of this will be the object.
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

	/* @function Iterate over the passed in first parameter and filter them based on the result of the predicate parameter
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

	/* @function Keep the identity function around for default iterators.
	* @param {Object} value Value that will returned
	* @returns {Object} The same value that passed in
	*/
	var __identity = function(value) {
		return value;
	};

	/* @function Determine if at least one element in the object matches a truth test
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

	/* @function Convenience version of a common use case of map: fetching a property.
	* @param {Object} obj Object to be traverse
	* @param {String} key Name of the property to extract from eacj item in obje
	* @returns {Array} List of each property value from each item in obj
	*/
	var __pluck = function(obj, key) {
		return __map(obj, __property(key));
	};

	/* @function Auxiliar and Internal function used to return an object's propert by settings using a closure the property name.
	* Returns a function that will itself return the key property of any passed-in object
	* @param {String} key Name of the property name to 'lock'
	* @returns {Function} A function that accepts an object and returns the value of its property set before
	*/
	var __property = function(key) {
		return function(obj) {
			return obj[key];
		};
	};

	/* @function An internal function to generate lookup iterators
	* @param {Object} value Lookup
	* @returns {Object} Object lookup
	*/
	var lookupIterator = function (value) {
		if (value === null || value === undefined) {
			return __identity;
		}
		if (__isFunction(value)) {
			return value;
		}
		return __property(value);
	};

	var createCallback = function (func, context, argCount) {
		if (context === void 0)
		{
			return func;
		}
		switch (argCount === null ? 3 : argCount)
		{
			case 1:
				return function (value) {
					return func.call(context, value);
				};
			case 2:
				return function (value, other) {
					return func.call(context, value, other);
				};
			case 3:
				return function (value, index, collection) {
					return func.call(context, value, index, collection);
				};
			case 4:
				return function (accumulator, value, index, collection) {
					return func.call(context, accumulator, value, index, collection);
				};
		}

		return function() {
			return func.apply(context, arguments);
		};
	};

	/* @funciton A mostly-internal function to generate callbacks that can be applied to each element in a collection, returning the desired result — either identity, an arbitrary callback, a property matcher, or a property accessor.
	* @param {Any} value Value to inspect so a matching function ca be created
	* @param {Object} context In the c value parameter is a function, this param will be the context in wich that function will execute
	* @param {Number} argCount Count off argument the function value param will acept assuming it is a function
	* @return {Function} A function that can be used to iterate and match over a collection
	*/
	var __iteratee = function (value, context, argCount) {
		if (value === null || value === undefined)
		{
			return __identity;
		}

		if (__isFunction(value))
		{
			return createCallback(value, context, argCount);
		}

		if (__isObject(value))
		{
			return __matches(value);
		}

		return __property(value);
	};

	/* @function Sort the object’s values by a criterion produced by an iterator.
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

	/* @function Return the first value which passes a truth test
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

	/* @function An internal function used for aggregate “group by” operations.
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

	/* @function Determine whether all of the elements match a truth test.
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

	/* @function Internal implementation of a recursive flatten function.
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

	/* @function Flatten out an array, either recursively (by default), or just one level.
	* @param {Array} array object to traverse
	* @param {Boolean} shallow Indicate if the flattening should NOT be made recusrively (true: DO NOT make it recursively)
	* @returns {Array} Array where each item if flattened
	*/
	var __flatten = function(array, shallow) {
		return flatten(array, shallow, []);
	};

	/* @function Determine if the array or object contains a given value (using ===).
	* @param {Array} obj object to traverse
	* @param {Object} target Object looked for
	* @returns {Boolean} True if the obj contains the value pass in
	*/
	var __contains = function(obj, target) {
		if (obj === null || obj === undefined) {
			return false;
		}
		if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
			return obj.indexOf(target) !== -1;
		}
		return __any(obj, function(value) {
			return value === target;
		});
	};

	/* @function Produce a duplicate-free version of the array. If the array has already been sorted, you have the option of using a faster algorithm.
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

	/* @function Groups the object’s values by a criterion. Pass either a string attribute to group by, or a function that returns the criterion
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

	/* @function Uses a binary search to determine the index at which the value should be inserted into the list in order to maintain the list's sorted order.
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

	/* @function Returns the index at which value can be found in the array, or -1 if value is not present in the array.
	* @param {Array} array List of items to traverse
	* @param {Object} item Object to find into the array
	* @param {Booelan} isSorted When the array is Byed pass true and the algorithm will perform a faster approach
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
	/* @function Generate a unique integer id (unique within the entire client session).
	* @param {String} prefix Optional prefix name
	* @returns {String} Unique identifier
	*/
	var __uniqueId = function (prefix) {
		var id = ++idCounter + '';
		return prefix ? prefix + id : id;
	};

	/* @function Returns the last element of an array. Passing n will return the last n elements of the array..
	* @param {Integer} n Count of elements to return
	* @returns {[Object] || Object} Array with the last n values if n is specified or just the object of the array
	*/
	var  __last = function (array, n, guard) {
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

	/*
	* @function Util function to shallow clone any kind of object
	* @param {Object} obj object to clone
	* @returns {Object} Shadow copy of the passed in object
	*/
	var __shallowClone = function (obj)
	{
		if (!__isObject(obj))
		{
			return obj;
		}

    	return __isArray(obj) ? obj.slice() : __extend({}, obj);
	};

	/*
	* @function Returns the maximum value in list. If an iteratee function is provided, it will be used on each value to generate the criterion by which the value is ranked. -Infinity is returned if list is empty.
	* @param {Array<Object>|Object} obj Source of iteration to find the maximun value
	* @param {Function|String} iteratee Function that will be passed in each object in obj parameter, or a string indicate the property name to use to detect the max value of each object in the obj parray parameter
	* @param {Object} context Obhect used as a context when executing the iterator function.
	* @returns {Object} The element in the obj param with te maximun value as specified by the iteratee parameter
	*/
	var __max = function (obj, iteratee, context)
	{
		var result = -Infinity,
			lastComputed = -Infinity,
			value,
			computed;

		if ((iteratee === null || iteratee === undefined) && obj !== null)
		{
			obj = obj.length === +obj.length ? obj : __values(obj);

			for (var i = 0, length = obj.length; i < length; i++)
			{
				value = obj[i];
				if (value > result)
				{
					result = value;
				}
			}
		}
		else
		{
			iteratee = __iteratee(iteratee, context);

			__each(obj, function (value, index, list)
			{
				computed = iteratee(value, index, list);

				if (computed > lastComputed || computed === -Infinity && result === -Infinity)
				{
					result = value;
					lastComputed = computed;
				}
			});
		}
		return result;
	};

	/*
	* @function Convert an object into a list of [key, value] pairs.
	* @param {Object} obj Object to convert.
	* @param {Object} context Obhect used as a context when executing the iterator function.
	* @returns {Array<Array<Object>>} Returns an array where each items is a two values array; the first value is the string name of the property and the second if its value.
	*/
	var __pairs = function(obj)
	{
		var keys = __keys(obj),
			length = keys.length,
			pairs = new Array(length);

		for (var i = 0; i < length; i++)
		{
			pairs[i] = [keys[i], obj[keys[i]]];
		}
		return pairs;
	};

	/*
	* @function Returns a predicate function that will tell you if a passed in object contains all of the key/value properties present in attrs.
	* e.g.
	*		var ready = k.utils.obj.matches({selected: true, visible: true});
	*		var readyToGoList = _.filter(list, ready);
	* @param {Object} attrs Object containing the properties and values to match
	* @return {Function} A predicate that return true or false when the passed in parameter match with the original attrs
	*/
	var __matches = function (attrs)
	{
		var pairs = __pairs(attrs),
			length = pairs.length;

		return function(obj)
		{
			if (obj === null)
			{
				return !length;
			}

			obj = new Object(obj);
			for (var i = 0; i < length; i++)
			{
				var pair = pairs[i], key = pair[0];
				if (pair[1] !== obj[key] || !(key in obj))
				{
					return false;
				}
			}
			return true;
		};
	};

	/*
	* @function Return all of the values of the object's properties.
	* @param {Object} obj Object to extract properties' value
	* @return {Array<Object>} Array property values
	*/
	var __values = function(obj)
	{
		var keys = __keys(obj),
			length = keys.length,
			values = new Array(length);

		for (var i = 0; i < length; i++)
		{
			values[i] = obj[keys[i]];
		}
		return values;
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
		last: __last,
		shallowClone: __shallowClone,
		max: __max,
		pairs: __pairs,
		matches: __matches,
		values: __values
	};
})();

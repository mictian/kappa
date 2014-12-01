/* global expect: true, describe: true, it:  true, beforeEach: true, jasmine: true, spyOn:true */
'use strict';

describe('Object Utils', function()
{
		describe('inherit', function()
		{
			var Human,
				Ejecutive,
				h,
				e;

			beforeEach(function()
			{
				Human = (function()
				{
					var base = function() {
						this.age = 12;
						this.name = 'Human';
					};

					base.prototype.getAge = function() {
						return this.age;
					};

					base.prototype.sumAge = function() {
						++this.age;
					};

					return base;
				})();

				Ejecutive = (function(_super)
				{
					/* jshint latedef:false */
					k.utils.obj.inherit(son, _super);

					function son()
					{
						_super.apply(this, arguments);
						this.name = 'Ejecutive';
					}

					son.prototype.getAge = function() {
						return 'My age is: ' + this.age;
					};

					return son;
				})(Human);

				h = new Human();
				e = new Ejecutive();
			});

			it('shoud copy properties form base class to son class', function()
			{
				expect(e.age).toBe(12);
			});

			it('shoud have the same methods', function()
			{
				expect(e.getAge).toBeDefined();
				expect(e.sumAge).toBeDefined();
			});

			it('shoud support overide methods', function()
			{
				expect(h.getAge()).toBe(12);
				expect(e.getAge()).toBe('My age is: 12');
			});

			it('shoud support overide properties', function()
			{
				expect(h.name).toBe('Human');
				expect(e.name).toBe('Ejecutive');
			});
		});

		describe('defineProperty', function()
		{
			it('should at least specify context and property name', function()
			{
				var Ctx =  function() {
					this.options = {};

					k.utils.obj.defineProperty();
				};

				expect(function(){return new Ctx();}).toThrow();

				Ctx =  function() {
					this.options = {};

					k.utils.obj.defineProperty(this);
				};

				expect(function(){return new Ctx();}).toThrow();

				Ctx =  function() {
					this.options = {};

					k.utils.obj.defineProperty(null, 'test');
				};

				expect(function(){return new Ctx();}).toThrow();
			});

			it('should throw an error trying to SET a property if the base object (context) does not have an options property', function()
			{
				var Ctx =  function() {

					k.utils.obj.defineProperty(this, 'test');
				};
				var ins = new Ctx();

				expect(function() {ins.test = 12; } ).toThrow();
			});

			it('should throw an error trying to GET a property if the base object (context) does not have an options property', function()
			{
				var Ctx =  function() {

					k.utils.obj.defineProperty(this, 'test');
				};
				var ins = new Ctx();

				expect(function() {var test = ins.test; } ).toThrow();
			});

			it('should add properties listed in a for-in', function()
			{
				var Ctx =  function() {
					this.options = {
						test: 12
					};

					k.utils.obj.defineProperty(this, 'test');
				},
					ins = new Ctx(),
					isPropertyPresent = false;

				for(var prop in ins)
				{
					isPropertyPresent = isPropertyPresent || prop === 'test';
				}

				expect(isPropertyPresent).toBe(true);
			});

			it('should be possible to specify a particular getter', function()
			{
				var Ctx =  function() {
					this.options = {
						test: 12
					};

					k.utils.obj.defineProperty(this, 'test', {
						get: function() {
							return 'result';
						}
					});
				},
					ins = new Ctx();

				expect(ins.options.test).toBe(12);
				expect(ins.test).toBe('result');
			});

			it('should be possibel to specify a particular setter', function()
			{
				var Ctx =  function() {
					this.options = {
						test: 12
					};

					k.utils.obj.defineProperty(this, 'test', {
						set: function (val) {
							this.options.result = val;
						}
					});
				},
					ins = new Ctx();

				ins.test = 'result';
				expect(ins.options.test).toBe(12);
				expect(ins.options.result).toBe('result');
			});

			it('should throw an error if the GETTER specified is not a function', function()
			{
				var Ctx =  function() {
					this.options = {
						test: 12
					};

					k.utils.obj.defineProperty(this, 'test', {
						get: 'fakeValue'
					});
				};

				expect(function() {return new Ctx();}).toThrow();
			});

			it('should throw an error if the SETTER specified is not a function', function()
			{
				var Ctx =  function() {
					this.options = {
						test: 12
					};

					k.utils.obj.defineProperty(this, 'test', {
						set: 'fakeValue'
					});
				};

				expect(function() {return new Ctx();}).toThrow();
			});

		});

		describe('extend', function()
		{
			it('should extend the first paramter only', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extend(b,e);

				expect(e).toEqual({
					age:32
				});

				expect(b).toBe(result);
				expect(result).toEqual({
					name:'Who',
					age:32
				});

			});

			it('should return the first parameter', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extend(b,e);

				expect(b).toBe(result);
			});

			it('should accept any number of parameters', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extend(b,{},{},{},{},{},{},{},{},{},e);

				expect(b).toBe(result);
				expect(result).toEqual({
					name:'Who',
					age:32
				});
			});

			it('should override base properties from other passed in parameters', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extend(b,{},{},{},{},{},{},{},{},e,{},{
					anotherParam: true
				});

				expect(b).toBe(result);
				expect(result).toEqual({
					name:'Who',
					age:32,
					anotherParam:true
				});
			});
		});

		describe('clone', function()
		{
			it('shoud deep clone object', function()
			{
				var origin = {
					name: 'Tom',
					address : {
						street: '1522 woodlane dr',
						city: 'yakima',
						geo : {
							lat: '123',
							log: '321'
						}
					},
					active: true
				};

				var clone = k.utils.obj.clone(origin);

				expect(clone).toEqual(origin);
				origin.address.geo.lat = '12 3';

				expect(clone).not.toEqual(origin);
			});

			it('does not support functions', function()
			{
				var origin = {
					name: 'John',
					getName: function() {
						return this.name;
					}
				};

				var clone = k.utils.obj.clone(origin);

				expect(clone.getName).not.toBeDefined();
				expect(clone.name).toBe('John');
			});
		});

		describe('extendInNew', function()
		{
				it('should extend the first paramter only', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extendInNew(b,e);

				expect(e).toEqual({
					age:32
				});

				expect(b).not.toBe(result);
				expect(result).toEqual({
					name:'Who',
					age:32
				});

			});

			it('should returna new object', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extendInNew(b,e);

				expect(b).not.toBe(result);
			});

			it('should accept any number of parameters', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extendInNew(b,{},{},{},{},{},{},{},{},{},e);

				expect(result).toEqual({
					name:'Who',
					age:32
				});
			});

			it('should override base properties from other passed in parameters', function()
			{
				var b = {
						name:'Who',
						age: 12
					},
					e = {
						age: 32
					};

				var result = k.utils.obj.extendInNew(b,{},{},{},{},{},{},{},{},e,{},{
					anotherParam: true
				});

				expect(result).toEqual({
					name:'Who',
					age:32,
					anotherParam:true
				});
			});
		});

		describe('isArray', function()
		{
			it('should return true if the passed in parameter is an array', function()
			{
				expect(k.utils.obj.isArray([])).toBe(true);
				expect(k.utils.obj.isArray([[],[]])).toBe(true);
				expect(k.utils.obj.isArray([{},{}])).toBe(true);
				expect(k.utils.obj.isArray([true, false])).toBe(true);
				expect(k.utils.obj.isArray(['',''])).toBe(true);

			});

			it ('should return false if the passed in parameter is not an array', function()
			{
				expect(k.utils.obj.isArray()).toBe(false);
				expect(k.utils.obj.isArray(null)).toBe(false);
				expect(k.utils.obj.isArray(undefined)).toBe(false);
				expect(k.utils.obj.isArray({})).toBe(false);
				expect(k.utils.obj.isArray(12)).toBe(false);
				expect(k.utils.obj.isArray(false)).toBe(false);
				expect(k.utils.obj.isArray(true)).toBe(false);
			});
		});

		describe('isString', function()
		{
			it('should return true if the passed in paramters is a string', function()
			{
				expect(k.utils.obj.isString('')).toBe(true);
				expect(k.utils.obj.isString('text')).toBe(true);
				expect(k.utils.obj.isString('a')).toBe(true);
			});

			it ('should return false if the passed in parameter is not a string', function()
			{
				expect(k.utils.obj.isString()).toBe(false);
				expect(k.utils.obj.isString(null)).toBe(false);
				expect(k.utils.obj.isString(undefined)).toBe(false);
				expect(k.utils.obj.isString({})).toBe(false);
				expect(k.utils.obj.isString(12)).toBe(false);
				expect(k.utils.obj.isString(false)).toBe(false);
				expect(k.utils.obj.isString(true)).toBe(false);
			});
		});

		describe('isRegExp', function()
		{
			it('should return true if the passed in parameter is a reg exp', function()
			{
				expect(k.utils.obj.isRegExp(/a/)).toBe(true);
				expect(k.utils.obj.isRegExp(/\.a/)).toBe(true);
				var r = new RegExp('.a');
				expect(k.utils.obj.isRegExp(r)).toBe(true);
			});

			it('should return false if the passed in parameter is not a reg exp', function()
			{
				expect(k.utils.obj.isRegExp()).toBe(false);
				expect(k.utils.obj.isRegExp(null)).toBe(false);
				expect(k.utils.obj.isRegExp(undefined)).toBe(false);
				expect(k.utils.obj.isRegExp({})).toBe(false);
				expect(k.utils.obj.isRegExp(12)).toBe(false);
				expect(k.utils.obj.isRegExp(false)).toBe(false);
				expect(k.utils.obj.isRegExp(true)).toBe(false);
			});
		});

		describe('isNumber', function()
		{
			it('should return true if the passed in parameter is a Number', function()
			{
				expect(k.utils.obj.isNumber(12)).toBe(true);
				expect(k.utils.obj.isNumber(-123)).toBe(true);
				expect(k.utils.obj.isNumber(0.12)).toBe(true);
				expect(k.utils.obj.isNumber(-0.12)).toBe(true);
			});

			it('should return false if the passed in parameter is not a reg exp', function()
			{
				expect(k.utils.obj.isNumber()).toBe(false);
				expect(k.utils.obj.isNumber(null)).toBe(false);
				expect(k.utils.obj.isNumber(undefined)).toBe(false);
				expect(k.utils.obj.isNumber({})).toBe(false);
				expect(k.utils.obj.isNumber(/a/)).toBe(false);
				expect(k.utils.obj.isNumber(false)).toBe(false);
				expect(k.utils.obj.isNumber(true)).toBe(false);
			});
		});

		describe('isFunction', function()
		{
			it('should return true if the passed in parameter is a Function', function()
			{
				expect(k.utils.obj.isFunction(function () {})).toBe(true);
				var a = function(){};
				var o = {
					f : function () {}
				};
				expect(k.utils.obj.isFunction(a)).toBe(true);
				expect(k.utils.obj.isFunction(o.f)).toBe(true);
			});

			it('should return false if the passed in parameter is not a Function', function()
			{
				expect(k.utils.obj.isFunction()).toBe(false);
				expect(k.utils.obj.isFunction(null)).toBe(false);
				expect(k.utils.obj.isFunction(undefined)).toBe(false);
				expect(k.utils.obj.isFunction({})).toBe(false);
				expect(k.utils.obj.isFunction(/a/)).toBe(false);
				expect(k.utils.obj.isFunction(false)).toBe(false);
				expect(k.utils.obj.isFunction(12)).toBe(false);
				expect(k.utils.obj.isFunction(0.7)).toBe(false);
				expect(k.utils.obj.isFunction(true)).toBe(false);
			});
		});

		describe('isBoolean', function()
		{
			it('should return true if the passed in parameter is a Boolean', function()
			{
				expect(k.utils.obj.isBoolean(true)).toBe(true);
				expect(k.utils.obj.isBoolean(false)).toBe(true);
				expect(k.utils.obj.isBoolean(1 === 1)).toBe(true);
			});

			it('should return false if the passed in parameter is not a Boolean', function()
			{
				expect(k.utils.obj.isBoolean()).toBe(false);
				expect(k.utils.obj.isBoolean(null)).toBe(false);
				expect(k.utils.obj.isBoolean(undefined)).toBe(false);
				expect(k.utils.obj.isBoolean({})).toBe(false);
				expect(k.utils.obj.isBoolean(/a/)).toBe(false);
				expect(k.utils.obj.isBoolean(function(){})).toBe(false);
				expect(k.utils.obj.isBoolean(12)).toBe(false);
				expect(k.utils.obj.isBoolean(0.7)).toBe(false);
				expect(k.utils.obj.isBoolean('a')).toBe(false);
			});
		});

		describe('isArguments', function()
		{
			it('should return true if the passed in parameter is an Arguments Array', function()
			{
				expect(k.utils.obj.isArguments(arguments)).toBe(true);
			});

			it('should return false if the passed in parameter is not an Arguments Array', function()
			{
				expect(k.utils.obj.isArguments()).toBe(false);
				expect(k.utils.obj.isArguments(null)).toBe(false);
				expect(k.utils.obj.isArguments(undefined)).toBe(false);
				expect(k.utils.obj.isArguments({})).toBe(false);
				expect(k.utils.obj.isArguments(/a/)).toBe(false);
				expect(k.utils.obj.isArguments(function(){})).toBe(false);
				expect(k.utils.obj.isArguments(12)).toBe(false);
				expect(k.utils.obj.isArguments(0.7)).toBe(false);
				expect(k.utils.obj.isArguments(false)).toBe(false);
				expect(k.utils.obj.isArguments(true)).toBe(false);
				expect(k.utils.obj.isArguments('a')).toBe(false);
			});
		});

		describe('isObject', function ()
		{
			it('should return true if the passed in parameter is an Object', function()
			{
				expect(k.utils.obj.isObject({})).toBe(true);
				//Warning remove to support Object cretion without using object literal notation
				/*jshint -W010 */
				expect(k.utils.obj.isObject(new Object())).toBe(true);
				expect(k.utils.obj.isObject(Object.create({}))).toBe(true);
				expect(k.utils.obj.isObject(/a/)).toBe(true);
				expect(k.utils.obj.isObject({
					test: true,
					fake: 'YES'
				})).toBe(true);

			});

			it('should return false if the passed in parameter is not a Object', function()
			{
				expect(k.utils.obj.isObject(12)).toBe(false);
				expect(k.utils.obj.isObject()).toBe(false);
				expect(k.utils.obj.isObject(null)).toBe(false);
				expect(k.utils.obj.isObject(undefined)).toBe(false);
				expect(k.utils.obj.isObject(false)).toBe(false);
				expect(k.utils.obj.isObject(true)).toBe(false);
				expect(k.utils.obj.isObject(function(){})).toBe(false);
			});
		});

		describe('isUndefined', function ()
		{
			it('should return true if the passed in parameter is Undefined', function()
			{
				expect(k.utils.obj.isUndefined()).toBe(true);
				//Warning remove to support Object cretion without using object literal notation
				/*jshint -W010 */
				expect(k.utils.obj.isUndefined(undefined)).toBe(true);
			});

			it('should return false if the passed in parameter is not Undefined', function()
			{
				expect(k.utils.obj.isUndefined(12)).toBe(false);
				expect(k.utils.obj.isUndefined(null)).toBe(false);
				expect(k.utils.obj.isUndefined(false)).toBe(false);
				expect(k.utils.obj.isUndefined(true)).toBe(false);
				expect(k.utils.obj.isUndefined({})).toBe(false);
				expect(k.utils.obj.isUndefined(function(){})).toBe(false);
			});
		});

		describe('has', function ()
		{
			it('should return true if the specified object has the passed in property', function ()
			{
				var t = {
					'propertyName': true
				};

				expect(k.utils.obj.has(t, 'propertyName')).toBe(true);
			});

			it ('shoud return false if the specified object does not has the passed int property', function ()
			{
				var t = {
					'propertyName': true
				};

				expect(k.utils.obj.has(t, 'fakeName')).toBe(false);
			});

		});

		describe('keys', function ()
		{
			it('should return empty array if the passed in parameter is not an object', function ()
			{
				expect(k.utils.obj.keys(null)).toEqual([]);
				expect(k.utils.obj.keys(12)).toEqual([]);
				expect(k.utils.obj.keys(true)).toEqual([]);
				expect(k.utils.obj.keys(false)).toEqual([]);
				expect(k.utils.obj.keys('')).toEqual([]);
				expect(k.utils.obj.keys(function() {})).toEqual([]);
			});

			it('should return common properties and functions', function()
			{
				var ctx = {
					name: 'John',
					lastName: 'Smith',
					getName: function() {
						return this.name;
					}
				};

				var result = k.utils.obj.keys(ctx);

				expect(result.length).toBe(3);
				expect(result).toEqual(['name', 'lastName', 'getName']);
			});

			it('should return only properties owned by the curent object', function()
			{
				var Ctx = function () {
					this.name = 'John';
					this.lastName= 'Smith';
					this.getName= function() {
						return this.name;
					};
				};

				Ctx.prototype = {
					hide: 'yes'
				};

				var result = k.utils.obj.keys(new Ctx());

				expect(result.length).toBe(3);
				expect(result).toEqual(['name', 'lastName', 'getName']);
			});
		});

		describe('each', function()
		{
			it('should return null of the passed in parameter is null', function ()
			{
				expect(k.utils.obj.each(null, function(){})).toBe(null);
			});

			it('should iterate over each object key if the passed in parameter is an object', function ()
			{
				var count = 0,
					iterator =  function() {
						++count;
					};

				k.utils.obj.each({
						'one':true,
						'two':true,
						'three': true
					}, iterator);

				expect(count).toBe(3);
			});

			it('should call the iteration function with the item, index and object if it is an array', function ()
			{
				var count = 0,
					firstValue,
					secondValue,
					lastValue,
					iterator =  function(item, counter, items) {
						++count;
						if (count === 1) {firstValue = item;}
						if (count === 2) {secondValue = item;}
						if (count === 3) {lastValue = item;}
					};

				k.utils.obj.each([1, 2, 3], iterator);

				expect(count).toBe(3);
				expect(lastValue).toBe(3);
				expect(secondValue).toBe(2);
				expect(firstValue).toBe(1);
			});

			it('should call the iteration function with the item index and object if it is an object', function ()
			{
				var count = 0,
					firstValue,
					secondValue,
					lastValue,
					iterator =  function(item, counter, items) {
						++count;
						if (count === 1) {firstValue = item;}
						if (count === 2) {secondValue = item;}
						if (count === 3) {lastValue = item;}
					};

				k.utils.obj.each({
					first: 1,
					second: 2,
					thrird: 3
				}, iterator);

				expect(count).toBe(3);
				expect(lastValue).toBe(3);
				expect(secondValue).toBe(2);
				expect(firstValue).toBe(1);
			});
		});

		describe('map', function ()
		{
			it('shoud return [] if the first value is null', function ()
			{
				expect(k.utils.obj.map(null)).toEqual([]);
			});

			it('should iterate over each item colleciton the result of calling the iteration function', function ()
			{
				var result = k.utils.obj.map([1,2,3] , function(item) {
					return item*2;
				});

				expect(result).toEqual([2,4,6]);
			});
		});

		describe('reduce', function ()
		{
			it('should assume [] is passed null as object to iterate', function ()
			{
				var iterator = jasmine.createSpy('fake iterator');
				k.utils.obj.reduce(null, iterator, '');

				expect(iterator).not.toHaveBeenCalled();
			});

			it('should execute iteration function in the specifed context', function ()
			{
				var context = {
						custom: true
					},
					specifedContext = false;

				k.utils.obj.reduce([1], function()
				{
					specifedContext = this.custom === true;
				}, '', context);

				expect(specifedContext).toBe(true);
			});

			it('should throw an error in the number of arguments is less or equal than 2', function ()
			{
				expect(function () {
					k.utils.obj.reduce();
				}).toThrow();

				expect(function () {
					k.utils.obj.reduce([1]);
				}).toThrow();

				expect(function () {
					k.utils.obj.reduce([1], {});
				}).toThrow();
			});

			it('should execute our code calling the iteration function passing accumulated value, current value, index and the entier list when there are not native support for reduce', function ()
			{
				var fakeIterator = jasmine.createSpy('fake spy').and.returnValue('');
				k.utils.obj.reduce([1,2], fakeIterator, '');

				expect(fakeIterator).toHaveBeenCalled();
				expect(fakeIterator.calls.count()).toBe(2);
				expect(fakeIterator.calls.argsFor(0)).toEqual(['', 1, 0, [1,2]]);
				expect(fakeIterator.calls.argsFor(1)).toEqual(['', 2, 1, [1,2]]);
			});

			it('should use the first value as inital value, if the initial value is not specified', function ()
			{
				var initialValue;

				k.utils.obj.reduce([1,2], function(acc, val, ind, list)
				{
					initialValue = acc;
				});

				expect(initialValue).toEqual(1);
			});

			it('should reduce the list passed based on the speicified iterator function', function ()
			{
				var result = k.utils.obj.reduce([1,2,3], function (acc, val)
				{
					return acc + val;
				}, '');

				expect(result).toBe('123');
			});

		});

		describe('bind', function ()
		{
			it('should call the specified function in the specified context', function ()
			{
				var ctxPasssed = { iAmCutom: 'yeap'},
					ctx,
					fn = function() {
						ctx = this;
					};

				k.utils.obj.bind(fn, ctxPasssed)();

				expect(ctx).toEqual(ctxPasssed);
			});

			it('should throw if not passed in a valid function', function ()
			{
				expect(function ()
				{
					k.utils.obj.bind(null, {});
				}).toThrow();
			});
		});

		describe('filter', function ()
		{
			it('should returns only the values that retun thruly in the predicate', function ()
			{
				var result = k.utils.obj.filter([1,2,3,4,5,6,7,8,9,0], function (value){
					return value % 2 === 0;
				});

				expect(result).toEqual([2,4,6,8,0]);
			});

			it('should execute in the specifed context', function ()
			{
				var expectedCtx,
					ctx = {custom:'yes'};

				k.utils.obj.filter([1,2], function (){
					expectedCtx = this;
				}, ctx);

				expect(expectedCtx).toBe(ctx);
			});

			it('should resultl [] is passed in null', function ()
			{
				expect(k.utils.obj.filter(null)).toEqual([]);
			});
		});

		describe('any', function()
		{
			it('should return true if at least one elemnt pass the predicator function', function ()
			{
				var counter = 0,
					result = k.utils.obj.any([1,2,3,4,5], function (value)
					{
						counter++;
						return value === 2;
					});

				expect(result).toBe(true);
				expect(counter).toBe(2);
			});

			it('should return false if obj is null', function ()
			{
				expect(k.utils.obj.any(null)).toBe(false);
			});

			it('should return false if no element pass the predicate', function ()
			{
				var counter = 0,
					result = k.utils.obj.any([1,2,3,4,5], function (value)
					{
						counter++;
						return value === 0;
					});

				expect(result).toBe(false);
				expect(counter).toBe(5);
			});
		});

		describe('pluck', function()
		{
			it('shoould return an array with values of the property specifed', function ()
			{
				var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
				var result = k.utils.obj.pluck(stooges, 'name');

				expect(result).toEqual(['moe', 'larry', 'curly']);
			});

			it('should return [] if passed null', function()
			{
				expect(k.utils.obj.pluck(null)).toEqual([]);
			});

			it('should return [undefined, undefined, undefined] if ', function()
			{
				var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
				expect(k.utils.obj.pluck(stooges, 'fake')).toEqual([undefined, undefined, undefined]);
			});
		});

		describe('property', function ()
		{
			it('should return a function that accept an obect and return the value of the set property', function ()
			{
				var fn = k.utils.obj.property('name');
				var obj = {
					name: 'result'
				};

				expect(fn(obj)).toEqual('result');
			});

			it('should undefined if the the property is not present in the obj', function ()
			{
				var fn = k.utils.obj.property('fakeProp');
				var obj = {
					name: 'result'
				};

				expect(fn(obj)).toEqual(undefined);
			});
		});

		describe('sortBy', function ()
		{
			it('should return [] if pass null', function ()
			{
				expect(k.utils.obj.sortBy(null)).toEqual([]);
			});

			it('should execute the iterator function in the specified context', function ()
			{
				var expectedCtx = {cusotm: 'yes'},
					ctx;

				k.utils.obj.sortBy([1,2], function()
				{
					ctx = this;
				}, expectedCtx);

				expect(ctx).toBe(expectedCtx);
			});

			it('should sort a list of object based on the property specifed by the itarion function', function ()
			{
				var result = k.utils.obj.sortBy([
						{
							name: 'THREE',
							index: 3
						},
						{
							name: 'FOUR',
							index: 4
						},
						{
							name: 'ONE',
							index: 1
						},
						{
							name: 'TWO',
							index: 2
						}
					], function (obj) {
						return obj.index;
					});

				expect(result).toEqual([
						{
							name: 'ONE',
							index: 1
						},
						{
							name: 'TWO',
							index: 2
						},
						{
							name: 'THREE',
							index: 3
						},
						{
							name: 'FOUR',
							index: 4
						}
					]);
			});

			it('should return the list of number sorted as specified', function ()
			{
				var result = k.utils.obj.sortBy([1, 2, 3, 4, 5, 6], function(num){ return Math.sin(num); });
				expect(result).toEqual([5, 4, 6, 3, 1, 2]);
			});

			it('should return the same passed list if no sort function is specifed', function ()
			{
				var expectedList = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
				expect(k.utils.obj.sortBy(expectedList)).toEqual([1,2,3,4,5,6,7,8,9,10]);
			});

		});

		describe('find', function ()
		{
			it('should find the first object that fulfill the specified requirements', function ()
			{
				expect(k.utils.obj.find([1,2,3,4,5], function(i){return i === 2; })).toBe(2);
			});

			it('should iterate the list just until the first element if found', function ()
			{
				var spyIterator = jasmine.createSpy('fake Iterator').and.callFake(function(i) {
			      return i === 4;
			    });

				var result = k.utils.obj.find([1,2,3,4,5], spyIterator);

				expect(result).toBe(4);
				expect(spyIterator).toHaveBeenCalled();
				expect(spyIterator.calls.count()).toBe(4);
			});

			it('should return undefiend if no item is found', function ()
			{
				expect(k.utils.obj.find([1,2,3,4,], function (){return false;})).toBeUndefined();
			});

			it('should return undefined is passed in null', function ()
			{
				expect(k.utils.obj.find(null, function(){return true;})).toBeUndefined();
			});
		});

		describe('every', function()
		{
			it('should return true if all elemtns in the list return true in the predicate', function ()
			{
				expect(k.utils.obj.every([2,4,6,8,10], function(i) {return i % 2 === 0;})).toBe(true);
			});

			it('should return false if at least one item do not pass the predicate', function ()
			{
				expect(k.utils.obj.every([2,4,6,8,10,11], function(i) {return i % 2 === 0;})).toBe(false);
			});

			it('should true if pass null', function ()
			{
				expect(k.utils.obj.every(null)).toBe(true);
				expect(k.utils.obj.every([1,2,3])).toBe(true);
			});
		});

		describe('flatten', function ()
		{
			it('should flatten recursively all array that are passed in', function ()
			{
				var input = [1,2, [3, 4, [5, 6], 7, [8, [9, 10] ] ] ],
					expectedOutput = [1,2,3,4,5,6,7,8,9, 10];

				expect(k.utils.obj.flatten(input)).toEqual(expectedOutput);
			});

			it('should only flat the first level is shallow is true', function ()
			{
				var input = [ [ [1],[2]], [[3],[4]], [[5],[6]], [[7],[8]], [[9], [10]] ],
					expectedOutput = [[1],[2],[3],[4],[5],[6],[7],[8],[9],[10]];

				expect(k.utils.obj.flatten(input, true)).toEqual(expectedOutput);
			});

			it('should return [] is passed null', function ()
			{
				expect(k.utils.obj.flatten(null)).toEqual([]);
			});
		});

		describe('contains', function()
		{
			it('should return false if the passed in obj is null', function ()
			{
				expect(k.utils.obj.contains(null)).toBe(false);
			});

			it('should return true if the list contains the specified element', function ()
			{
				expect(k.utils.obj.contains([1,2,3,4,5,6],6)).toBe(true);
			});

			it('should return false if the item specified is not in the list', function ()
			{
				expect(k.utils.obj.contains([1,2,3,4,5,6],7)).toBe(false);
			});

			it('should return false if looking for simple objects', function ()
			{
				expect(k.utils.obj.contains([
					{
						index:1
					},
					{
						index: 2
					},
					{
						index: 3
					}],
					{
						index:2
					})).toBe(false);
			});
		});

		describe('uniq', function ()
		{
			it('should return the original list without duplicated values numbers', function ()
			{
				expect(k.utils.obj.uniq([1, 2, 1, 3, 1, 4])).toEqual([1, 2, 3, 4]);
			});

			it('should detect duplicated objects based on the function specified', function ()
			{
				var result = k.utils.obj.uniq([
					{
						name: 'A'
					},
					{
						name: 'Z'
					},
					{
						name: 'A'
					},
					{
						name: 'B'
					},
					{
						name: 'A'
					}],false, function (item){
						return item.name;
					});

				expect(result).toEqual([{name:'A'},{name:'Z'},{name:'B'}]);
			});

			it('should execute the function in the specified context', function ()
			{
				var expectedCtx = {custom:'yeap'},
					ctx;

				k.utils.obj.uniq([1,2,1,3,1,4],false, function (i) {
					ctx = this;
					return i;
				}, expectedCtx);

				expect(ctx).toBe(expectedCtx);
			});

			it('should use as iterator function the second parameter if it is a function', function ()
			{
				var result = k.utils.obj.uniq([
					{
						name: 'A'
					},
					{
						name: 'Z'
					},
					{
						name: 'A'
					},
					{
						name: 'B'
					},
					{
						name: 'A'
					}], function (item){
						return item.name;
					});

				expect(result).toEqual([{name:'A'},{name:'Z'},{name:'B'}]);
			});

			it('shoudl return [] if passed null', function ()
			{
				expect(k.utils.obj.uniq(null)).toEqual([]);
			});
		});

		describe('groupBy', function ()
		{
			it('should group the list based on the key retuned by the function', function ()
			{
				var result = k.utils.obj.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
				expect(result).toEqual({1: [1.3], 2: [2.1, 2.4]});
			});

			it('should return {} if passed null', function ()
			{
				expect(k.utils.obj.groupBy(null)).toEqual({});
			});

			it('shoudl return an object where each key is equal as its array value', function ()
			{
				var result = k.utils.obj.groupBy([1,2,3,4], function(i)
				{
					return i;
				});

				expect(result).toEqual({
					'1': [1],
					'2': [2],
					'3': [3],
					'4': [4]
				});
			});

			it('should execute the function in the specified context', function ()
			{
				var expectedCtx = {custom:'yeap'},
					ctx;

				k.utils.obj.groupBy([1,2,3,4], function(i)
				{
					ctx = this;
					return i;
				}, expectedCtx);

				expect(ctx).toBe(expectedCtx);
			});

			it('should group by the property passed if instead of a function a string is passed', function ()
			{
				var result = k.utils.obj.groupBy(['one', 'two', 'three'], 'length');
				expect(result).toEqual({3: ['one', 'two'], 5: ['three']});
			});
		});

		describe('sortedIndex', function ()
		{
			it('should return the correct index when the items are integers', function ()
			{
				var result = k.utils.obj.sortedIndex([10, 20, 30, 40, 50], 35);
				expect(result).toBe(3);
			});

			it('should accept a string as an iterator that should be used as the property name when using objects', function ()
			{
				var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}];
				var result = k.utils.obj.sortedIndex(stooges, {name: 'larry', age: 50}, 'age');

				expect(result).toBe(1);
			});

			it('should return the correct index when using a function iterator', function ()
			{
				var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}];
				var result = k.utils.obj.sortedIndex(stooges, {name: 'larry', age: 50}, function (item) {return item.age;});

				expect(result).toBe(1);
			});

			it('should trow an exception when passing null', function ()
			{
				expect(function () {return k.utils.obj.sortedIndex(null, 1);} ).toThrow();
			});
		});

		describe('indexOf', function ()
		{
			it('should return the valid index when present in a number array', function ()
			{
				expect(k.utils.obj.indexOf([1,2,3],2)).toBe(1);
			});

			it('should return -1 when the parameter is not present in a number array', function ()
			{
				expect(k.utils.obj.indexOf([1,2,3],5)).toBe(-1);
			});

			it('should return the correct index in an object array', function ()
			{
				var p = {
					name: 'A',
					lastName: 'B'
				};

				expect(k.utils.obj.indexOf([{
					name: '1',
					lastName: '2'
				},{
					name:'3',
					lastName:'4'
				},
				p
				],p)).toBe(2);
			});

			it('should return -1 if not passing the same (identity) object when in an object array', function ()
			{
				var p = {
					name: 'A',
					lastName: 'B'
				};

				expect(k.utils.obj.indexOf([{
					name: '1',
					lastName: '2'
				},{
					name:'3',
					lastName:'4'
				},
				{nane:'A', lastName:'B'}
				],p)).toBe(-1);
			});
		});

		describe('uniqueId', function ()
		{
			it('should return a value with the specified prefix', function ()
			{
				var result = k.utils.obj.uniqueId('test');
				expect(result.lastIndexOf('test', 0)).toBe(0);
			});

			it ('return when getting twice, 2 differente values', function ()
			{
				var res1 = k.utils.obj.uniqueId(),
					res2 = k.utils.obj.uniqueId();

				expect(res1).not.toBe(res2);
				expect(res1).not.toEqual(res2);
			});
		});

		describe('last', function ()
		{
			it('should return false fo not array is specified', function ()
			{
				expect(k.utils.obj.last()).toBeFalsy();
			});

			it('should return the last item in the array if no n is specifeid', function ()
			{
				expect(k.utils.obj.last([1,2,3,4])).toEqual(4);
				expect(k.utils.obj.last([1,2,3,4, true])).toEqual(true);

				var obj = {test:'yes'};
				expect(k.utils.obj.last([1,2,3,4, obj])).toBe(obj);
			});

			it('should return an array with the n last values if n is specified', function ()
			{
				expect(k.utils.obj.last([1,2,3,4],3)).toEqual([2,3,4]);
				expect(k.utils.obj.last([1,2,3,4],75)).toEqual([1,2,3,4]);
				expect(k.utils.obj.last([1,2,3,4, true],2)).toEqual([4, true]);

				var obj = {test:'yes'};
				expect(k.utils.obj.last([1,2,3,4, obj],1)).toEqual([obj]);
			});
		});

		describe('shallowClone', function ()
		{
			it('should return the same param if the passed in parameter is NOT an object', function ()
			{
				expect(k.utils.obj.shallowClone(false)).toBe(false);
				expect(k.utils.obj.shallowClone('')).toEqual('');
				expect(k.utils.obj.shallowClone()).toBeUndefined();
				expect(k.utils.obj.shallowClone(function(){})).toEqual(jasmine.any(Function));
			});

			it('should clone an array but not its items', function ()
			{
				var item1 = {},
					item2 = 2,
					item3 = {name:'tester'},
					array = [item1, item2, item3];

				var result = k.utils.obj.shallowClone(array);

				expect(result).toEqual(jasmine.any(Array));
				expect(result.length).toBe(3);
				expect(result).not.toBe(array);
				expect(result[0]).toBe(item1);
				expect(result[1]).toBe(item2);
				expect(result[2]).toBe(item3);
			});

			it('should made a shallow copy of object', function ()
			{
				var propObj = {name: 'tester', lastName: 'doe'},
					input = {
						name: 'string',
						obj: propObj
					},
					result = k.utils.obj.shallowClone(input);

				expect(result).not.toBe(input);
				expect(result).toEqual(input);
				expect(result.obj).toBe(propObj);

			});

		});
	});

/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/utils/obj'], function(k)
{
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
	});
});
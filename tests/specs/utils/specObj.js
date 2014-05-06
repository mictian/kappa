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
	});
});
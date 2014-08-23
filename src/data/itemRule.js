define(['../utils/obj', './grammar'], function(k)
{
	'use strict';

	/* Item Rule
	* @class
	* @classdesc This class represent an Item. A rule being processed. Generally a dot is used to represent which part have already been
	processed. Ex. S ==> aB*AB */
	var ItemRule = (function()
	{
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
			this.lookAhead = result.lookAhead = lookAheadAux;

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
			//TODO TEST THIS
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
			//TODO TEST look ahead parameter!
			return k.utils.obj.reduce(rules, function (acc, rule)
			{
				acc.push(new ItemRule({
					rule: rule,
					dotLocation: 0,
					lookAhead: lookAhead || []
				}));
				return acc;
			}, []);
		};

		return itemRule;
	})();

	k.data = k.utils.obj.extend(k.data || {}, {
		ItemRule: ItemRule
	});

	return k;
});
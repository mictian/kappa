define(['../utils/obj'], function(k)
{
	'use strict';

     /** Item Rule
    * @class
    * @classdesc This class represent an Item. A rule being processed. Generally a dot is used to represnet which part have already been
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
            this.rule = options.rule;
            this.dotLocation = options.dotLocation || 0;
        };

        /** @function Convert the current item rule to its string representation
        * @returns formatted string */
        itemRule.prototype.toString = function()
        {
            var aux = this.rule.head.name +'-->';
            for (var i = 0; i < this.rule.tail.length; i++) {
                if (this.dotLocation == i)
                    aux += '*';
                aux += this.rule.tail[i].toString();
            }
            if (this.dotLocation == i)
                    aux += '*';
            return aux;
        };

        /** @function Clone the current item, altering its state by the params specified in cloneOptions
        * @param {Integer} cloneOptions.dotLocationIncrement Increment that will be applied into the dot location of the new item. Default: 0
        * @returns A clean new item */
        itemRule.prototype.clone = function(cloneOptions)
        {
            var cloneOpt = k.utils.obj.extendInNew(defaultCloneOptions, cloneOptions || {});
            var result = new ItemRule(this.options);
            result._incrementDotLocation(cloneOpt.dotLocationIncrement);

            return result;
        };

        /** @function Increase the dot location by the number specified by parameter
        * @param {Integer} increment Increment that will be applied into the dot location of the new item. Default: 1
        * @returns void */
        itemRule.prototype._incrementDotLocation= function(increment) {
            this.options.dotLocation = (this.options.dotLocation || 0) + (increment || 1);
            this.dotLocation = this.options.dotLocation;
        };

        /** @function Returns the right next symbol to the dot location
        * @returns Next symbol or null if there is not next symbol */
        itemRule.prototype.getCurrentSymbol = function ()
        {
            return this.dotLocation < (this.rule.tail.length + 1) ? this.rule.tail[this.dotLocation] : null;
        };

        /** @function Create an array of item rules from an array of rules
        * @param {[Rule]} rules Array of rules used to create the item rules. Each new item rule will have 0 as dot location
        * @returns array of new Item Rules */
        itemRule.newFromRules = function(rules)
        {
            var itemRules = [];
            for (var i = 0; i < rules.length; i++)
            {
                itemRules.push(new ItemRule({
                    rule:rules[i],
                    dotLocation:0
                }));
            }
            return itemRules;
        };

        return itemRule;
	})();

	k.data = k.utils.obj.extend(k.data || {}, {
        ItemRule: ItemRule
	});

	return k;
});
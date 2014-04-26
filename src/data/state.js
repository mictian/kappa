define(['../utils/obj'], function(k)
{
	'use strict';

     /*  State
    * @class
    * @classdesc This class reprensent an automata state */
	var State = (function()
	{
         /*
        * Constructor Automata State
        *
        * @constructor
        * @param {[ItemRule]} options.items Array of item rules that initialy compone this state
        */
        var state = function(options)
        {
            this._items = options.items || [];
            this.index = 0;
            this._registerItems = {};

            for (var i = 0; i < this._items.length; i++) {
                this._registerItems[this._items[i].rule.index] = true;
            }
        };

        /** @function Get the next unprocessed item rule
        * @returns Item Rule */
        state.prototype.getNextItem = function() {
            if (this.index < this._items.length)
                return this._items[this.index++];

            return null;
        };

        /** @function Adds an array of item rule into the state. Only the rules that are not already present in the state will be added
        * @param {[ItemRule]} itemRules Array of item rules to add into the state
        * @returns void */
        state.prototype.addItems = function (itemRules)
        {
            for (var i = 0; i < itemRules.length; i++) {
                if (!this._registerItems[itemRules[i].rule.index])
                {
                    this._registerItems[itemRules[i].rule.index] = true;
                    this._items.push(itemRules[i]);
                }
            }
        };

        /** @function Convert the current state to its string representation
        * @returns formatted string */
        state.prototype.toString = function()
        {
            var strResult = '';
            for (var i = 0; i < this._items.length; i++) {
                strResult += this._items[i].toString() + '\n';
            }
            return strResult;
        }

        return state;
	})();

    k.data = k.utils.obj.extend(k.data || {}, {
        State: State
	});

	return k;
});
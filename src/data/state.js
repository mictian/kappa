define(['../utils/obj'], function(k)
{
	'use strict';

    /* State
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
			this.transitions = options.transitions || [];
            this._items = options.items || [];
            this._index = 0;
            this._registerItems = {};

            for (var i = 0; i < this._items.length; i++) {
                this._registerItems[this._items[i].rule.index] = true;
            }
        };

        /** @function Get the next unprocessed item rule
        * @returns Item Rule */
        state.prototype.getNextItem = function() {
			return this._index < this._items.length ? this._items[this._index++] : null;
        };

        /** @function Adds an array of item rule into the state. Only the rules that are not already present in the state will be added
        * @param {[ItemRule]} itemRules Array of item rules to add into the state
        * @returns void */
        state.prototype.addItems = function(itemRules)
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
            var strResult = 'ID: ' + this.getIdentity()+'\n';
            for (var i = 0; i < this._items.length; i++) {
                strResult += this._items[i].toString() + '\n';
            }
            strResult += '\nTRANSITIONS:\n';

            for (i = 0; i < this.transitions.length; i++) {
                strResult += '*--'+ this.transitions[i].symbol + '-->' + this.transitions[i].state.getIdentity() + '\n';
            }
            return strResult;
        };

        /** @function Generates an ID that identify this state from any other state
        * @returns String ID  */
        state.prototype._generateIdentity = function() {
            var indexes = [];
            for (var i = 0; i < this._items.length; i++) {
                indexes.push(this._items[i].rule.index);
            }
            return indexes.sort(function(a,b){return a-b;}).join('-');
        };

        /** @function Returns the stinrg ID of the current state
        * @returns String ID  */
        state.prototype.getIdentity = function() {
            if (!this._id) {
                this._id = this._generateIdentity();
            }
            return this._id;
        };

        /** @function Returns a copy of the items contained in the current state
        * @returns Array of items rules  */
        state.prototype.getItems = function()
        {
			return k.utils.obj.map(this._items, function(item) {
				return item.clone();
			});
        };

        /** @function Get the list of all supported symbol which are valid to generata transition from the current state.
        * @returns Array of object of the form: {symbol, items} where items have an array of item rules  */
        state.prototype.getSupportedTransitionSymbols = function () {
            var itemsAux = {},
                result = [];

            for (var i = 0; i < this._items.length; i++)
            {
                var symbol = this._items[i].getCurrentSymbol();
                if (symbol)
                {
                    if (itemsAux[symbol.name])
                    {
                        itemsAux[symbol.name].push(this._items[i]);
                    }
                    else
                    {
                        itemsAux[symbol.name] = [this._items[i]];
                        result.push({
                            symbol: symbol,
                            items: itemsAux[symbol.name]
                        });
                    }
                }
            }

            return result;
        };

        /** @function Add a new transaction into the list of transactions of the current state
        * @param {Symbol} symbol Symbol use to make the transition, like the name of the transition
        * @param {State} state Destination state arrived when moving with the specified tranisiotn
        * @returns void  */
        state.prototype.addTransition = function(symbol, state) {
            this.transitions.push({
                symbol: symbol,
                state: state
            });
        };

        return state;
	})();

    k.data = k.utils.obj.extend(k.data || {}, {
        State: State
	});

	return k;
});
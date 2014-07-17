define(['../utils/obj', './grammar'], function(k) {
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
        var state = function(options) {
            this.options = options;

            k.utils.obj.defineProperty(this, 'transitions');
            k.utils.obj.defineProperty(this, 'isAcceptanceState'); // This is set by the automata generator
            
            k.utils.obj.defineProperty(this, '_items');
            k.utils.obj.defineProperty(this, '_index');
            k.utils.obj.defineProperty(this, '_registerItems');
            k.utils.obj.defineProperty(this, '_id');
            k.utils.obj.defineProperty(this, '_condencedView');

            this.isAcceptanceState = false;
            this.transitions = options.transitions || [];
            this._items = options.items || [];
            this._index = 0;
            this._registerItems = {};

            k.utils.obj.each(this._items, function (itemRule)
            {
                this._registerItems[itemRule.getIdentity()] = true;
            }, this);
        };

        /* @function Get the next unprocessed item rule
         * @returns {ItemRule} Next Item Rule */
        state.prototype.getNextItem = function() {
            return this._index < this._items.length ? this._items[this._index++] : null;
        };

        /* @function Adds an array of item rule into the state. Only the rules that are not already present in the state will be added
         * @param {[ItemRule]} itemRules Array of item rules to add into the state
         * @returns {void} Nothing */
        state.prototype.addItems = function(itemRules) {
            this._id = null;
            k.utils.obj.each(itemRules, function (itemRule)
            {
                if (!this._registerItems[itemRule.getIdentity()])
                {
                    this._registerItems[itemRule.getIdentity()] = true;
                    this._items.push(itemRule);
                }
            }, this);
        };

        /* @function Convert the current state to its string representation
         * @returns {String} formatted string */
        state.prototype.toString = function() {
            var strResult = 'ID: ' + this.getIdentity() + '\n';
            k.utils.obj.each(this._items, function (item)
            {
                strResult += item.toString() + '\n';
            });
            
            strResult += '\nTRANSITIONS:\n';
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
        
        /* @function Returns the string ID of the current state
         * @returns {String} ID  */
        state.prototype.getIdentity = function() {
            if (!this._id) {
                this._id = this._generateIdentity();
            }
            return this._id;
        };
        
        /* @function Generates an ID that identify this state from any other state
         * @returns {String} Generated ID  */
        state.prototype._generateIdentity = function() {
            
            if (this._items.length === 1 && this._items[0].rule.name === k.data.Grammar.constants.AugmentedRuleName && this._items[0].dotLocation === 2)
            {
                return 'AcceptanceState';
            }
        
            return k.utils.obj.reduce(
                k.utils.obj.sortBy(this._items, function(item) 
                {
                    return item.rule.index;
                }),
                function (acc, item) {
                    return acc + item.rule.index + '(' + item.dotLocation + ')';
                }, '');
        };

        /* @function Returns a copy the items contained in the current state )
         * @returns {[ItemRule]} Array of cloned item rules  */
        state.prototype.getItems = function() {
            return k.utils.obj.map(this._items, function(item) {
                return item.clone();
            });
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

        /* @function Add a new transaction into the list of transactions of the current state
         * @param {Symbol} symbol Symbol use to make the transition, like the name of the transition
         * @param {State} state Destination state arrived when moving with the specified tranisiotn
         * @returns {Void}  */
        state.prototype.addTransition = function(symbol, state) {
            this.transitions.push({
                symbol: symbol,
                state: state
            });
        };
        
        /* @function Determine if the current state is valid or not.
         * @returns {Boolean} true if the state is valid (invalid), false otherwise (inconsistent) */
        state.prototype.isValid = function() {
            //TODO TEST THIS
            //TODO Take into account when the state have items WITH LOOK-AHEAD!!
            
            var reduceItems = k.utils.obj.filter(this._items, function (item) {
                return item.isReduce();
            });
            
            if (reduceItems.length !== this._items.length && reduceItems.length > 0 || reduceItems.length > 1)
            {
                // // TODO THINK THIS, probably shift item wont have look-ahead!
                // // Check if the items have look-ahead or not
                // // we just validate the first reduce item to see if this item rules have look-ahead
                // if (reduceItems[0].lookAhead.length > 0)
                // {
                //     //TODO
                // }
                return false;
            }
            
            return true;
        };

        return state;
    })();

    k.data = k.utils.obj.extend(k.data || {}, {
        State: State
    });

    return k;
});
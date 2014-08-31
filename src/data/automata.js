define(['../utils/obj', './state'], function(k)
{
	'use strict';

    /* Automata
    * @class
    * @classdesc This class reprensent an automata, whith all its state and transitions */
    var Automata = (function()
    {
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
			k.utils.obj.defineProperty(this, 'hasLookAhead');
			//Determines if the current autamata has or not lookAhead. This is set by the automata Generator
			
			k.utils.obj.defineProperty(this, '_index');
			k.utils.obj.defineProperty(this, '_registerStates');

            this.states = options.states || [];
            this._index = 0; //Index used to traversal the states of the current instance
            this._registerStates = k.utils.obj.groupBy(this.states, function (state) {return state.getIdentity();});
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
            return this._index < this.states.length ? this.states[this._index++] : null;
        };
        
        /* @function Function used to check if an automamta is valid.
        * Commonly used to check if an automata is an LR(0) valid one.
        * @param {Boolean} options.considerLookAhead Indicate if the validation process should take into account lookAhead values in the rule items. This values is passed in to each state.
        * @param {[ConflictResovler]} options.conflicResolvers List of conflict resolvers used by the states in conflict.
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
            }
            else if (this.hasLookAhead)
            {
                //When the states are the same in rules but its only difference is in its the look aheads, as a easy-to-implement a LALR(1) parser, we merge this look-aheads
                var currentState = this._registerStates[newState.getIdentity()];
                k.utils.obj.each(currentState.getOriginalItems(), function (originalItemRule)
                {
                    var newItemRule = newState.getOriginalItemById(originalItemRule.getIdentity());
                    originalItemRule.lookAhead = k.utils.obj.uniq(originalItemRule.lookAhead.concat(newItemRule.lookAhead), function (item) { return item.name;});
                });
            }
            return this._registerStates[newState.getIdentity()];
        };

        return automata;
    })();

    k.data = k.utils.obj.extend(k.data || {}, {
        Automata: Automata
	});

	return k;
});
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
        */
        var automata = function (options)
        {
			this.options = options;

			k.utils.obj.defineProperty(this, 'states');
			k.utils.obj.defineProperty(this, 'initialState');
			k.utils.obj.defineProperty(this, 'hasLookAhead'); //In case the generate Automata is not LR(0) valid, it is extended to be LALR(1) which means add look-ahead
			
			k.utils.obj.defineProperty(this, '_index');
			k.utils.obj.defineProperty(this, '_registerStates');

            this.states = options.states || [];
            this._index = 0; //Index used to traversal the states of the current instance
            this._registerStates = k.utils.obj.groupBy(this.states, function (state) {return state.getIdentity();});
            // k.utils.obj.each(this.states, function(state)
            // {
            //     this._registerStates[state.getIdentity()] = state;
            // }, this);
        };

        /* @function Convert the current automata to its string representation
        * @returns {String} formatted string */
        automata.prototype.toString = function () {

			var result = '';
            k.utils.obj.each(this.states, function (state)
            {
				result += state.toString() + '\n';
            });

            return result;
        };

        /* @function Get the next unprocessed state
        * @returns {State} A State not processed yet if any or null otherwise */
        automata.prototype.getNextState = function()
        {
            return this._index < this.states.length ? this.states[this._index++] : null;
        };
        
        /* @function Function used to check if an automamta is valid.
        * Commonly used to check if an automata is an LR(0) valid one.
        * @returns {Boolean} true in case th automata is valid, false otherwise */
        automata.prototype.isValid = function()
        {
            return !k.utils.obj.any(this.states, function (state)
            {
                return !state.isValid();
            });
        };
        
        /* @function Set or get the initial state.
        * @param {State} state If specified set the initial state of the automata
        * @returns {State} In case that none state is specifed returnes the initial state previously set */
        automata.prototype.initialStateAccessor = function(state)
        {
            if (!state) {
                return this.initialState;
            }
            this.initialState = state;
        };

        /* @function Add a new state into the automata controlling if it is duplicated or not
        * @param {State} state State to add
        * @returns {State} The added state, if the state is duplicated returns the already created state */
        automata.prototype.addState = function(state)
        {
            if (!this._registerStates[state.getIdentity()])
            {
                this._registerStates[state.getIdentity()] = state;
                this.states.push(state);
                return state;
            }
            return this._registerStates[state.getIdentity()];
        };

        return automata;
    })();

    k.data = k.utils.obj.extend(k.data || {}, {
        Automata: Automata
	});

	return k;
});
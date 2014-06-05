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
        */
        var automata = function (options)
        {
			this.options = options;

			k.utils.obj.defineProperty(this, 'states');

            this.states = options.states || [];
            this._index = 0; //Index used to traversal the states of the current instance
            this._registerStates = {};

            for (var i = 0; i < this.states.length; i++) {
                this._registerStates[this.states[i].getIdentity()] = this.states[i];
            }
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
        * @returns {State} A State not processed yet */
        automata.prototype.getNextState = function()
        {
            return this._index < this.states.length ? this.states[this._index++] : null;
        };
        
        /* @function Functions used to check if an automamta is valid.
        * Commonly used to check if an automata is an LR(0) valid one.
        * @param {Automata} automata Automatma to be checked
        * @returns {Boolean} true in case th automata is valid, false otherwise */
        automata.prototype.isValid = function()
        {
            return !k.utils.obj.any(this.states, function (state)
            {
                return state.isInconsistent();
            });
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
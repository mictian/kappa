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
            this.states = options.states || [];
            this.index = 0; //Index used to traversal the state of the current instance
            this._registerStates = {};

            for (var i = 0; i < this.states.length; i++) {
                this._registerStates[this.states[i].getIdentity()] = this.states[i];
            }
        };

        /** @function Convert the current automata to its string representation
        * @returns formatted string */
        automata.prototype.toString = function () {
            //TODO DO THIS!!!!!
        };

        /** @function Get the next unprocessed state
        * @returns A State not processed yet */
        automata.prototype.getNextState = function() {
            if (this.index < this.states.length)
            {
                return this.states[this.index++];
            }

            return null;
        };

        /** @function Add a new state into the automata controlling if it is duplicated or not
        * @param {State} state State to add
        * @returns The added state, if the state is duplicated returns the already created state */
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
/* Automata
* @class
* @classdesc This class reprensent an automata, whith all its state and transitions */
k.data.Automata = (function() {
	'use strict';
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
		//Determines if the current autamata has or not lookAhead. This is set by the automata Generator
		k.utils.obj.defineProperty(this, 'hasLookAhead');


		k.utils.obj.defineProperty(this, '_index');
		k.utils.obj.defineProperty(this, '_unprocessedStates');
		k.utils.obj.defineProperty(this, '_registerStates');

		this.states = options.states || [];
		this._unprocessedStates = [];
		this._index = 0; //Index used to traversal the states of the current instance
		this._registerStates = k.utils.obj.groupBy(this.states, function (state) {return state.getIdentity();});

		if (this.states.length)
		{
			this._unprocessedStates = [].concat(this.states);
		}
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
		return this._unprocessedStates.splice(0,1)[0];
		//this._index < this.states.length ? this.states[this._index++] : null;
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
			this._unprocessedStates.push(newState);
		}
		else if (this.hasLookAhead)
		{
			//When the states are the same in rules but its only difference is in its the look aheads, as a easy-to-implement a LALR(1) parser, we merge this look-aheads
			var currentState = this._registerStates[newState.getIdentity()],
				currentStateHasChange = false;

			k.utils.obj.each(currentState.getOriginalItems(), function (originalItemRule)
			{
				var newItemRule = newState.getOriginalItemById(originalItemRule.getIdentity()),
					originalItemRuleLookAheadLength = originalItemRule.lookAhead.length;

				originalItemRule.lookAhead = k.utils.obj.uniq(originalItemRule.lookAhead.concat(newItemRule.lookAhead), function (item) { return item.name;});

				if (!currentStateHasChange && originalItemRuleLookAheadLength !== originalItemRule.lookAhead.length)
				{
					currentStateHasChange = true;
				}
			});

			if (currentStateHasChange)
			{
				var isCurrentStateAlreadyUnProcessed = k.utils.obj.find(this._unprocessedStates, function (unprocessedState)
				{
					return currentState.getIdentity() === unprocessedState.getIdentity();
				});

				if (!isCurrentStateAlreadyUnProcessed)
				{
					this._unprocessedStates.push(currentState);
				}
			}
		}
		return this._registerStates[newState.getIdentity()];
	};

	return automata;
})();

/* State
 * @class
 * @classdesc This class reprensent an automata state, a sub-type of a generic Node */
k.data.State = (function(_super)
{
	'use strict';
	/* jshint latedef:false */
	k.utils.obj.inherit(state, _super);

	/*
	 * Constructor Automata State
	 *
	 * @constructor
	 * @param {[ItemRule]} options.items Array of item rules that initialy compone this state
	 * @param {[Object]} options.transitions Array of object that initialy compone this node
	 * @param {[Node]} options.nodes Array of State instances that are children of this State
	 */
	function state (options) {

		_super.apply(this, arguments);

		k.utils.obj.defineProperty(this, 'isAcceptanceState'); // This is set by the automata generator

		k.utils.obj.defineProperty(this, '_items');
		k.utils.obj.defineProperty(this, '_registerItems');
		k.utils.obj.defineProperty(this, '_condencedView');
		k.utils.obj.defineProperty(this, '_unprocessedItems');

		this.isAcceptanceState = false;

		this._items = options.items || [];
		this._unprocessedItems = this._items.length ? k.utils.obj.shallowClone(this._items) : [];
		options.items = null;

		this._registerItems = {};

		this._registerItemRules();
	}

	/* @method REgister the list of item rules of the current stateso they are assesible by its id
	 * @returns {Void} */
	state.prototype._registerItemRules = function ()
	{
		k.utils.obj.each(this._items, function (itemRule)
		{
			this._registerItems[itemRule.getIdentity()] = itemRule;
		}, this);
	};

	state.constants = {
		AcceptanceStateName: 'AcceptanceState'
	};

	/* @method Get the next unprocessed item rule
	 * @returns {ItemRule} Next Item Rule */
	state.prototype.getNextItem = function() {
		return this._unprocessedItems.splice(0,1)[0];
	};

	/* @method Adds an array of item rule into the state. Only the rules that are not already present in the state will be added
	 * @param {[ItemRule]} itemRules Array of item rules to add into the state
	 * @param {Boolean} options.notMergeLookAhead If specified as true does not marge the lookAhead of the already existing items. Default: falsy
	 * @returns {void} Nothing */
	state.prototype.addItems = function(itemRules, options) {

		this._id = null;
		k.utils.obj.each(itemRules, function (itemRule)
		{
			// The same item rule can be added more than once if the grammar has loops.
			// For sample: (1)S -> A *EXPS B      (2)EXPS -> *EXPS
			if (!this._registerItems[itemRule.getIdentity()])
			{
				this._registerItems[itemRule.getIdentity()] = itemRule;
				this._items.push(itemRule);
				this._unprocessedItems.push(itemRule);
			}
			else if (!options || !options.notMergeLookAhead)
			{
				//As a way of generating a LALR(1) automata adds a item rule for each lookAhead we simply merge its lookAheads
				var original_itemRule = this._registerItems[itemRule.getIdentity()];

				if (itemRule.lookAhead && itemRule.lookAhead.length)
				{
					original_itemRule.lookAhead = original_itemRule.lookAhead || [];
					itemRule.lookAhead = itemRule.lookAhead || [];

					var mergedLookAheads = original_itemRule.lookAhead.concat(itemRule.lookAhead),
						original_itemRule_lookAhead_length = this._registerItems[itemRule.getIdentity()].lookAhead.length;

					this._registerItems[itemRule.getIdentity()].lookAhead = k.utils.obj.uniq(mergedLookAheads, function (item) { return item.name;});

					var is_item_already_queued = k.utils.obj.filter(this._unprocessedItems, function (unprocessed_item)
					{
						return unprocessed_item.getIdentity() === itemRule.getIdentity();
					}).length > 0;

					//If there were changes in the lookAhead and the rule is not already queued.
					if (original_itemRule_lookAhead_length !== this._registerItems[itemRule.getIdentity()].lookAhead.length && !is_item_already_queued)
					{
						this._unprocessedItems.push(itemRule);
					}
				}
			}
		}, this);
	};

	/* @method Convert the current state to its string representation
	 * @returns {String} formatted string */
	state.prototype.toString = function() {
		var strResult = 'ID: ' + this.getIdentity() + '\n' +
						this._items.join('\n') +
						'\nTRANSITIONS:\n';

		k.utils.obj.each(this.transitions, function (transition)
		{
			strResult += '*--' + transition.symbol + '-->' + transition.state.getIdentity() + '\n';
		});
		return strResult;
	};

	/* @method Returns the condenced (one line) string that reprenset the current 'state' of the current state
	 * @returns {String} State Representation in one line  */
	state.prototype.getCondencedString = function() {
		if(!this._condencedView)
		{
			this._condencedView = this._generateCondencedString();
		}
		return this._condencedView;
	};

	/* @method Internal method to generate a condenced (one line) string that reprenset the current 'state' of the current state
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

	/* @method Generates an ID that identify this state from any other state
	 * @returns {String} Generated ID  */
	state.prototype._generateIdentity = function() {

		if (this.isAcceptanceState)
		{
			return state.constants.AcceptanceStateName;
		}
		else if (!this._items.length)
		{
			return _super.prototype._generateIdentity.apply(this, arguments);
		}

		return k.utils.obj.reduce(
			k.utils.obj.sortBy(this._items, function(item)
			{
				return item.rule.index;
			}),
			function (acc, item) {
				return acc + item.getIdentity(); //.rule.index + '(' + item.dotLocation + ')';
			}, '');
	};

	/* @method Returns a copy the items contained in the current state
	 * @returns {[ItemRule]} Array of cloned item rules  */
	state.prototype.getItems = function() {
		return k.utils.obj.map(this._items, function(item) {
			return item.clone();
		});
	};

	/* @method Returns an orignal item rule based on its id.
		This method is intended to be use as READ-ONLY, editing the returned items will affect the state and the rest of the automata at with this state belongs to.
	 * @returns {[ItemRule]} Array of current item rules  */
	state.prototype.getOriginalItems = function() {
		return this._items;
	};

	/* @method Returns an orignal item rule based on its id.
		This method is intended to be use as READ-ONLY, editing the returned items will affect the state and the rest of the automata at with this state belongs to.
	 * @returns {ItemRule} Item rule corresponding to the id passed in if present or null otherwise  */
	state.prototype.getOriginalItemById = function(id) {
		return this._registerItems[id];
	};

	/** @method Get the list of all supported symbol which are valid to generata transition from the current state.
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

	/* @method Responsible of new transitions. We override this method to use the correct variable names and be more meanful
	 * @param {Symbol} symbol Symbol use to make the transition, like the name of the transition
	 * @param {State} state Destination state arrived when moving with the specified tranisiotn
	 * @returns {Object} Transition object  */
	state.prototype._generateNewTransition = function (symbol, state) {
		return {
			symbol: symbol,
			state: state
		};
	};

	/* @method Returns the list of item rules contained in the current state that are reduce item rules.
	 * @returns {[ItemRule]} Recude Item Rules  */
	state.prototype.getRecudeItems = function () {
		return k.utils.obj.filter(this._items, function (item) {
			return item.isReduce();
		});
	};

	return state;
})(k.data.Node);
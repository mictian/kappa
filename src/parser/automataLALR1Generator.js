/* Automata Generator
* @class
* @classdesc This class is reponsible for given a grammar create a new LR(0) automata */
k.parser.AutomataLALR1Generator = (function(_super)
{
	'use strict';
	/* jshint latedef:false */
	k.utils.obj.inherit(automataLALR1Generator, _super);

	/*
	* Initialize a new Automaton Generator
	*
	* @constructor
	* @param {Grammar} options.grammar Grammar used to generate the automata
	*/
	function automataLALR1Generator (options)
	{
		_super.apply(this, arguments);
	}

	/* @function Override super method to return the list of item rules that has as its head the current symbol, TAKING into account the lookAhead
	* @param {ItemRule} currentItem The current item rule from which the new item rule are being generated.
	* @param {Symbol} currentSymbol Is the symbol used to find new item rules.
	* @returns {[ItemRule]} Array of item rule ready to be part of the current processing state */
	automataLALR1Generator.prototype._newItemRulesForStateExpansion = function (currentItem, currentSymbol)
	{
		var lookAhead = this._getFirstSet(currentItem);
		return k.data.ItemRule.newFromRules(this.grammar.getRulesFromNonTerminal(currentSymbol), lookAhead);
	};

	// /* @function Override super method to return the object require to indicate that new item rules added into a state should take into account the lookAhead
	// * @returns {Object} Object used by State.addItemRules indicating to DO use lookAhead to merge new items */
	// automataLALR1Generator.prototype._getExpansionItemNewItemsOptions = function ()
	// {
	// 	return {
	// 		hasLookAhead: true
	// 	};
	// };

	/* @function Gets the array of look-ahead for the particular item rule taking into account the dot location fo the specified item rule.
	* @param {ItemRule} itemRule Item rule to find FIRST Set
	* @returns {[Terminals]} First set for specified look ahead */
	automataLALR1Generator.prototype._getFirstSet = function (itemRule)
	{
		var symbolsToTraverse = itemRule.rule.tail.slice(itemRule.dotLocation + 1),
			requestedFirstSet = [];

		symbolsToTraverse = symbolsToTraverse.concat(itemRule.lookAhead);

		k.utils.obj.find(symbolsToTraverse, function (symbolTraversed)
		{
			if (symbolTraversed instanceof k.data.NonTerminal)
			{
				requestedFirstSet = requestedFirstSet.concat(this.grammar.firstSetsByHeader[symbolTraversed.name]);
				requestedFirstSet = k.utils.obj.uniq(requestedFirstSet, false, function (item) {return item.name;});
				return !symbolTraversed.isNullable;
			}
			else if (symbolTraversed instanceof k.data.Terminal)
			{
				requestedFirstSet.push(symbolTraversed);
				return true;
			}
			else if (symbolTraversed.isSpecial && symbolTraversed.name === k.data.specialSymbol.EOF)
			{
				requestedFirstSet.push(symbolTraversed);
				return true;
			}
			else
			{
				throw new Error('Invalid Item Rule. Impossible calculate first set. Item Rule: ' + itemRule.toString());
			}

		}, this);

		return requestedFirstSet;
	};

	/* @function Generate the construction object used to initialize the new automata. Override the super method to indicate that te automata should DO use lookahead
	* @param {State} initialState State that only contains the items rules from the start symbol of the grammar. This is the initial state before being expanded.
	* @returns {Object} Object containing all the options used to create the new automata */
	automataLALR1Generator.prototype._getNewAutomataOptions = function ()
	{
		var result = _super.prototype._getNewAutomataOptions.apply(this, arguments);
		result.hasLookAhead = true;

		return result;
	};

	/* @function Override super method to return the list of item rules that has as its head the start symbol of the grammar, TAKING into account the lookAhead
	* @returns {[ItemRule]} The initial list of item rule. */
	automataLALR1Generator.prototype._getInitialStateItemRules = function ()
	{
		return [new k.data.ItemRule({
					rule: this.grammar.getRulesFromNonTerminal(this.grammar.startSymbol)[0],
					lookAhead: [new k.data.Symbol({name: k.data.specialSymbol.EOF, isSpecial: true})]
				})];
	};

	/* @function Given an automata returnes its ACTION Table.
	* @param {Automata} automata Automatma used as a base of the calculation
	* @returns {Function} Function that given the a state id and a lookAhead returns the action to take */
	automataLALR1Generator.prototype.generateACTIONTable = function (automata, options)
	{
		var table = {};

		k.utils.obj.each(automata.states, function (state)
		{
			table[state.getIdentity()] = {};

			if (state.isAcceptanceState)
			{
				table[state.getIdentity()][k.data.specialSymbol.EOF] = {
					action: k.parser.tableAction.ACCEPT,
					rule: state.getOriginalItems()[0].rule //As we augment the grammar in the acceptance state is should be only one rule, the augmented rule, for that reason is the 0
				};
			}
			else
			{
				var defaultActionTableStateOptions = {
					ignoreErrors: false,
					considerLookAhead: true
				};
				options = k.utils.obj.extendInNew(defaultActionTableStateOptions, options || {});

				var stateItems = this.getShiftReduceItemRuleFromState(state, options);

				if (!stateItems)
				{
					throw new Error('Impossible to generate Action Table. The following state is invalid. State: ' + state.getIdentity());
				}


				//Shift Items
				k.utils.obj.each(stateItems.shiftItems, function (shiftItem)
				{
					table[state.getIdentity()][shiftItem.getCurrentSymbol().name] = {
						action: k.parser.tableAction.SHIFT
					};
				});

				//Reduce Items
				//IMPORTANT: At this point the automata MUST be already validated, ensuring us that the lookAhead sets ARE DISJOINT
				k.utils.obj.each(stateItems.reduceItems, function (reduceItemRule)
				{
					k.utils.obj.each(reduceItemRule.lookAhead, function (reduceSymbol)
					{
						table[state.getIdentity()][reduceSymbol.name] = {
							action: k.parser.tableAction.REDUCE,
							rule: reduceItemRule.rule
						};
					});
				});
			}
		}, this);


		return (function (actionTable)
		{
			return function (currentStateId, look_ahead)
			{
				return (actionTable[currentStateId] && look_ahead && look_ahead.name && actionTable[currentStateId][look_ahead.name] ) ||
					{
						action: k.parser.tableAction.ERROR
					};

			};
		})(table);
	};

	/* @function  Override super method to determine if the current state is valid or not.
	 * @param {Boolean} options.considerLookAhead Indicate if the state should take into account look ahead to validate. Default: false
	 * @param {Automata} options.automata Optional automata instance used to pass to the conflict resolver in case there are conflict and resolvers.
	 * @param {[ConflictResolver]} options.conflictResolvers List of conflict resolvers used to resolve possible conflict at the current state.
	 * @returns {Boolean} true if the state is valid (invalid), false otherwise (inconsistent) */
	automataLALR1Generator.prototype.isStateValid = function (state, options)
	{
		options = k.utils.obj.isObject(options) ? options : {};
		options.conflictResolvers = options.conflictResolvers || [];

		var reduceItems = state.getRecudeItems(),
			isTheConflictResolvableWithResolvers = false;

		var shiftItems = k.utils.obj.filter(state.getOriginalItems(), function (item)
			{
				return !item.isReduce();
			});

		//Check for SHIFT/REDUCE Conflicts
		if (shiftItems.length && reduceItems.length)
		{
			var shiftReduceResolvers = k.utils.obj.sortBy(k.utils.obj.filter(options.conflictResolvers, function (resolver)
			{
				return resolver.type === k.parser.conflictResolverType.STATE_SHIFTREDUCE;
			}), 'order');

			//Generla Idea: For each shift item rule validate that the shift symbol is not in any lookAhead symbol of any reduce rule

			//For each shift item
			var isAnyShiftReduceConflict = k.utils.obj.any(shiftItems, function (shiftItem)
			{
				//get the shift symbol
				var shiftSymbol = shiftItem.getCurrentSymbol();

				//find among all reduce items
				return k.utils.obj.find(reduceItems, function (reduceItem)
				{
					//if the shift symbol is in any reduce item rule's lookAhead set.

					var isShiftSymbolInReduceLookAhead = k.utils.obj.find(reduceItem.lookAhead, function (lookAheadSymbol) { return lookAheadSymbol.name === shiftSymbol.name;});
					if (isShiftSymbolInReduceLookAhead)
					{
						isTheConflictResolvableWithResolvers = k.utils.obj.find(shiftReduceResolvers, function (resolver)
						{
							return resolver.resolve(options.automata, state, shiftItem, reduceItem);
						});

						return !isTheConflictResolvableWithResolvers;
					}

					return false;
				});
			});

			if (isAnyShiftReduceConflict)
			{
				return false;
			}
		}

		//Check for REDUCE/REDUCE Conflicts
		if (reduceItems.length > 1)
		{
			var reduceReduceResolvers = k.utils.obj.sortBy(k.utils.obj.filter(options.conflictResolvers, function (resolver)
				{
					return resolver.type === k.parser.conflictResolverType.STATE_REDUCEREDUCE;
				}), 'order');

			//General Idea: For each reduce rule, validate that its look Ahead set is disjoin with the rest of the reduce rule

			//for each reduce rule
			var isAnyReduceReduceConflict = k.utils.obj.any(reduceItems, function (reduceItemSelected)
			{
				//compare it with each of the other reduce rules
				return k.utils.obj.find(reduceItems, function (reduceItemInspected)
				{
					if (reduceItemInspected.getIdentity() === reduceItemSelected.getIdentity())
					{
						return false;
					}

					//and for each look ahead symbol of the first reduce rule, validate the it is not present in any other look Ahead
					var isLookAheadSymbolInOtherLookAheadSet = k.utils.obj.find(reduceItemSelected.lookAhead, function (lookAheadSelected)
					{
						return k.utils.obj.find(reduceItemInspected.lookAhead, function (lookAheadSymbol) { return lookAheadSymbol.name === lookAheadSelected.name;});
					});

					if (isLookAheadSymbolInOtherLookAheadSet)
					{
						isTheConflictResolvableWithResolvers = k.utils.obj.find(reduceReduceResolvers, function (resolver)
						{
							return resolver.resolve(options.automata, state, reduceItemSelected, reduceItemInspected);
						});

						return !isTheConflictResolvableWithResolvers;
					}

					return false;
				});

			});

			if (isAnyReduceReduceConflict)
			{
				return false;
			}
		}

		return true;
	};

	/* @function Generates the list of shift and reduce items that take part from the passed in state. Validating at the same time that none of these items are in conflict
		or that the conflicts are solvable.
	 * @param {State} state State to extract form each of the reduce/shift item rules
	 * @param {Boolean} options.considerLookAhead Indicate if the state should take into account look ahead to validate. If not the state will validate and generate the result as in a LR(0). Default: false
	 * @param {Automata} options.automata Optional automata instance used to pass to the conflict resolver in case there are conflict and resolvers.
	 * @param {[ConflictResolver]} options.conflictResolvers List of conflict resolvers used to resolve possible conflict at the current state.
	 * @param {Boolean} options.ignoreErrors Indicate if when facing an error (a conflict that can not be solve by any resolver) continue the execution. Default: false
	 * @returns {Object} An object containg two properties (arrays) shiftItems and reduceItems */
	automataLALR1Generator.prototype.getShiftReduceItemRuleFromState = function (state, options)
	{
		options = k.utils.obj.isObject(options) ? options : {};
		options.conflictResolvers = options.conflictResolvers || [];

		var reduceItems = state.getRecudeItems(),
			shiftItems = k.utils.obj.filter(state.getOriginalItems(), function (item)
			{
				return !item.isReduce();
			}),
			ignoreErrors = !!options.ignoreErrors,
			result = {shiftItems:[], reduceItems:[]},
			isTheConflictResolvableWithResolvers = false;

		//We clone the reduce item, becuase when there is a Shift/Reduce conflic and the solution is shift, we need to remove the shift symbol from the lookAhead set of the reduce item!
		//Otherwise when createion the Action table the reduce item end it up overriding the shift actions! (see automataLALRGenerator)
		reduceItems = k.utils.obj.map(reduceItems, function (reduceItem)
		{
			return reduceItem.clone();
		});

		//Process all SHIFT items & Check for SHIFT/REDUCE Conflicts
		if (shiftItems.length)
		{
			var shiftReduceResolvers = k.utils.obj.sortBy(k.utils.obj.filter(options.conflictResolvers, function (resolver)
			{
				return resolver.type === k.parser.conflictResolverType.STATE_SHIFTREDUCE;
			}), 'order');

			//Generla Idea: For each shift item rule validate that the shift symbol is not in any lookAhead symbol of any reduce rule

			//For each shift item
			var isAnyShiftReduceConflict = k.utils.obj.any(shiftItems, function (shiftItem)
			{
				//get the shift symbol
				var shiftSymbol = shiftItem.getCurrentSymbol();

				//find among all reduce items
				var isShiftItemInConflict = k.utils.obj.find(reduceItems, function (reduceItem)
				{
					//if the shift symbol is in any reduce item rule's lookAhead set.
					//NOTE: Here we obtain the lookAhead Symbol that is in conflict, if any.
					var isShiftSymbolInReduceLookAhead = k.utils.obj.find(reduceItem.lookAhead, function (lookAheadSymbol) { return lookAheadSymbol.name === shiftSymbol.name;});

					//if there is a possible shift/reduce conflict try to solve it by usign the resolvers list
					if (isShiftSymbolInReduceLookAhead)
					{
						var conflictSolutionFound;
						isTheConflictResolvableWithResolvers = k.utils.obj.find(shiftReduceResolvers, function (resolver)
						{
							conflictSolutionFound = resolver.resolve(options.automata, state, shiftItem, reduceItem);
							return conflictSolutionFound;
						});

						//If the conflict is resolvable, and the action to be taken is SHIFT, we remove the Shift symbol from the reduce item lookAhead, so when creating the Action table
						//that symbol wont take part of the table.
						if (isTheConflictResolvableWithResolvers && conflictSolutionFound.action === k.parser.tableAction.SHIFT)
						{
							var symbolIndexToRemove = k.utils.obj.indexOf(reduceItem.lookAhead, isShiftSymbolInReduceLookAhead);
							reduceItem.lookAhead.splice(symbolIndexToRemove,1);
						}

						return !isTheConflictResolvableWithResolvers;
					}

					return false;
				});

				if (!isShiftItemInConflict || ignoreErrors)
				{
					result.shiftItems.push(shiftItem);
					return false;
				}

				return true;

			});

			if (isAnyShiftReduceConflict)
			{
				return false;
			}
		}

		//Process all REDUCE items & Check for REDUCE/REDUCE Conflicts
		if (reduceItems.length)
		{
			var reduceReduceResolvers = k.utils.obj.sortBy(k.utils.obj.filter(options.conflictResolvers, function (resolver)
				{
					return resolver.type === k.parser.conflictResolverType.STATE_REDUCEREDUCE;
				}), 'order');

			//General Idea: For each reduce rule, validate that its look Ahead set is disjoin with the rest of the reduce rule

			//for each reduce rule
			var isAnyReduceReduceConflict = k.utils.obj.any(reduceItems, function (reduceItemSelected)
			{
				//compare it with each of the other reduce rules
				var isReduceItemInConflict = k.utils.obj.find(reduceItems, function (reduceItemInspected)
				{
					if (reduceItemInspected.getIdentity() === reduceItemSelected.getIdentity())
					{
						return false;
					}

					//and for each look ahead symbol of the first reduce rule, validate the it is not present in any other look Ahead
					var isLookAheadSymbolInOtherLookAheadSet = k.utils.obj.find(reduceItemSelected.lookAhead, function (lookAheadSelected)
					{
						return k.utils.obj.find(reduceItemInspected.lookAhead, function (lookAheadSymbol) { return lookAheadSymbol.name === lookAheadSelected.name;});
					});

					if (isLookAheadSymbolInOtherLookAheadSet)
					{
						isTheConflictResolvableWithResolvers = k.utils.obj.find(reduceReduceResolvers, function (resolver)
						{
							return resolver.resolve(options.automata, state, reduceItemSelected, reduceItemInspected);
						});

						return !isTheConflictResolvableWithResolvers;
					}

					return false;
				});

				if (!isReduceItemInConflict || ignoreErrors)
				{
					result.reduceItems.push(reduceItemSelected);
					return false;
				}
				return true;
			});

			if (isAnyReduceReduceConflict)
			{
				return false;
			}
		}

		return result;
	};

	return automataLALR1Generator;
})(k.parser.AutomataLRGeneratorBase);

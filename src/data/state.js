define(['../utils/obj', './node', './grammar', '../parser/conflictResolver'], function(k) {
    
    'use strict';

    /* State
     * @class
     * @classdesc This class reprensent an automata state, a sub-type of a generic Node */
    var State = (function(_super)
    {
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
            k.utils.obj.defineProperty(this, '_index');
            k.utils.obj.defineProperty(this, '_condencedView');

            this.isAcceptanceState = false;
            
            this._items = options.items || [];
            options.items = null;
            this._index = 0;
            this._registerItems = {};

            this._registerItemRules();
        }
        
        /* @function REgister the list of item rules of the current stateso they are assesible by its id
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

        /* @function Get the next unprocessed item rule
         * @returns {ItemRule} Next Item Rule */
        state.prototype.getNextItem = function() {
            return this._index < this._items.length ? this._items[this._index++] : null;
        };

        /* @function Adds an array of item rule into the state. Only the rules that are not already present in the state will be added
         * @param {[ItemRule]} itemRules Array of item rules to add into the state
         * @param {Boolean} options.hasLookAhead Determines if the adding action should take into account lookAhead (to merge them) when the item rule are already present
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
                }
                else if (options && options.hasLookAhead)
                {
                    //As the way to of generating a LR(1) automata adds a item rule for each lookAhead we simply merge its lookAheads
                    var mergedLookAheads = this._registerItems[itemRule.getIdentity()].lookAhead.concat(itemRule.lookAhead);
                    this._registerItems[itemRule.getIdentity()].lookAhead = k.utils.obj.uniq(mergedLookAheads, function (item) { return item.name;});
                }
            }, this);
        };

        /* @function Convert the current state to its string representation
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
        
        /* @function Generates an ID that identify this state from any other state
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

        /* @function Returns a copy the items contained in the current state
         * @returns {[ItemRule]} Array of cloned item rules  */
        state.prototype.getItems = function() {
            return k.utils.obj.map(this._items, function(item) {
                return item.clone();
            });
        };
        
        /* @function Returns an orignal item rule based on its id.
            This method is intended to be use as READ-ONLY, editing the returned items will affect the state and the rest of the automata at with this state belongs to.
         * @returns {[ItemRule]} Array of current item rules  */
        state.prototype.getOriginalItems = function() {
            return this._items;
        };
        
        /* @function Returns an orignal item rule based on its id.
            This method is intended to be use as READ-ONLY, editing the returned items will affect the state and the rest of the automata at with this state belongs to.
         * @returns {ItemRule} Item rule corresponding to the id passed in if present or null otherwise  */
        state.prototype.getOriginalItemById = function(id) {
            return this._registerItems[id];
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

        /* @function Responsible of new transitions. We override this method to use the correct variable names and be more meanful
         * @param {Symbol} symbol Symbol use to make the transition, like the name of the transition
         * @param {State} state Destination state arrived when moving with the specified tranisiotn
         * @returns {Object} Transition object  */
        state.prototype._generateNewTransition = function (symbol, state) {
            return {
                symbol: symbol,
                state: state
            };
        };
        
        /* @function Returns the list of item rules contained in the current state that are reduce item rules.
         * @returns {[ItemRule]} Recude Item Rules  */
        state.prototype.getRecudeItems = function () {
            return k.utils.obj.filter(this._items, function (item) {
                return item.isReduce();
            });   
        };
        
        /* @function Determine if the current state is valid or not.
         * @param {Boolean} options.considerLookAhead Indicate if the state should take into account look ahead to validate. Default: false
         * @param {Automata} options.automata Optional automata instance used to pass to the conflict resolver in case there are conflict and resolvers.
         * @param {[ConflictResolver]} options.conflictResolvers List of conflict resolvers used to resolve possible conflict at the current state.
         * @returns {Boolean} true if the state is valid (invalid), false otherwise (inconsistent) */
        state.prototype.isValid = function(options) {
            //NOTE: Important! When usign this method for LR(0) without taking into account lookAhead, the current implementation DOES NOT USE RESOLVERS IN THIS CASE! it just return false if invalid
            options = k.utils.obj.isObject(options) ? options : {};
            options.conflictResolvers = options.conflictResolvers || [];
            
            var reduceItems = this.getRecudeItems(),
                self = this,
                isTheConflictResolvableWithResolvers = false;
            
            if (!options.considerLookAhead || !reduceItems.length)
            {
                return !(reduceItems.length !== this._items.length && reduceItems.length > 0 || reduceItems.length > 1);
            }
            
            var shiftItems = k.utils.obj.filter(this._items, function (item)
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
                                return resolver.resolve(options.automata, self, shiftItem, reduceItem);
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
                                return resolver.resolve(options.automata, self, reduceItemSelected, reduceItemInspected);
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
        
        /* @function Generates the list of shift and reduce items that take part iin the current state. Validating at the same time that none of these items are in conflict
            or that the conflicts are solvable.
         * @param {Boolean} options.considerLookAhead Indicate if the state should take into account look ahead to validate. If not the state will validate and generate the result as in a LR(0). Default: false
         * @param {Automata} options.automata Optional automata instance used to pass to the conflict resolver in case there are conflict and resolvers.
         * @param {[ConflictResolver]} options.conflictResolvers List of conflict resolvers used to resolve possible conflict at the current state.
         * @param {Boolean} options.ignoreErrors Indicate if when facing an error (a conflict that can not be solve by any resolver) continue the execution. Default: false
         * @returns {Object} An object containg two properties (arrays) shiftItems and reduceItems */
        state.prototype.getShiftReduceItemRule = function(options) {
            //NOTE: Important! When using this method for LR(0) without taking into account lookAhead, the current implementation DOES NOT USE RESOLVERS IN THIS CASE! it just return false if invalid
            //NOTE: Important! When using this method for LR(0) without taking into account lookAhead, the current implementation DOES NOT HONOR the ignoreErrors PROPERTY!
            options = k.utils.obj.isObject(options) ? options : {};
            options.conflictResolvers = options.conflictResolvers || [];
            
            var reduceItems = this.getRecudeItems(),
                shiftItems = k.utils.obj.filter(this._items, function (item)
                {
                    return !item.isReduce();
                }),
                self = this,
                ignoreErrors = !!options.ignoreErrors,
                result = {shiftItems:[], reduceItems:[]},
                isTheConflictResolvableWithResolvers = false;
            
            if (!options.considerLookAhead)
            {
                if (!reduceItems.length)
                {
                    result.shiftItems = shiftItems || [];
                }
                else if (!shiftItems.length && reduceItems.length === 1)
                {
                    result.reduceItems = reduceItems;
                }
                else
                {
                    return false;
                }
                
                return result;
            }
            
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
                                conflictSolutionFound = resolver.resolve(options.automata, self, shiftItem, reduceItem);
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
                                return resolver.resolve(options.automata, self, reduceItemSelected, reduceItemInspected);
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

        return state;
    })(k.data.Node);

    k.data = k.utils.obj.extend(k.data || {}, {
        State: State
    });

    return k;
});
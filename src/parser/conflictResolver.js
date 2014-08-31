define(['../utils/obj'], function(k)
{
    'use strict';
    
    /* Enum that describe valid types of conflict resolvers
	* @readonly
	* @enum {String}
	*/
    var conflictResolverType = {
        STATE_SHIFTREDUCE: 'STATE_SHIFTREDUCE',
        STATE_REDUCEREDUCE: 'STATE_REDUCEREDUCE'
    };
    
    /* State Conflict Resolver
	* @class
	* @classdesc This class is responsible for resolver conflicts at state level, for example Shift/Reduce conflicts */
    var ConflictResolver = (function ()
    {
        /*
		* Initialize a new Conflict Resolver
		*
		* @constructor
		* @param {String} options.name Uique name of the resolver.
		* @param {conflictResolverType} options.type Indicate the kind of conflict that the current resolver can handle.
		* @param {Integer} options.order Numeric values used to sort the resolver and in this way take precendence at the moment of resolve a problem. Resolvers will be sorted from lowest values to highest
		* @param {Function} options.resolveFnc function evalutad at the time of resolve a conflict
		*/
        var conflictResolver = function (options)
        {
            this.options = options;
			
			k.utils.obj.defineProperty(this, 'name');
			k.utils.obj.defineProperty(this, 'type');
			k.utils.obj.defineProperty(this, 'order');
			k.utils.obj.defineProperty(this, 'resolveFnc');
			
			this.type = this.type || conflictResolverType.STATE_SHIFTREDUCE;
        };
        
        /* @function Resolve a conflict
		* This method main idea is that sub-clases override it and implement the real logic. By defaukt it should return false.
		* @param {Automata} automata Automata containing the state tothat is being validated.
		* @param {State} state State that contains the conflict.
		* @param {ItemRule} itemRule1 In case of SHIFT/REDUCE conflict is the SHIFT item rule.
		* @param {ItemRule} itemRule2 In case of SHIFT/REDUCE conflict is the REDUCE item rule.
		* @returns {Object} This meethod will return false in there is not solution for the conflict, otherwise will return an object containing the next properties:
		        action: {tableAction} string solution, iteRule: {ItemRule} item rule that should be taken into account*/
        conflictResolver.prototype.resolve = function (automata, state, itemRule1, itemRule2)
        {
            return  k.utils.obj.isFunction(this.resolveFnc) ? this.resolveFnc(automata, state, itemRule1, itemRule2) : false;
        };
        
        /* @function Generate the default list of resolvers. These are:
            Shift/Reduce Resolver: Precendence
            Shift/Reduce Resolver: Associativity
		* @returns {[ConflictResolver]} List of the default (wide-app) Conflict Resolvers. */
        conflictResolver.getDefaultResolvers = function ()
        {
            return [
                    new ConflictResolver({
                        name: 'precedence_resolver',
                        type: conflictResolverType.STATE_SHIFTREDUCE,
                        order: 10,
                        resolveFnc: function (automata, state, itemRule1, itemRule2)
                        {
                            debugger;
                        }
                    }),
                    new ConflictResolver({
                        name: 'associativity_resolver',
                        type: conflictResolverType.STATE_SHIFTREDUCE,
                        order: 20,
                        resolveFnc: function (automata, state, itemRule1, itemRule2)
                        {
                            debugger;
                        }
                    })
                ];
        };
        
        return conflictResolver;
    })();
    
    k.parser = k.utils.obj.extend(k.parser || {}, {
        ConflictResolver: ConflictResolver,
        conflictResolverType: conflictResolverType
	});
    
    return k;
});
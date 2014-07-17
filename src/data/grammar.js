define(['../utils/obj'],  function (k)
{
	'use strict';

	/* Enum for any special Symbol
	* @readonly
	* @enum {String}
	*/
    var specialSymbol = {
        EMPTY: 'EMPTY',
        EOF : 'EOF'
    };

    /* Symbol
    * @class
    * @classdesc This class represent any simbol in the entire system */
    var Symbol = (function ()
    {
        /*
        * Creates an instance of a Symbol (This class represent non Terminals, Terminals and Special symbols)
        *
        * @constructor
        * @param {String} options.name The name or denatation of the non terminal
        * @param {Boolean} options.isSpecial Determiens if the current symbol is a secial one, like EOF. Default true
        * @param {Rule} options.rule Rule at which this particular instance of a symbol belongs to
        */
        var symbol = function (options)
        {
			this.options = options;

			k.utils.obj.defineProperty(this, 'name');
			k.utils.obj.defineProperty(this, 'isSpecial');
			k.utils.obj.defineProperty(this, 'rule');

            this.isSpecial = k.utils.obj.isBoolean(options.isSpecial) ? options.isSpecial : true;

            if (!this.name || !k.utils.obj.isString(this.name))
            {
                throw new Error('Invalid initialization values for a symbol, please provide a string name a symbol');
            }
        };
        
        /* @function Shows the symbol's name
        * @returns {String} this.name */
        symbol.prototype.toString = function() {
            return this.name.toString();
        };

        /* @function Creates a deep copy of the current instance
        * @returns {Symbol} Deep copy */
        symbol.prototype.clone = function()
        {
            var ruleAux = this.rule;
            this.rule = null;
			var cloneOptions = k.utils.obj.clone(this.options);
			this.rule = cloneOptions.rule = ruleAux;
			
			return new Symbol(cloneOptions);
        };

        return symbol;
    })();

    /* Non Terminal
    * @class
    * @classdesc Use this class to create new instance of non Termianls */
    var NonTerminal = (function(_super)
    {
        /* jshint latedef:false */
        k.utils.obj.inherit(nonTerminal, _super);

        /*
        * Creates an instance of a new Non Termianl
        *
        * @constructor
        * @param {String} options.name The name or denatation of the non terminal
        */
        function nonTerminal (options)
        {
            _super.apply(this, arguments);
            
            k.utils.obj.defineProperty(this, 'isNullable'); // Control if the current non-terminal is nullable or not, This valus is calculate by the grammar's constructor
            
            this.isNullable = false;
            this.isSpecial = false;
        }

        /* @function Creates an array os non terminals from a string that represen them
         * @param {[Array]} arr Array of string used to create new non terminals
         * @returns {[NonTerminal]} An array of new nonterminals  */
        nonTerminal.fromArray = function (arr)
        {
            if (!k.utils.obj.isArray(arr) && !k.utils.obj.isString(arr)) {
                throw new Error('Invalid parameter. To create non terminal from array the input parameter should be an array!');
            }
            var result = [];
            k.utils.obj.each(arr, function(nonTerminalName)
            {
                result[result.length] = new NonTerminal({name: nonTerminalName});
            });

            return result;
        };

        /* @function Creates a deep copy of the current instance
        * @returns {NonTerminal} Deep copy */
        nonTerminal.prototype.clone = function()
        {
            var ruleAux = this.rule;
            this.rule = null;
			var cloneOptions = k.utils.obj.clone(this.options);
			this.rule = cloneOptions.rule = ruleAux;
			
			return new NonTerminal(cloneOptions);
        };

        return nonTerminal;
    })(Symbol);

	/** Terminal
    * @class
    * @classdesc Use this class to repsent Termianls (like 'a', 'B', 'Hola', etc.) */
    var Terminal = (function(_super)
    {
        /* jshint latedef:false */
        k.utils.obj.inherit(terminal, _super);

        /*
        * Creates an instance of a new Termianl
        *
        * @constructor
        * @param {String} options.name The name or denatation of the terminal
        * @param {String|RegExp} options.body The string or regexp used to match the input tokens
        */
        function terminal (options)
        {
            if (!k.utils.obj.isString(options.body) && !k.utils.obj.isRegExp(options.body)) {
                throw new Error('Invalid Terminal Initialization. A string or regexp body must be specified');
            }
			options.name = options.name ? options.name : options.body.toString();

            _super.apply(this, arguments);

            k.utils.obj.defineProperty(this, 'body');
            k.utils.obj.defineProperty(this, 'isTerminal');

            this.isSpecial = false;
            this.isTerminal = true;
        }

        /* @function Shows the terminal's name between < and >
        * @returns {String} Fromatted string */
        terminal.prototype.toString = function()
        {
            return '<' + this.name + '>';
        };

		/* @function Creates a deep copy of the current instance
        * @returns {Terminal} Deep copy */
        terminal.prototype.clone = function()
        {
            var ruleAux = this.rule;
            this.rule = null;
			var cloneOptions = k.utils.obj.clone(this.options);
			this.rule = cloneOptions.rule = ruleAux;
			
			cloneOptions.body = k.utils.obj.isRegExp(this.body) ? new RegExp(this.body.source) : this.body;

			return new Terminal(cloneOptions);
        };

        return terminal;
    })(Symbol);

    /* Grammatical Rules
    * @class
    * @classdesc Use this class to create new instance of non Termianls */
    var Rule = (function()
    {
        /*
        * Initialize a new Grammatical Rule
        *
        * @constructor
        * @param {NonTerminal} options.head The name or denatation of the non terminal
        * @param {[Terminal|NonTerminal]} options.tail Array of terminals and nonTerminals that represent the tail of the rule. If is not present an empty tail will be created.
        * @param {Function} options.reduceFunc A function to be executed when reducint this rule
        * @param {String} options.name Identification of the rule instance
        */
        var rule = function (options)
        {
            this.options = options;

            if (!options.head)
            {
                throw new Error('Invalid initialization values, please provide a head for the rule');
            }

			//Define alias for:
            k.utils.obj.defineProperty(this, 'head');
            k.utils.obj.defineProperty(this, 'tail');
            k.utils.obj.defineProperty(this, 'reduceFunc');
            k.utils.obj.defineProperty(this, 'name');

            k.utils.obj.defineProperty(this, 'index');
            k.utils.obj.defineProperty(this, 'isProductive'); //Determine if the rule be active part of the grammar. This is calculate by the grammar itself
            k.utils.obj.defineProperty(this, 'isReachable'); //Determine if the rule is reachabke form the start symbol of the grammar. This is calculate by the grammar itself
            k.utils.obj.defineProperty(this, 'terminalsCount'); //Contains the number of terminals in the tail of the current rule

            this.index = -1;
            this.isProductive = false;
            this.isReachable = false;
            this.terminalsCount = 0;

            this.head = !(options.head instanceof NonTerminal) ?
				new NonTerminal({
					name: options.head.toString()
				}) :
				options.head;

			this.tail = (options.tail && k.utils.obj.isArray(options.tail)) ? options.tail : [new Symbol({name: specialSymbol.EMPTY, isSpecial: true})];

			k.utils.obj.each(this.tail, function (symbol)
			{
			    if (symbol instanceof Terminal)
			    {
			        this.terminalsCount++;
			    }
			    symbol.rule = this;
			}, this);
        };

        /* @function Convert a Rule to its pritty string representation
        * @returns {String} Formatted string */
        rule.prototype.toString = function()
        {
            return this.head.toString() + ' --> ' + this.tail.join(' ');
        };

        /* @function Clone the current item, generating a deep copy of it.
        * @param {Boolean} options.copyRuleIndex Indicate if the index should be copied or not. Default: false
        * @returns {Rule} A deep copy of the current item */
        rule.prototype.clone = function(options)
        {
            var auxHead = this.head,
                auxTail = this.tail,
			    cloneOptions;

			// We conserve the head and the tail because the symbol know at what rule it belongs, cause cyclic references
			this.head = null;
			this.tail = null;

		    cloneOptions = k.utils.obj.clone(this.options);
		    
		    this.head = auxHead;
		    this.tail = auxTail;

			cloneOptions.head = auxHead.clone();
			cloneOptions.tail = k.utils.obj.map(auxTail, function(symbol) {
			    return symbol.clone();
			});

			var result = new Rule(cloneOptions);

			if (options && options.copyRuleIndex)
			{
				result.index = this.index;
			}

			return result;
        };

        return rule;
    })();

    /*  Grammar
    * @class
    * @classdesc This class is used to represent grammars */
    var Grammar = (function ()
    {
        var defaultOptions = {
            name: ''
        };

        /*
        * Initialize a new Grammar
        *
        * @constructor
        * @param {NonTerminal} options.startSymbol Start symbol of the grammar
        * @param {[Rule]} options.rules Array of grammatical rules
        * @param {Boolean} options.preserveNonProductiveRules Determine if non-productive rules should be preserve or not. Default: false
        * @param {Boolean} options.preserveUnReachableRules Determine if unreachable rules should be preserve or not. Default: false
        * @param {String} options.name Optional name of the grammar
        */
        var grammar = function (options)
        {
            this.options = k.utils.obj.extendInNew(defaultOptions, options || {});

			//Define alias for:
            k.utils.obj.defineProperty(this, 'startSymbol');
            k.utils.obj.defineProperty(this, 'name');
            k.utils.obj.defineProperty(this, 'rules');
            k.utils.obj.defineProperty(this, 'preserveNonProductiveRules');
            k.utils.obj.defineProperty(this, 'preserveUnReachableRules');

            k.utils.obj.defineProperty(this, 'specifiedStartSymbol'); //After augmented the grammar this property save the specified start symbol (it should be read only)
            k.utils.obj.defineProperty(this, 'terminals');
            k.utils.obj.defineProperty(this, 'rulesByHeader');
            k.utils.obj.defineProperty(this, 'nullableNonTerminals');

            if (!(this.startSymbol instanceof Symbol))
            {
                throw new Error('Invalid grammar creation, please specify a start Symbol!');
            }

            this.nullableNonTerminals = [];
            this._generateRequireRequisites();
        };

        grammar.constants = {
            AugmentedRuleName: 'AUGMENTRULE'
        };
        
        /* @function Determines if a rule is productive or not based on the CURRENT state of all the rest of the rules in the grammar
        * @param {Rule} rule Rule that will be analized
        * @returns {Boolean} True if the rule is productive,, false otherwise */
        grammar.prototype._isRuleProductive = function (rule)
        {
            //find NONProductive tail symbols
            return !k.utils.obj.find(rule.tail, function (symbol)
            {
                // the tail symnol is a non terminal, that; has rules and its rule are all invalid, OR not have any rule
                if (symbol instanceof NonTerminal &&
                    (
                        (this.rulesByHeader[symbol.name] && k.utils.obj.every(this.rulesByHeader[symbol.name], function (rule) { return !rule.isProductive; } ) ) ||
                        (!this.rulesByHeader[symbol.name])
                    )
                    )
                {
                    return true;
                }
                return false;
            }, this);
        };

        /* @function Generate require state for a grammar.
        * Set rule index
        * Augment the grammar to detect when a string is accepts by adding S' --> S#
        * Calculate rules by head
        * @returns {Void} */
        grammar.prototype._generateRequireRequisites = function ()
        {
            /*jshint -W083 */
            var areChanges = false;
            var ruleIndex = 0;

            // augment the grammar
            this.specifiedStartSymbol = this.startSymbol;
            var augmentedRule = new Rule({
                head: 'S\'',
                tail: [this.startSymbol, new k.data.Symbol({name: specialSymbol.EOF})],
                name: grammar.constants.AugmentedRuleName
            });

            this.rules.unshift(augmentedRule);
            this.startSymbol = augmentedRule.head;

            //set rules index
            k.utils.obj.each(this.rules, function (rule, i) {
                rule.index = i;
            });


            // index rule by its rule's head name
            this.rulesByHeader = k.utils.obj.groupBy(this.rules, function (rule)
            {
                return rule.head.name;
            });
            
            
            // determine which rules are productive and remove unproductive ones
            do {
                areChanges = false;
                k.utils.obj.each(this.rules, function (rule)
                {
                    if (!rule.isProductive)
                    {
                        rule.isProductive = this._isRuleProductive(rule);
                        areChanges = areChanges || rule.isProductive;
                    }
                }, this);
            } while (areChanges);
            
            if (!this.preserveNonProductiveRules)
            {
                while (ruleIndex < this.rules.length)
                {
                    if (!this.rules[ruleIndex].isProductive) {
                        this.rules.splice(ruleIndex, 1);
                    } else {
                        ruleIndex++;
                    }
                }
                
                if (this.rules.length === 0)
                {
                    //In this case the augmentation rule does not have a tail! S' --> <EMPTY>
                    augmentedRule = new Rule({
                        head: 'S\'',
                        name: grammar.constants.AugmentedRuleName
                    });
        
                    this.rules.unshift(augmentedRule);
                }
            }
            
            
            //Remove unreachabel rules
            augmentedRule.isReachable = true;
            do
            {
                areChanges = false;
                k.utils.obj.each(this.rules, function (rule)
                {
                    if (rule.isReachable)
                    {
                        k.utils.obj.each(rule.tail, function (symbol)
                        {
                            if (symbol instanceof NonTerminal)
                            {
                                k.utils.obj.each(this.rulesByHeader[symbol.name], function (rule)
                                {
                                    if (!rule.isReachable)
                                    {
                                        areChanges = true;
                                        rule.isReachable = true;
                                    }
                                });
                            }
                        }, this);
                    }
                }, this);
            } while (areChanges);
            if (!this.preserveUnReachableRules)
            {
                ruleIndex = 0;
                while (ruleIndex < this.rules.length)
                {
                    if (!this.rules[ruleIndex].isReachable) {
                        this.rules.splice(ruleIndex, 1);
                    } else {
                        ruleIndex++;
                    }
                }
            }
            
            
            // remove middle tail epsilons
            var tailIndex = 0;
            k.utils.obj.each(this.rules, function (rule)
            {
                tailIndex = 0;
                
                while (tailIndex < rule.tail.length)
                {
                    // if the current tail su,bol is an empty one
                    if (rule.tail[tailIndex].isSpecial && rule.tail[tailIndex].name === k.data.specialSymbol.EMPTY)
                    {
                        //if it is not last one or the previous one is not empty
                        if ( (tailIndex + 1) < rule.tail.length || (tailIndex === (rule.tail.length -1) && tailIndex > 0 && !rule.tail[tailIndex-1].isSpecial) )
                        {
                            rule.tail.splice(tailIndex, 1);
                            --tailIndex;
                        }
                    }
                    tailIndex++;
                }
            });


            //Determines nullable non-terminals
            var allNonTerminalAreNullablesInRule = false;
            do {
                areChanges = false;
                // debugger;
                k.utils.obj.each(this.rules, function (rule)
                {
                    if (rule.tail.length === 1 && rule.tail[0].name === k.data.specialSymbol.EMPTY && !rule.head.isNullable)
                    {
                        rule.head.isNullable = true;
                        areChanges = true;
                        this.nullableNonTerminals.push(rule.head.name);
                    }
                    else if (rule.terminalsCount === 0)
                    {
                        allNonTerminalAreNullablesInRule = k.utils.obj.every(rule.tail, function (nonTerminal)
                        {
                            return this.nullableNonTerminals.indexOf(nonTerminal.name) >= 0;
                        }, this);
                        if (allNonTerminalAreNullablesInRule && !rule.head.isNullable)
                        {
                            rule.head.isNullable = true;
                            areChanges = true;
                            this.nullableNonTerminals.push(rule.head.name);
                        }
                    }
                }, this);
            } while (areChanges);
            
            var allRulesSymbols = k.utils.obj.flatten(
                    k.utils.obj.map(this.rules, function (rule)
                    {
                        return rule.tail.concat(rule.head);
                    }),
                    false);
                    
            // Mark all non terminals that were determined in the previous step, as nullables. This is require because besides share the same name, each non-temrinal in diferentes rules are different isntances
            var allNullablesNonTerminals = k.utils.obj.filter(allRulesSymbols, function (symbol) {
               return symbol instanceof NonTerminal && this.nullableNonTerminals.indexOf(symbol.name) >= 0;
            }, this);
            k.utils.obj.each(allNullablesNonTerminals, function(nonTerminal) {
                nonTerminal.isNullable = true;
            });
            
            
            // get all terminals & determine if it has empty rules
            //flat all rules to get a list of symbol (its tails)
            var tailSymbols = k.utils.obj.flatten(
                    k.utils.obj.map(this.rules, function (rule)
                    {
                        return rule.tail;
                    }),
                    false);

            // remove duplicated symbol (by its name) and filter all non terminals
            this.terminals = k.utils.obj.filter(
                k.utils.obj.uniq(tailSymbols, false, function (symbol)
                {
                    return symbol.name;
                }),
                function (symbol)
                {
                    return symbol.isTerminal;
                });
        };

        /* @function Returns the list of rules that start with the specified symbols as the head
        * @param {Symbol} symbol Symbol used as the head of the requested rules
        * @returns {[Rules]} Array of rules */
        grammar.prototype.getRulesFromNonTerminal = function(symbol)
        {
            return this.rulesByHeader[symbol.name];
        };

        /* @function Convert a Grammar to its pritty string representation
        * @returns {String} Formatted string */
        grammar.prototype.toString = function() {
            var strResult = this.name ? 'Name: ' + this.name : '';
            strResult += 'Start Symbol: ' + this.startSymbol.name +'\n';

            strResult += k.utils.obj.reduce(k.utils.obj.sortBy(this.rules, function(rule) {return rule.index;}), function (strAcc, rule) {
                return strAcc + '\n' + rule.index + '. ' + rule.toString();
            }, '');

            return strResult;
        };

        return grammar;
    })();

    k.data = k.utils.obj.extend(k.data || {}, {
        Symbol: Symbol,
        NonTerminal: NonTerminal,
        Terminal: Terminal,
        Rule: Rule,
        Grammar: Grammar,
        specialSymbol: specialSymbol
    });

    return k;
});
define(['../utils/obj'],  function(k)
{
	'use strict';

	/**
	* Enum for any special Symbol
	* @readonly
	* @enum {String}
	*/
    var specialSymbol = {
        EMPTY: 'EMPTY',
        EOF : 'EOF'
    };

    /** Symbol
    * @class
    * @classdesc This class represent any simbol in the entire system */
    var Symbol = (function ()
    {
        /*
        * Creates an instance of a Symbol (This class represent non Terminals, Terminals and Special symbols)
        *
        * @constructor
        * @param {String} options.name The name or denatation of the non terminal
        * @param {Boolean} options.isSpecial Determiens if the current symbol is a secial one, like EOF. Default false
        */
        var symbol = function (options)
        {
			this.options = options;

			k.utils.obj.defineProperty(this, 'name');
			k.utils.obj.defineProperty(this, 'isSpecial');

            this.isSpecial = !!options.isSpecial;

            if (!this.name || !k.utils.obj.isString(this.name))
            {
                throw new Error('Invalid initialization values for a symbol, please provide a string name a symbol');
            }
        };

        /** @function Shows the symbol's name
        * @returns this.name */
        symbol.prototype.toString = function() {
            return this.name.toString();
        };

        /* @function Creates a deep copy of the current instance
        * @returns Deep copy */
        symbol.prototype.clone = function() {
			return new Symbol(k.utils.obj.clone(this.options));
        };

        return symbol;
    })();

    /** Non Terminal
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
        }

        /** @function Creates an array os non terminals from a string that represen them
         * @param {[Array]} arr Array of string used to create new non terminals
         * @returns An array of new nonterminals  */
        nonTerminal.fromArray = function (arr)
        {
            if (!k.utils.obj.isArray(arr) && !k.utils.obj.isString(arr)) {
                throw new Error('Invalid parameter. To create non terminal from array the input parameter should be an array!');
            }
            var result = [];
            for (var i = 0; i < arr.length; i++)
            {
                result[i] = new NonTerminal({
                    name: arr[i]
                });
            }

            return result;
        };

        /* @function Creates a deep copy of the current instance
        * @returns Deep copy */
        nonTerminal.prototype.clone = function() {
			return new NonTerminal(k.utils.obj.clone(this.options));
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

            this.isTerminal = true;
        }

        /* @function Shows the terminal's name between < and >
        * @returns Fromatted string */
        terminal.prototype.toString = function() {
            return '<' + this.name + '>';
        };

		/* @function Creates a deep copy of the current instance
        * @returns Deep copy */
        terminal.prototype.clone = function() {
			var cloneOptions = k.utils.obj.clone(this.options);
			cloneOptions.body = k.utils.obj.isRegExp(this.body) ? new RegExp(this.body.source) : this.body;

			return new Terminal(cloneOptions);
        };

        return terminal;
    })(Symbol);

     /**  Grammatical Rules
    * @class
    * @classdesc Use this class to create new instance of non Termianls */
    var Rule = (function()
    {
        /*
        * Initialize a new Grammatical Rule
        *
        * @constructor
        * @param {NonTerminal} options.head The name or denatation of the non terminal
        * @param {[Terminal|NonTerminal]} [options.tail] Array of terminals and nonTerminals that represent the tail of the rule. If is not present an empty tail will be created.
        * @param {Function} options.reduceFunc A function to be executed when reducint this rule
        */
        var rule = function (options)
        {
            this.index = -1;
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

            this.head = !(options.head instanceof NonTerminal) ?
				new NonTerminal({
					name: options.head.toString()
				}) :
				options.head;

			this.tail = (options.tail && k.utils.obj.isArray(options.tail)) ? options.tail : [new Symbol({name: specialSymbol.EMPTY, isSpecial: true})];
        };

        /* @function Convert a Rule to its pritty string representation
        * @returns Formatted string */
        rule.prototype.toString = function()
        {
            return this.head.toString() + ' --> ' + this.tail.join(' ');
        };

        /* @function Clone the current item, generating a deep copy of it.
        * @param {Boolean} options.copyRuleIndex Indicate if the index should be copied or not. Default: false
        * @returns A deep copy of the current item */
        rule.prototype.clone = function(options)
        {
			var cloneOptions = k.utils.obj.clone(this.options);

			cloneOptions.head = this.head.clone();
			cloneOptions.tail = k.utils.obj.map(this.tail, function(symbol) {
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

     /**  Grammar
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
        */
        var grammar = function (options)
        {
            this.options = k.utils.obj.extendInNew(defaultOptions, options || {});

			//Define alias for:
            k.utils.obj.defineProperty(this, 'startSymbol');
            k.utils.obj.defineProperty(this, 'specifiedStartSymbol'); //After augmented the grammar this property save the specified start symbol (it should be read only)
            k.utils.obj.defineProperty(this, 'rules');
            k.utils.obj.defineProperty(this, 'terminals');
            k.utils.obj.defineProperty(this, 'rulesByHeader');
            k.utils.obj.defineProperty(this, 'name');
            
            if (!(this.startSymbol instanceof Symbol))
            {
                throw new Error('Invalid grammar creation, please specify a start Symbol!');
            }

            this._generateRequireRequisites();
            this.rulesByHeader = this._getIndexByNonTerminals(this.rules);
            this.terminals = this._getTerminals(this.rules);
        };
        
        grammar.constants = {
            AugmentedRuleName: 'AUGMENTRULE'
        };
        
        /* @function Generate require state for a grammar.
        * Set rule index
        * Augment the grammar to detect when a string is accepts by adding S' --> S#
        * @returns {Void} */
        grammar.prototype._generateRequireRequisites = function ()
        {
            //TODO TEST THIS
            
            //TODO Remove epsilon in the middle of rules, like A ==> B <EMPTY> 'a' C converted into A ==> B 'a' C
            
            //TODO Remove rules that contains non terminals that does NOT produce anything. NonTerminales that are not in non head rule.
            //this will generate that our automata generator, make invalid loops!!! IMPORTANT!
            
            //TODO REMOVE UNREACHABLE RULES, (After applying previious logic)
            //DO NOT REMOVE AUGMENTRULE 
            //BECAREFUL if all the rules get removed!!
            this.specifiedStartSymbol = this.startSymbol;
            var augmentedRule = new Rule({
                head: 'S\'',
                tail: [this.startSymbol, new k.data.Symbol({name: specialSymbol.EOF, isSpecial: true})],
                name: grammar.constants.AugmentedRuleName //'AUGMENTRULE'
            });
            
            this.rules.unshift(augmentedRule);
            this.startSymbol = augmentedRule.head;
            
            k.utils.obj.each(this.rules, function (rule, i) {
                rule.index = i;
            });
            
            
        };

        /* @function Index all grammatical rules by its header non terminal
        * @param {[rule]} rules Array grammatical rules of the current grammar
        * @returns {Object} An object that has an array of rules per each non terminal name property  */
        grammar.prototype._getIndexByNonTerminals = function (rules)
        {
            var result = {};
            for (var i = 0; i < rules.length; i++)
            {
				/* jshint expr:true */
                result[rules[i].head.name] ? result[rules[i].head.name].push(rules[i]) : result[rules[i].head.name] = new Array(rules[i]);
            }
            return result;
        };

        /* @function Compute an Array of all grammar's terminals'
        * @param {[rule]} rules Array grammatical rules of the current grammar
        * @returns {[Object]} An ordered array of object containg the terminals and the rules that define them */
        grammar.prototype._getTerminals = function(rules)
        {
            var result = [];
            k.utils.obj.each(rules, function (rule)
            {
                k.utils.obj.each(rule.tail, function (symbol) 
                {
                    if (symbol.isTerminal)
                    {
                        result[result.length] = {
                            body: symbol.body,
                            rule: rule
                        };    
                    }
                });
            }, this);
            
            return result;
        };

        /* @function Returns the list of rules that start with the specified symbols as the head
        * @param {Symbol} symbol Symbol used as the head of the requested rules
        * @returns {[Rules]} Array of rules */
        grammar.prototype.getRulesFromNonTerminal = function(symbol)
        {
            return this.rulesByHeader[symbol.name];
        };

        /* @function Convert a Grammar to its pritty string representation
        * @returns Formatted string */
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
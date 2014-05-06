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
        * Creates an instance of a Symbol (This class represent non Temrinals, Terminals and Special symbols)
        *
        * @constructor
        * @param {String} options.name The name or denatation of the non terminal
        * @param {Boolean} options.isSpecial Determiens if the current symbol is a secial one, like EOF. Default false
        */
        var symbol = function (options)
        {
            this.name = options.name;
            this.isSpecial = !!options.isSpecial;
            if (!this.name || !k.utils.obj.isString(this.name)) {
                throw new Error('Invalid initialization values for a symbol, please provide a string name a symbol');
            }
        };

        /** @function Shows the symbol's name
        * @returns this.name */
        symbol.prototype.toString = function() {
            return this.name.toString();
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
            this.body = options.body;
            this.isTerminal = true;
        }

        /** @function Shows the terminal's name between < and >
        * @returns Fromatted stirng */
        terminal.prototype.toString = function() {
            return '<' + this.name + '>';
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
        * @param {nonTerminal} options.head The name or denatation of the non terminal
        * @param {[terminal|nonTerminal]} [options.tail] Array of terminals and nonTerminals that represent the tail of the rule.
        * If is not present an empty tail will be created.
        */
        var rule = function (options)
        {
            this.index = -1;

            if (!options.head)
            {
                throw new Error('Invalid initialization values, please provide a head for the rule');
            }

            if (!(options.head instanceof NonTerminal))
            {
                this.head = new NonTerminal({
                   name: options.head.toString()
                });
            } else {
                this.head = options.head;
            }

            this.tail = (options.tail && k.utils.obj.isArray(options.tail)) ? options.tail : [new Symbol({name: specialSymbol.EMPTY, isSpecial: true})];
        };

        /** @function Convert a Rule to its pritty string representation
        * @returns Formatted string */
        rule.prototype.toString = function()
        {
            var strResult = this.head.toString() + '-->';
            for (var i = 0; i < this.tail.length; i++) {
                strResult += this.tail[i].toString();
            }
            return strResult;
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
        * @param {NonTerminal} startSymbol Start symbol of the grammar
        * @param {[Rule]} rules Array of grammatical rules
        */
        var grammar = function (startSymbol, rules, options)
        {
            this.options = k.utils.obj.extend(defaultOptions, options || {});
            this.startSymbol = startSymbol;
            this.rules = rules;
            this.rulesByHeader = this._getIndexByNonTerminals(this.rules);
            this.terminals = this._getTerminals(this.rules);
        };

         /** @function Index all grammatical rules by its header non terminal
         * @param {[rule]} rules Array grammatical rules of the current grammar
         * @returns An object that has an array of rules per each non terminal name property  */
        grammar.prototype._getIndexByNonTerminals = function(rules)
        {
            var result = {};
            for (var i = 0; i < rules.length; i++)
            {
				rules[i].index = i;
				/* jshint expr:true */
                result[rules[i].head.name] ? result[rules[i].head.name].push(rules[i]) : result[rules[i].head.name] = new Array(rules[i]);
            }
            return result;
        };

         /** @function Compute an Array of all grammar's terminals'
         * @param {[rule]} rules Array grammatical rules of the current grammar
         * @returns An ordered array of object containg the terminals and the rules that define them */
        grammar.prototype._getTerminals = function(rules)
        {
            var result = [];
            for (var i = 0; i < rules.length; i++)
            {
                if (rules[i].tail.length === 1 && rules[i].tail[0].isTerminal)
                {
                    result[result.length] = {
                        body: rules[i].tail[0].body,
                        rule: rules[i]
                    };
                }
            }
            return result;
        };

         /** @function Returns the list of rules that start with the specified symbols as the head
         * @param {Symbol} symbol Symbol used as the head of the requested rules
         * @returns Array of rules */
        grammar.prototype.getRulesFromNonTerminal = function(symbol)
        {
            return this.rulesByHeader[symbol.name];
        };

        /** @function Convert a Grammar to its pritty string representation
        * @returns Formatted string */
        grammar.prototype.toString = function() {
            var strResult = this.name ? 'Name: ' + this.name : '';
            strResult += 'Start Symbol: ' + this.startSymbol.name +'\n';

            for (var i = 0; i < this.rules.length; i++) {
                strResult += i +': '+ this.rules[i] + '\n';
            }
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
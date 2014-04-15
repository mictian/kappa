(function() {
    //NAMESPACE DEFINITION
    var k = {};

    //OBJECT UTILS
    k.utils = {};
    k.utils.obj = (function(){

         /*
        * @func Util function used to apply "Inheritance"
        *
        * @param {Object} superType Object to inherit from
        * @param {Object} subType Enhanced Object
        */
        var __extends = this.__extends || function (subType, superType) {
            for (var p in superType)
                if (superType.hasOwnProperty(p))
                    subType[p] = superType[p];
            function __() {
                this.constructor = subType;
            }
            __.prototype = superType.prototype;
            subType.prototype = new __();
        };

        return {
            extends: __extends
        };
    })();


    //GRAMMAR DEFINITION
    k.data = (function()
    {
        var specialSymbol = {
            EMPTY: 'EMPTY',
            EOF : 'EOF'
        };

         /** Symbol
        * @class
        * @classdesc This class represent any simbol in the entire system */
        var symbol = (function ()
        {
            /*
            * Creates of a Symbol (This class represent non Temrinals, Terminals and Special symbols)
            *
            * @constructor
            * @param {String} options.name The name or denatation of the non terminal
            */
            function symbol (options)
            {
                this.name = options.name;
                this.isSpecial = options.isSpecial || false;
            }

            /** @function Shows the rule's name
            * @returns this.name */
            symbol.prototype.toString = function() {
                return this.name;
            };

            return symbol;
        })();

        /** Non Terminal
        * @class
        * @classdesc Use this class to create new instance of non Termianls */
        var nonTerminal = (function(_super)
        {
            k.utils.obj.extends(nonTerminal, _super);
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
                var result = [];
                for (var i = 0; i < arr.length; i++)
                {
                    result[i] = new nonTerminal({
                        name: arr[i]
                    });
                }

                return result;
            };

            return nonTerminal;
        })(symbol);

        var terminal = (function(_super)
        {
            k.utils.obj.extends(terminal, _super);
            /*
            * Creates an instance of a new Termianl
            *
            * @constructor
            * @param {String} options.name The name or denatation of the terminal
            * @param {String|RegExp} options.body The string or regexp used to match the input tokens
            */
            function terminal (options)
            {
				options.name = options.name ? options.name : options.body.toString();
                _super.apply(this, arguments);
                this.body = options.body instanceof RegExp ? options.body : options.body.toString();
                this.isTerminal = true;
            }

            return terminal;
        })(symbol);

         /**  Grammatical Rules
        * @class
        * @classdesc Use this class to create new instance of non Termianls */
        var rule = (function()
        {
             /*
            * Initialize a new Grammatical Rule
            *
            * @constructor
            * @param {nonTerminal} options.head The name or denatation of the non terminal
            * @param {[terminal|nonTerminal]} [options.tail] Array of terminals and nonTerminals that represnt tail ofthe rule. If is not present an empty tail will be created.
            */
            function rule(options) {
                this.index = -1;

                if (!options.head)
                {
                    throw new Error('Invalid initialization values, please provide a head for the rule');
                }

                if (!(options.head instanceof nonTerminal))
                {
                    this.head = new nonTerminal({
                       name: options.head.toString()
                    });
                } else {
                    this.head = options.head;
                }


                this.tail = options.tail ? options.tail : [new symbol({name: specialSymbol.EMPTY, isSpecial: true})];
            }

            return rule;
        })();

         /**  Grammar
        * @class
        * @classdesc This class is used to represent grammars */
        var grammar = (function ()
        {
            /*
            * Initialize a new Grammar
            *
            * @constructor
            * @param {nonTerminal} startSymbol Start symbol of the grammar
            * @param {[rule]} rules Array of grammatical rules
            */
            function grammar (startSymbol, rules)
            {
                this.startSymbol = startSymbol;
                this.rules = rules;
                this.rulesByHeader = this._getIndexByNonTerminals(this.rules);
                this.terminals = this._getTerminals(this.rules);
            }

             /** @function Index all grammatical rules by its header non terminal
             * @param {[rule]} rules Array grammatical rules of the current grammar
             * @returns An object that has an array of rules per each non terminal name property  */
            grammar.prototype._getIndexByNonTerminals = function(rules)
            {
                var result = {};
                for (var i = 0; i < rules.length; i++) {
                    result[rules[i].head.name] ? result[rules[i].head.name].push(rules[i]) : result[rules[i].head.name] = [rules[i]];
                }
                return result;
            };

             /** @function Array of all grammar's terminals'
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

            return grammar;
        })();

		return {
            symbol: symbol,
            nonTerminal: nonTerminal,
            terminal: terminal,
            rule: rule,
            grammar: grammar,
            specialSymbol: specialSymbol
        };

    })();

    //TODO: Implement a REAL lexer. This one is just a temporal one!
    /**  Lexer
    * @class
    * @classdesc This class scan an input stream and convert it to an token input */
    k.lexer = (function()
    {
        /*
        * Initialize a new Lexer
        *
        * @constructor
        * @param {k.grammar} grammar Grammar used to control the scan process
        * @param {String} stream Input Stream (Generally a String)
        */
        function lexer (grammar, stream)
        {
            this.index = 0;
            this.grammar = grammar;
            this.inputStream = stream;
            this.stringTokens = this.inputStream.split(' ');
        }

        lexer.getNext = function()
        {
            var result = {
				length: -1
            },
				currentString = this.stringTokens[this.index++],
				terminals =this.grammar.terminals,
				body;

            if  (!currentString)
            {
				result = {
					length: -1,
					terminal: new k.data.symbol({name: k.data.specialSymbol.EOF, isSpecial:true})
				};
            }
            else
            {
				for (var i = 0; i < terminals.length; i++)
				{
					body = terminals[i].body;
					if (body instanceof RegExp && body.test(currentString))
					{
						//find the largest match
						var matches = body.exec(currentString),
							selectedMatch = '';

						for (var m = 0; m < matches.length; m++)
						{
							if (matches[m].length > selectedMatch)
							{
								selectedMatch = matches[m];
							}
						}

						if (result.length < selectedMatch.length)
						{
							result = {
								length: selectedMatch.length,
								string: selectedMatch,
								rule: terminals[i].rule,
								terminal: terminals[i].rule.tail[0]
							};
						}
					}
					else if (toString.call(body) === "[object String]" && body === currentString && result.length < currentString.length)
					{
						result = {
							length: currentString.length,
							string: currentString,
							rule: terminals[i].rule,
							terminal: terminals[i].rule.tail[0]
						};
					}
				}
            }

            return result;
        };

        return lexer;
	})();


    //TESTS
    debugger;

    var S = new k.data.rule({
			head: 'S',
			tail: k.data.nonTerminal.fromArray(['OPAREN','EXPS','CPAREN'])
		}),

		EXPS1 = new k.data.rule({
			head: 'EXPS',
			tail: k.data.nonTerminal.fromArray(['EXPS','EXP'])
		}),

		EXPS2 = new k.data.rule({
			head: 'EXPS',
		}),

		EXP = new k.data.rule({
			head: 'EXP',
			tail: [new k.data.terminal({name:'id', body: /[a-z]+/})]
		}),

		OPAREN = new k.data.rule({
			head: 'OPAREN',
			tail: [new k.data.terminal({name:'id', body: /\(/})]
		}),

		CPAREN = new k.data.rule({
			head: 'CPAREN',
			tail: [new k.data.terminal({name:'id', body: /\)/})]
		});

    var g = new k.data.grammar('S', [S,EXPS1,EXPS2, EXP, OPAREN, CPAREN]);


})();
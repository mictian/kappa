define(['../utils/str', '../data/grammar'], function(k)
{
	'use strict';
	//TODO: Implement a REAL lexer. This one is just a temporal one!

    /**  Lexer
    * @class
    * @classdesc This class scan an input stream and convert it to an token input */
    k.Lexer = (function()
    {
        var defaultOptions = {
            notIgnoreSpaces : false
        };

        /*
        * Initialize a new Lexer
        *
        * @constructor
        * @param {k.grammar} grammar Grammar used to control the scan process
        * @param {String} stream Input Stream (Generally a String)
        * @param {Boolean} options.notIgnoreSpaces If true spaces are not ignored. False by default
        */
        var lexer = function (grammar, stream, options)
        {
            this.options = k.utils.obj.extendInNew(defaultOptions, options || {});
            this.grammar = grammar;
			this.inputStream = !this.options.notIgnoreSpaces ? k.utils.str.ltrim(stream) : stream;
        }

		/** @function Get next input token
         * @returns An object representing the current finded token. The object can not have a rule associated if there is any match */
        lexer.prototype.getNext = function()
        {
            var result = {
					length: -1
				},
				terminals =this.grammar.terminals,
				body;

            if  (!this.inputStream)
            {
				result = {
					length: -1,
					terminal: new k.data.Symbol({name: k.data.specialSymbol.EOF, isSpecial:true})
				};
            }
            else
            {
				for (var i = 0; i < terminals.length; i++)
				{
					body = terminals[i].body;
					//If it's reg exp and match
					if (body instanceof RegExp && !this.inputStream.search(body))
					{
						var match = body.exec(this.inputStream)[0];
						if (result.length < match.length)
						{
							result = {
								length: match.length,
								string: match,
								rule: terminals[i].rule,
								terminal: terminals[i].rule.tail[0]
							};
						}
					}
					//if it is a string check if there are the same
					else if (toString.call(body) === "[object String]" && k.utils.str.startsWith(this.inputStream, body) && result.length < body.length)
					{
						result = {
							length: body.length,
							string: body,
							rule: terminals[i].rule,
							terminal: terminals[i].rule.tail[0]
						};
					}
				}

				if (result.length === -1)
				{
					//if there is no valid match, we return the current input stream
					result = {
						length: this.inputStream.length,
						string: this.inputStream
					};
				}
				else
				{
					//If there is a match
					this.inputStream = this.inputStream.substr(result.length);
					if (!this.options.notIgnoreSpaces)
					{
						this.inputStream = k.utils.str.ltrim(this.inputStream);
					}

				}
            }

            return result;
        };

        return lexer;
	})();

	return k;
});
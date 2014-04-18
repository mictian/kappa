define(['../core'], function(k)
{

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

		/** @function Get next input token
         * @returns An object representing the current finded token. The object can not have a rule associated if there is any match */
        lexer.prototype.getNext = function()
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
					//If it's reg exp check if match
					if (body instanceof RegExp && body.test(currentString))
					{
						//TODO IS THIS OK? Should I take the hold string?
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
					//if it is a string check if there are the same
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

				if (result.length === -1)
				{
					//if there is no valid match, we return the current string
					result = {
						length: currentString.length,
						string: currentString
					};
				}
            }

            return result;
        };

        return lexer;
	})();

	return k;
});
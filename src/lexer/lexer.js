/*global toString: true*/
define(['../utils/str', '../utils/obj', '../data/grammar'], function(k)
{
	'use strict';
	//TODO: Implement a REAL lexer. This one is just a temporal one!

    /* Lexer
    * @class
    * @classdesc This class scan an input stream and convert it to an token input */
    var Lexer = (function()
    {
        var defaultOptions = {
            notIgnoreSpaces : false
        };

        /*
        * Initialize a new Lexer
        *
        * @constructor
        * @param {Grammar} options.grammar Grammar used to control the scan process
        * @param {String} options.stream Input Stream (Generally a String)
        * @param {Boolean} options.notIgnoreSpaces If true spaces are not ignored. False by default. 
        	IMPORTANT: If the grammar has empty rules (A --> <EMPTY>) ignoring spaces will make that the lexer returns EOF instead of EMPTY at the end of the string ('').
        */
        var lexer = function (options)
        {
            this.options = k.utils.obj.extendInNew(defaultOptions, options || {});

            k.utils.obj.defineProperty(this, 'grammar');
            k.utils.obj.defineProperty(this, 'stream'); //Specified input stream
            k.utils.obj.defineProperty(this, 'inputStream'); // Post-Processed input stream
            k.utils.obj.defineProperty(this, 'notIgnoreSpaces');

			this.setStream(this.stream);
        };
        
        /* @function Get next input token
        * @param {String} stream Input string to be processed
        * @returns {Void} */
        lexer.prototype.setStream = function (stream)
        {
        	//TODO TEST THIS
        	this.inputStream = (!this.notIgnoreSpaces && this.stream) ? k.utils.str.ltrim(this.stream) : this.stream;
        	if (!this.notIgnoreSpaces && this.inputStream === '')
        	{
        		this.inputStream = null;
        	}
        };
        
        /* @function Get a generic result in case of error, when the lexer cannnot match any terminal in the input
        * @returns {Object} An object representing the the mis of any match (error)  */
        lexer.prototype.__getErrorResult = function()
        {
        	return {
					length: -1,
					string: this.inputStream,
					ERROR: 'NOT MATCHING FOUND'
				};
        };

		/* @function Get next input token
        * @returns {Object} An object representing the current finded token. The object can not have a rule associated if there is any match */
        lexer.prototype.getNext = function()
        {
        	//TODO TEST THIS
        	//TODO return EMPTY whne the string is empty, and then return EOF!, or OEF cuando es null or undefined
            var result = {
					length: -1
				},
				terminals = this.grammar.terminals,
				grammarHasEmptyRules = k.utils.obj.find(this.grammar.rules, function (rule)
					{
						return rule.tail.length === 1 && rule.tail[0].isSpecial && rule.tail[0].name === k.data.specialSymbol.EMPTY;
					}),
				body;

            if  (this.inputStream === null)
            {
				result = {
					length: -1,
					terminal: new k.data.Symbol({name: k.data.specialSymbol.EOF})
				};
            }
            else if (this.inputStream === '')
            {
            	if (grammarHasEmptyRules)
            	{
            		result = {
						length: 0,
						string: '',
						terminal: new k.data.Symbol({name: k.data.specialSymbol.EMPTY})
					};
					this.inputStream = null;	
            	}
            	else
            	{
            		result = this.__getErrorResult();
            	}
            }
            else
            {
				for (var i = 0; i < terminals.length; i++)
				{
					body = terminals[i].body;
					//If it's reg exp and match (this.inputStream.search(body) returns the index of matching which evals to false so !)
					if (body instanceof RegExp && !this.inputStream.search(body))
					{
						var match = body.exec(this.inputStream)[0];
						if (result.length < match.length)
						{
							result = {
								length: match.length,
								string: match,
								terminal: terminals[i].rule.tail[0]
							};
						}
					}
					
					//if it is a string check if there are the same
					else if (k.utils.obj.isString(body) && k.utils.str.startsWith(this.inputStream, body) && result.length < body.length)
					{
						result = {
							length: body.length,
							string: body,
							terminal: terminals[i].rule.tail[0]
						};
					}
				}

				if (result.length === -1)
				{
					//if there is no valid match, we return the current input stream
					result = this.__getErrorResult();
				}
				else
				{
					//If there is a match
					this.inputStream = this.inputStream.substr(result.length);
					if (!this.options.notIgnoreSpaces)
					{
						this.inputStream = k.utils.str.ltrim(this.inputStream);
						// if ignoring spaces and the input string only left empty, set the input as finished
						if (this.inputStream === '')
						{
							this.inputStream = null;
						}
					}

				}
            }

            return result;
        };

        return lexer;
	})();

	k.lexer = k.utils.obj.extend(k.lexer || {}, {
        Lexer: Lexer
	});

	return k;
});
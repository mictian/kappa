/*global toString: true*/
//TODO: Implement a REAL lexer. This one is just a temporal one!

/* Lexer
* @class
* @classdesc This class scan an input stream and convert it to an token input */
k.lexer.Lexer = (function() {
	'use strict';

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
	*	IMPORTANT: If the grammar has empty rules (A --> <EMPTY>) ignoring spaces will make that the lexer returns EOF instead of EMPTY at the end of the string ('').
	* @param {Boolean} options.notIgnoreNewLines If true enters are not ignored. False by default.
	*	IMPORTANT: If the grammar has empty rules (A --> <EMPTY>) ignoring new lines will make that the lexer returns EOF instead of EMPTY at the end of the string ('').
	*/
	var lexer = function (options)
	{
		this.options = k.utils.obj.extendInNew(defaultOptions, options || {});

		k.utils.obj.defineProperty(this, 'grammar');
		k.utils.obj.defineProperty(this, 'stream'); //Specified input stream
		k.utils.obj.defineProperty(this, 'inputStream'); // Post-Processed input stream
		k.utils.obj.defineProperty(this, 'notIgnoreSpaces');
		k.utils.obj.defineProperty(this, 'notIgnoreNewLines');

		this.setStream(this.stream);
	};

	/* @function Set the input string stream
	* @param {String} stream Input string to be processed
	* @returns {Void} */
	lexer.prototype.setStream = function (stream)
	{
		this.inputStream = this.stream = stream;
		this._clearStream();
	};

	/* @function Process the current string stream to clear ignored spaced and enters, leaving the resulted string in the same inputStream
	* @returns {Void} */
	lexer.prototype._clearStream = function ()
	{
		if (k.utils.obj.isUndefined(this.inputStream))
		{
			this.inputStream = null;
		}
		else
		{
			if (!this.notIgnoreSpaces || !this.notIgnoreNewLines)
			{
				if (!this.notIgnoreSpaces && !this.notIgnoreNewLines)
				{
					this.inputStream = k.utils.str.fullLtrim(this.inputStream);
				}
				else if (!this.notIgnoreSpaces)
				{
					this.inputStream = k.utils.str.ltrim(this.inputStream);
				}
				else if (!this.notIgnoreNewLines)
				{
					this.inputStream = k.utils.str.ltrimBreaks(this.inputStream);
				}

				// if ignoring spaces and the input string is empty, set the input as finished
				if (this.inputStream === '')
				{
					this.inputStream = null;
				}
			}
		}
	};

	/* @function Get a generic result in case of error, when the lexer cannnot match any terminal in the input
	* @returns {Object} An object representing the the mis of any match (error)  */
	lexer.prototype._getErrorResult = function()
	{
		return {
				length: -1,
				string: this.inputStream,
				ERROR: 'NOT MATCHING FOUND'
			};
	};

	/* @function Searh for the next token the in the current inputStream.
	* IMPORTANT: In order to call this function the inputStream should not be null neither the empty string.
	* @returns {Object} An object representing the current finded token.
	* {Number} result.length Length of the matched string
	* {String} result.string String matched
	* {Terminal} result.terminal matching terminal */
	lexer.prototype._searchNextToken = function ()
	{
		var result = {
				length: -1
			},
			terminals = this.grammar.terminals,
			body;

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
						terminal: terminals[i]
					};
				}
			}

			//if it is a string check if they are the same
			else if (k.utils.obj.isString(body) && k.utils.str.startsWith(this.inputStream, body) && result.length < body.length)
			{
				result = {
					length: body.length,
					string: body,
					terminal: terminals[i]
				};
			}
		}

		return result;
	};

	/* @function Get next input token
	* @returns {Object} An object representing the current finded token.
	* {Number} result.length Length of the matched string
	* {String} result.string String matched
	* {Terminal} result.terminal matching terminal */
	lexer.prototype.getNext = function ()
	{
		var result = {
				length: -1
			},
			grammarHasEmptyRules;

		if (this.inputStream === null)
		{
			result = {
				length: -1,
				terminal: new k.data.Symbol({name: k.data.specialSymbol.EOF})
			};
		}
		else if (this.inputStream === '')
		{
			grammarHasEmptyRules = grammarHasEmptyRules || k.utils.obj.find(this.grammar.rules, function (rule)
				{
					return rule.tail.length === 1 && rule.tail[0].isSpecial && rule.tail[0].name === k.data.specialSymbol.EMPTY;
				});

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
				result = this._getErrorResult();
			}
		}
		else
		{
			result = this._searchNextToken();

			if (result.length === -1)
			{
				//if there is no valid match, we return the current input stream as an error
				result = this._getErrorResult();
			}
			else
			{
				//If there is a match
				this.inputStream = this.inputStream.substr(result.length);
				this._clearStream();
			}
		}

		return result;
	};

	return lexer;
})();

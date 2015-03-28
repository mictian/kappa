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
	* @param {Boolean} options.usePriorities Indicate that the lexer should select the token based on the priority of each terminal. Default value: false
	* @param {Boolean} options.useMultipleMatching Indicate that the lexer should; first accept a list of valid token from the parser and second, from that list return the first that match. It is recommended to use this feature with Priorities feature enabled too. Default value: false
	*   IMPORTANT: It is recommended to use priorities feature when using multi-matching, otherwise the returning token will be defined based on the order in which they were defined in the grammar!
	*/
	var lexer = function (options)
	{
		this.options = k.utils.obj.extendInNew(defaultOptions, options || {});

		k.utils.obj.defineProperty(this, 'grammar');
		k.utils.obj.defineProperty(this, 'stream'); //Specified input stream
		k.utils.obj.defineProperty(this, 'inputStream'); // Post-Processed input stream
		k.utils.obj.defineProperty(this, 'notIgnoreSpaces');
		k.utils.obj.defineProperty(this, 'notIgnoreNewLines');
		k.utils.obj.defineProperty(this, 'usePriorities');
		k.utils.obj.defineProperty(this, 'useMultipleMatching');

		k.utils.obj.defineProperty(this, '_line');
		k.utils.obj.defineProperty(this, '_character');
		k.utils.obj.defineProperty(this, '_ignoredString'); //The characters that werre ignored based in the current configuration
		//this cuold be spaced and/or enters and/or tabs

		this.setStream(this.stream);
	};

	/* @method Set the input string stream and set to 0 the line and the character position
	* @param {String} stream Input string to be processed
	* @returns {Void} */
	lexer.prototype.setStream = function (stream)
	{
		this.inputStream = this.stream = stream;

		this._line = 0;
		this._character = 0;
		this._ignoredString = '';

		this._clearStream();
	};

	/* @method Process the current string stream to clear ignored spaced and enters, leaving the resulted string in the same inputStream
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
				var original_inputString = this.inputStream;
				// ,
				// 	difference_string;

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

				this._ignoredString = original_inputString.substr(0, original_inputString.indexOf(this.inputStream));
				this._updatePosition(this._ignoredString);

				// if ignoring spaces and the input string is empty, set the input as finished
				if (this.inputStream === '')
				{
					this.inputStream = null;
				}
			}
		}
	};

	/* @method Get a generic result in case of error, when the lexer cannnot match any terminal in the input
	* @returns {Object} An object representing the error */
	lexer.prototype._getErrorResult = function ()
	{
		return {
			length: -1,
			string: this.inputStream,
			error: 'NOT MATCHING FOUND',
			line: this._line,
			character: this._character
		};
	};

	/* @method Update the current instalce line and position values to track where the reading cursor of the lexer is.
	* This information is used to easily found errors.
	* @param {String} processed_string Last processed string (string chunk removes from the input stream), used to update the line and the character values.
	* @returns {Void} */
	lexer.prototype._updatePosition = function (processed_string)
	{
		if (!processed_string)
		{
			return;
		}

		var indices_location = k.utils.str.getIndicesOf('\n', processed_string);

		if (indices_location.length)
		{
			this._line += indices_location.length;
			this._character = processed_string.substr(k.utils.obj.max(indices_location) + 1).length;
		}
		else
		{
			this._character += processed_string.length;
		}
	};

	/* @method Process the result based on the current lexer instance setting. If using multi-matching the new mathc will be added into the list of result otherwise the more specified will be selected*
	* @param {Object|Array<Objects>} last_result Last matching token if NOT using multi matching or an array of matching tokens if DO using multi-matching. In the case there were no previous found token, this object should have a property length with -1 as a value or be an empty array.
	* @param {String} matching_string The new found string that match the input stream
	* @param {Terminal} terminal Terminal used to match the matching_string string
	* @returns {Object|Array<Objects>} A token object or an array of token objects
	* {Number} result.length Length of the matched string
	* {Number} result.line Line number where token was found or expected
	* {Number} result.character Position where the token was found or expected
	* {String} result.string String matched
	* {Terminal} result.terminal matching terminal*/
	lexer.prototype._chooseMoreSpecifcToken = function (last_result, matching_string, terminal)
	{
		if (this.useMultipleMatching)
		{
			return this._chooseMoreSpecificArrayTokens(last_result, matching_string, terminal);
		}
		else
		{
			return this._chooseMoreSpecifcSingleToken(last_result, matching_string, terminal);
		}
	};

	/* @method When using multi-matching return the list of valid matches. This method takes into account if usign priorities and sort the result based on that.
	* @param {Object} last_result Last matching token. In the case there were no previous found token, this values shoudl be an empty arary.
	* @param {String} matching_string The new found string that match the input stream
	* @param {Terminal} terminal Terminal used to match the matching_string string
	* @returns {Array<Object>} Array of  token objects, each of them is compose by:
	* {Number} result.length Length of the matched string
	* {Number} result.line Line number where token was found or expected
	* {Number} result.character Position where the token was found or expected
	* {String} result.string String matched
	* {Terminal} result.terminal matching terminal*/
	lexer.prototype._chooseMoreSpecificArrayTokens =  function (last_results, matching_string, terminal)
	{
		var result = k.utils.obj.isArray(last_results) ? last_results : [];

		result.push({
			length: matching_string.length,
			string: matching_string,
			line: this._line,
			character: this._character,
			terminal: terminal
		});

		if (this.usePriorities)
		{
			result = k.utils.obj.sortBy(result, function (token)
			{
				return -(token.terminal.priority || 0);
			});
		}

		return result;
	};

	/* @method Select the more specific token, between the last found one and the new found match. The behaviour of this method is determined by the use of priorities (this.usePriorities) or not.
	* @param {Object} last_result Last matching token. In the case there were no previous found token, this object should have a property length with -1 as a value
	* @param {String} matching_string The new found string that match the input stream
	* @param {Terminal} terminal Terminal used to match the matching_string string
	* @returns {Object} A token object
	* {Number} result.length Length of the matched string
	* {Number} result.line Line number where token was found or expected
	* {Number} result.character Position where the token was found or expected
	* {String} result.string String matched
	* {Terminal} result.terminal matching terminal*/
	lexer.prototype._chooseMoreSpecifcSingleToken = function (last_result, matching_string, terminal)
	{
		if (last_result.length < 0 || !last_result.terminal)
		{
			//if there are no previous result, the new found string is the new one.
			return {
				length: matching_string.length,
				string: matching_string,
				line: this._line,
				character: this._character,
				terminal: terminal
			};
		}

		if (this.usePriorities && terminal.priority > last_result.terminal.priority)
		{
			return {
				length: matching_string.length,
				string: matching_string,
				line: this._line,
				character: this._character,
				terminal: terminal
			};
		}
		else
		{
			if (last_result.length < matching_string.length)
			{
				return {
					length: matching_string.length,
					string: matching_string,
					line: this._line,
					character: this._character,
					terminal: terminal
				};
			}
			return last_result;
		}
	};

	/* @method Searh for the next token the in the current inputStream.
	* IMPORTANT: In order to call this function the inputStream should not be null neither the empty string.
	* @returns {Object} An object representing the current finded token.
	* {Number} result.length Length of the matched string
	* {String} result.string String matched
	* {Terminal} result.terminal matching terminal */
	lexer.prototype._searchNextToken = function ()
	{
		var result = this.useMultipleMatching ?
			[] :
			{
				length: -1
			},
			body;

		k.utils.obj.each(this.grammar.terminals, function (terminal)
		{
			body = terminal.body;
			//If it's reg exp and match (this.inputStream.search(body) returns the index of matching which evals to false so !)
			if (body instanceof RegExp && !this.inputStream.search(body))
			{
				var match = body.exec(this.inputStream)[0];
				result = this._chooseMoreSpecifcToken(result, match, terminal);
			}

			//if it is a string check if they are the same
			else if (k.utils.obj.isString(body) && k.utils.str.startsWith(this.inputStream, body) )
			{
				result = this._chooseMoreSpecifcToken(result, body, terminal);
			}
		}, this);

		return result;
	};

	/* @method Filter found token/s and update the inputStream
	* @param {Object|Array<Object>} result Found token in the case of not usign multi-matching or an array of found tokens.
	* @param {Array<String>} validNextTerminals Array of valid next terminal NAMES. This value is used when the lexer is configure to use multi-matching
	* @returns {Object} An object representing the current finded token.
	* {Number} result.length Length of the matched string
	* {String} result.string String matched
	* {Terminal} result.terminal matching terminal */
	lexer.prototype._filterAndCleanResult = function (result, validNextTerminals)
	{
		var filter_result = {};
		if (this.useMultipleMatching)
		{
			filter_result = this._filterAndCleanMultiMatchingResults(result, validNextTerminals);
		}
		else
		{
			filter_result =  this._filterAndCleanSingleResult(result);
		}


		if (filter_result.length === -1)
		{
			//if there is no valid match, we return the current input stream as an error
			filter_result = this._getErrorResult();
		}
		else
		{
			//If there is a match
			this._updatePosition(filter_result.string);

			filter_result.line = this._line;
			filter_result.character = this._character;
			filter_result.ignoredString = this._ignoredString;

			this.inputStream = this.inputStream.substr(filter_result.length);
			this._clearStream();
		}

		return filter_result;
	};

	/* @method In case the found token, result param, is a valid match update the line and catacter positions and set those values in the result
	* @param {Object} result Found token.
	* @returns {Object} An object representing the current finded token.
	* {Number} result.length Length of the matched string
	* {String} result.string String matched
	* {Terminal} result.terminal matching terminal */
	lexer.prototype._filterAndCleanSingleResult = function (result)
	{
		return result;
	};

	/* @method Filter list of found tokens and return the most appropriate one
	* @param {Array<Object>} result Array of found tokens.
	* @param {Array<String>} validNextTerminals Array of valid next terminal NAMES.
	* @returns {Object} An object representing the current finded token.
	* {Number} result.length Length of the matched string
	* {String} result.string String matched
	* {Terminal} result.terminal matching terminal */
	lexer.prototype._filterAndCleanMultiMatchingResults = function (results, validNextTerminals)
	{
		//If using priorities feature the array of result should already be sorted!
		//IMPORTANT: It is recommended to use priorities feature when using multi-matching, otherwise the returning
		//token will be defined based on the order in which they were defined in the grammar!
		var final_result = k.utils.obj.find(results, function (token)
		{
			return k.utils.obj.contains(validNextTerminals, token.terminal.name);
		});

		return final_result || {length:-1};
	};

	/* @method Get next input token
	* @param {Array<String>} validNextTerminals Array of valid next terminal NAMES. This value is used when the lexer is configure to use multi-matching
	* @returns {Object} An object representing the current found token.
	* {Number} result.length Length of the matched string, -1 if there is not matching
	* {String} result.error Error description in case of error, undefiend otherwise
	* {Number} result.line Line number where token was found or expected
	* {Number} result.character Position where the token was found or expected
	* {String} result.string String matched
	* {Terminal} result.terminal matching terminal */
	lexer.prototype.getNext = function (validNextTerminals)
	{
		var result = {
				length: -1
			},
			grammarHasEmptyRules;

		if (this.inputStream === null)
		{
			//finished input stream
			result = {
				length: -1,
				line: this._line,
				character: this._character,
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
					line: this._line,
					character: this._character,
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
			result = this._filterAndCleanResult(result, validNextTerminals);
		}

		return result;
	};

	return lexer;
})();

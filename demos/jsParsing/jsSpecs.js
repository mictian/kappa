/* global expect: true, describe: true, it:  true, beforeEach: true, jasmine: true, spyOn:true, kappa:true, k:true */
describe('JS Grammar', function ()
{
	var validateString = function (parserContainer, string)
	{
		parserContainer.lexer.setStream(string);
		var parsingValue = parserContainer.parser.parse(parserContainer.lexer);
		expect(parsingValue.error).toBeFalsy();
	};

	it('should recognize some basic JS lines of code', function ()
	{
		var pContainer = kappa.parser.parserCreator.create(
			{
				grammar: jsGrammar(kappa),
				lexer: {
					usePriorities: true,
					useMultipleMatching: true
				}
			}),
			valStr = validateString.bind(validateString, pContainer)

		valStr('{}');
		valStr('{{}}');
		valStr('{{{}}}');
		valStr('{var a = this;}');
		valStr('{var a = null;}');
		valStr('{var a = variableName;}');
		valStr('{var a = true;}');
		valStr('{var a = false;}');
		valStr('{var a,b,c;}');
		valStr('{var a = 12.12E33;}{var a,b,c;}');
		valStr('var a =.12e+5;');
		valStr('var a =.12e-5;');
		valStr('var a =.12;');
		valStr('var a =0x123;{}');
		valStr('var a =0x1FA;{}');
		valStr('var a =0xBA;{}');
		valStr('var a =object;{}');
		valStr('{{var a =e;}}');
		valStr('{{var a =					e;}}');
		valStr('{{var a =	"				";}}');
		valStr('{{var a =	"    ";}}');
		valStr('{{var a = "";}}');
		valStr('{{var a = "this i a test";}}');
		valStr('var a = "\xAF Rojo";');
		valStr('var a = "\n";');
		valStr('var a = "\t";');
		valStr('var a = "\xF8";');
		valStr('var a = "\u000A";');
	});
});
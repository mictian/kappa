$(document).ready(function ()
{
    var pContainer = kappa.parser.parserCreator.create(
			    {
					grammar: sampleGrammars.arithmetic.g
				});

    $('#inputarea').keypress(function (e)
    {
        if (e.which == 13)
        {
            var $text = $(e.target);
            pContainer.lexer.setStream($text.val());

            var parsingValue = pContainer.parser.parse(pContainer.lexer);
            if (parsingValue)
            {
                $('#result').text(parsingValue.currentValue);
            }
            else
            {
                $('#result').text('Invalid input, please try again!');
            }
        }
    });
});
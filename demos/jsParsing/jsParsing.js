$(document).ready(function ()
{
    var pContainer = kappa.parser.parserCreator.create(
			    {
					grammar: jsGrammar(kappa)
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
                // $('#result').text(parsingValue.currentValue);
                $('#result').text('RECOGNIZED');
            }
            else
            {
                $('#result').text('Invalid input, please try again!');
            }
        }
    });
});